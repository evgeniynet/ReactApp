/* Imports */
import React, { Component } from 'react'
import { Image, View, TouchableOpacity, Platform, StatusBar, SafeAreaView, Keyboard } from 'react-native'
import { Container, Input, Label, CardItem, Button, Text, Toast } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';

import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Images, Colors, Metrics } from '../../../Themes';
import LinearGradient from 'react-native-linear-gradient';
import ApiHelper from '../../../Components/ApiHelper';
import LoaderBar from '../../../Components/LoaderBar';
import { Messages, UserDataKeys } from '../../../Components/Constants';
import AddResponse from './AddResponse';
import CommonFunctions from '../../../Components/CommonFunctions';

// Styless
import styles from './Styles/AccountTicketsStyles'

class SearchTickets extends Component {

  // Life cycle of class
  /* Initiating state before the component mount. */
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      searchString: '',
      dataSource: [],
      page: 0,
      isLoadingMore: false,
      canLoadMore: true,
      showAddResponsePopup: false,
      addResponseRow: {},
      title: '',
      ticketTitle: 'Ticket',
      config: {}
    };
  }

  componentDidMount() {
    this.setState({
      loading: false,
      searchString: '',
      dataSource: [],
      page: 0,
      isLoadingMore: false,
      canLoadMore: true,
      showAddResponsePopup: false,
      addResponseRow: {},
      title: '',
      ticketTitle: 'Ticket',
      config: {}
    });

    CommonFunctions.retrieveData(UserDataKeys.Config)
      .then((response) => {
        let config = JSON.parse(response)
        var title = 'Tickets'
        var ticketTitle = 'Ticket'
        if (config.is_customnames) {
          title = config.names.ticket.p ?? 'Tickets'
          ticketTitle = config.names.ticket.s ?? 'Ticket'
        }
        this.setState({ title: title, ticketTitle: ticketTitle, config: config })
        // Call Apis
      }).catch(() => {
        this.setState({ title: 'Tickets' })
      })

    if (this.props.navigation.state.params !== undefined) {
      if (this.props.navigation.state.params.searchText !== undefined) {
        this.setState({ searchString: this.props.navigation.state.params.searchText })
      } else {
        setTimeout(() => this.searchRef && this.searchRef._root.focus(), 600)
      }
    } else {
      setTimeout(() => this.searchRef && this.searchRef._root.focus(), 600)
    }


    this.viewWillAppear()
    this.props.navigation.addListener('didFocus', this.viewWillAppear)
  }

  /* Calling func to refresh data */
  viewWillAppear = () => {
    if (!this.state.loading) {
      this.searchNow()
    }
  }

  componentWillUnmount() {
    Keyboard.dismiss();
  }

  //Actions

  /* Calling api to fetch tickets if search string is not empty and it's empty then setting empty array in state */
  searchNow() {
    if (this.state.searchString.trim() !== '' && this.state.searchString.length > 1) {
      this.setState({
        page: 0, isLoadingMore: false,
        canLoadMore: true,
      })
      setTimeout(() => {
        this.seacrhTickets(this.state.searchString.trim())
      }, 100)
    } else {
      this.setState({ dataSource: [] })
    }
  }

  /* Calling api to load more data */
  handleLoadMore() {
    if (!this.state.loading && !this.state.isLoadingMore && this.state.canLoadMore && this.state.searchString.trim().length > 0) {
      this.setState({ page: this.state.page + 1, isLoadingMore: true })
      setTimeout(() => this.seacrhTickets(this.state.searchString.trim()), 100)
    }
  }

  /* Hidding(Dismissing) popup screen */
  dismissPopup(option) {
    this.setState({ showAddResponsePopup: false })
  }

  /* Setting state on drop down selection change */
  selectionDidChange(dropDownName, selected) {
    if (dropDownName === 'AddResponse') {
      setTimeout(() => {
        this.addReponseTicket(this.state.addResponseRow, selected);
      }, 600)
    }
    this.dismissPopup();
  }

  //Class Methods

  /* Calling api to fetch tickets based on searched text */
  seacrhTickets = (search) => {
    var authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
    var objData = {}
    if (this.state.page == 0) {
      objData = { query: 'all', search: search } //limit: 20,
    } else {
      objData = { page: this.state.page, query: 'all', location: -1, search: search } //limit: 20,
    }
    this.onEndReachedCalledDuringMomentum = false
    ApiHelper.getWithParam(ApiHelper.Apis.Tickets, objData, this, true, authHeader).then((response) => {
      if (this.state.page !== 0) {
        if (response.length == 0) {
          this.setState({ page: this.state.page - 1, canLoadMore: false })
        } else if (response.length < 20) {
          this.setState({ canLoadMore: false })
        }
        let arr = [...this.state.dataSource, ...response]
        this.setState({ dataSource: arr, isLoadingMore: false })
      } else {
        this.setState({ dataSource: response })
      }
    })
      .catch((response) => {
        this.setState({ isLoadingMore: false })
        ApiHelper.handleErrorAlert(response)
      })
  }

  /* Calling api to reopen ticket */
  reopenTicket(row) {
    // CommonFunctions.presentAlertWithAction(Messages.AskReopen + ` #${row.item.number}?`, Messages.ReOpen)
    //     .then((respose) => {
    let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
    let objData = { status: 'open', note_text: '' }
    ApiHelper.putWithParam(ApiHelper.Apis.Tickets + `/${row.item.key}`, objData, this, true, authHeader).then((response) => {
      this.viewWillAppear()
      Toast.show({
        text: `${this.state.ticketTitle} has been reopened #${row.item.number}`,
        position: 'top',
        duration: 3000,
        type: 'success',
        style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
      })
    })
      .catch((response) => {
        ApiHelper.handleErrorAlert(response)
      })
    // })
  }

  /* Calling api to add user response */
  addReponseTicket(row, note) {
    // CommonFunctions.presentAlertWithAction(Messages.AskReopen + ` #${row.item.number}?`, Messages.ReOpen)
    //     .then((respose) => {
    let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
    let objData = { action: 'response', note_text: note, files: [] }
    ApiHelper.postWithParam(ApiHelper.Apis.Tickets + `/${row.item.id}`, objData, this, true, authHeader).then((response) => {
      Toast.show({
        text: `Note added to #${this.state.addResponseRow.item.number}`,
        position: 'top',
        duration: 3000,
        type: 'success',
        style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
      })
    })
      .catch((response) => {
        ApiHelper.handleErrorAlert(response)
      })
    // })
  }

  debounce = (callback, delay) => { 
    let timeout = -1;
    return (...args) => {
      if (timeout !== -1) { clearTimeout(timeout); }
      timeout = setTimeout(() => callback(...args), delay);
    };
  }
  debouncedLog = this.debounce( e => { this.searchNow() }, 1000)
  handleSearchChange = e => {
    this.setState({ searchString: e })
    this.debouncedLog(e);
  }


  /* Rendering popup screen */
  renderAddResponse() {
    if (this.state.showAddResponsePopup) {
      return (
        <AddResponse isShowAsModal={true} number={this.state.addResponseRow.item.number} canDismiss={true} dismissPopup={() => this.dismissPopup()} selectionDidChange={(selected) => { this.selectionDidChange('AddResponse', selected); }} />
      )
    } else {
      return null
    }
  }

  /* Rendering no data view */
  renderNoData() {
    if ((this.state.loading && this.state.dataSource.length == 0)) {
      return (
        <Animatable.View animation={'fadeIn'} style={styles.noDataContainer}>
          <Label style={styles.noDataTitleStyle}>
            {Messages.ResultsWillAppear}
          </Label>
        </Animatable.View>
      )
    } else if (!this.state.loading && this.state.dataSource.length == 0) {
      return (
        <Animatable.View animation={'zoomIn'} delay={800} style={[styles.noDataContainer, { flex: 1, justifyContent: 'flex-end' }]}>
          <Image style={styles.noDataIcon} source={Images.nosearch} />
          <Label style={styles.noDataTitleStyle}>
            {Messages.NoResultFound}
          </Label>
        </Animatable.View>
      )
    }
    return (null)
  }

  /* Rendering row */
  renderRow(row) {
    var dec = row.item.initial_post ?? ''
    dec = dec.replace('\r\n\r\n ', '\n').trim()
    let isShowImgIcon = dec.includes('Following file was uploaded:')
    return (
      <Animatable.View useNativeDriver={true} animation={'pulse'} >
        <CardItem button activeOpacity={1} style={styles.reusableRowContainer} onPress={() => {
          const objData = { ticket: row.item }
          this.props.navigation.push('TicketDetails', objData);
        }}>
          <Label style={styles.ticketNumberText}>{`#${row.item.number}`}</Label>
          <Label style={styles.titleText}>{row.item.subject}</Label>
          <Label numberOfLines={3} style={styles.ticketDescriptionText}>{row.item.plain_initial_post}</Label>
          <View style={styles.userContainer}>
            {/* <Image style={styles.profilePicture} source={{ uri: row.item.image }} /> */}
            <View style={styles.userInfoContainer}>
              <Label style={styles.nameText}>{row.item.user_firstname + ' ' + row.item.user_lastname}</Label>
              <Label style={styles.possitionText}>{row.item.class_name}</Label>
            </View>
            {isShowImgIcon ?
              <TouchableOpacity style={styles.imageContainer}>
                <Image style={styles.icon} source={Images.image} />
              </TouchableOpacity>
              : null}
          </View>
        </CardItem>
      </Animatable.View>
    )
  }

  /* What to display on the screen */
  render() {
    return (
      <Container>
        {StatusBar.setBarStyle('light-content', true)}
        {Platform.OS === 'ios' ? null : StatusBar.setBackgroundColor(Colors.mainPrimary)}
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={
            [Colors.mainPrimary,
            Colors.secondary]}
          style={styles.backgroundImage} />
        <SafeAreaView>
          <NavigationBar
            isTransparent
            navigation={this.props.navigation}
            showTitle={`Search ${this.state.title}`}
          />
        </SafeAreaView>
        <LoaderBar show={this.state.loading} />
        <Animatable.View animation={'fadeIn'} style={styles.searchContainer}>
          <Input
            style={styles.searchInput}
            placeholder={`Search ${this.state.title} (min 4 chars)`}
            placeholderTextColor={Colors.placeholder}
            value={this.state.searchString}
            onChangeText={this.handleSearchChange}
            autoCapitalize='sentences'
            autoCorrect={false}
            returnKeyType={'search'}
            onSubmitEditing={() => {
              this.searchNow()
            }}
            selectionColor={Colors.snow}
            blurOnSubmit={false}
            keyboardAppearance='dark'
            ref={input => {
              this.searchRef = input;
            }}
          />
          <TouchableOpacity style={styles.searchRightIcon} onPress={() => {
            this.searchNow()
          }}>
            <Image style={styles.clearText} source={Images.searchInNav} />
          </TouchableOpacity>
        </Animatable.View>
        <View style={styles.contentContainer}>
          <SafeAreaView style={styles.mainContainer}>
            <View style={styles.mainContainer}>
              {this.renderNoData()}
              {this.renderAddResponse()}
              <SwipeListView
                ref={(ref) => { this.flatLisRef = ref }}
                contentContainerStyle={styles.flatListPadding}
                disableRightSwipe
                data={this.state.dataSource}
                renderItem={(row) => this.renderRow(row)}
                keyExtractor={(item, index) => index.toString()}
                renderHiddenItem={(data, rowMap) => (
                  <View style={styles.rowBack}>
                    <Animatable.View animation={'zoomIn'} delay={650} style={styles.backBtnRightContainer}>
                      <Button transparent style={styles.backRightBtnRight} onPress={() => {
                        this.flatLisRef.safeCloseOpenRow();
                        this.setState({ showAddResponsePopup: true, addResponseRow: data })
                      }}>
                        <Image style={styles.swipeActionButtonIcon} source={Images.addResponse} />
                        <Text style={[styles.backTextWhite, { color: Colors.green }]} uppercase={false}>Add Response</Text>
                      </Button>
                      {data.item.status.toLowerCase() == 'open' ?
                        <Button transparent style={styles.backRightBtnRight} onPress={() => {
                          this.flatLisRef.safeCloseOpenRow();
                          const objData = { ticket: data.item }
                          this.props.navigation.push('CloseTicket', objData);
                        }}>
                          <Image style={styles.swipeActionButtonIcon} source={Images.closeTicket} />
                          <Text style={[styles.backTextWhite, { color: Colors.placeholderError }]} uppercase={false}>{`Close ${this.state.ticketTitle}`}</Text>
                        </Button>
                        : <Button transparent style={styles.backRightBtnRight} onPress={() => {
                          this.flatLisRef.safeCloseOpenRow();
                          this.reopenTicket(data);
                        }}>
                          <Image style={styles.swipeActionButtonIcon} source={Images.reopenticket} />
                          <Text style={[styles.backTextWhite, { color: Colors.green }]} uppercase={false}>{`ReOpen ${this.state.ticketTitle}`}</Text>
                        </Button>}
                    </Animatable.View>
                  </View>
                )}
                leftOpenValue={226}
                rightOpenValue={-226}
                previewRowKey={this.state.showSwipwToDeletePreview ? '0' : ''}
                previewOpenValue={-170}
                previewOpenDelay={1000}
                keyboardShouldPersistTaps='handled'
              />
            </View>
          </SafeAreaView>
        </View>
      </Container>
    )
  }
}

/* Subscribing to redux store for updates */
const mapStateToProps = (state) => {
  const { user } = state.userInfo
  const { org } = state.org
  const { authToken } = state.authToken
  return { authToken, org, user }
};

/* Connecting to redux store and exporting class */
export default connect(mapStateToProps)(SearchTickets);