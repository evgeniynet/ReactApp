/* Imports */
import React, { Component } from 'react'
import { Image, View, TouchableOpacity, Platform, StatusBar, SafeAreaView, FlatList, Keyboard } from 'react-native'
import { Container, Label, CardItem, Button, Text, Toast, Input } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { FloatingAction } from 'react-native-floating-action';
import LinearGradient from 'react-native-linear-gradient';
import { SwipeListView } from 'react-native-swipe-list-view';

import { Messages, UserDataKeys } from '../../../Components/Constants';
import { userInfo, org, authToken } from '../../../Redux/Actions';
import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Images, Colors, Metrics } from '../../../Themes';
import ApiHelper from '../../../Components/ApiHelper';
import LoaderBar from '../../../Components/LoaderBar';
import CommonFunctions from '../../../Components/CommonFunctions';
import AddResponse from '../Accounts/AddResponse';

// Styless
import styles from './Styles/LocationTicketsStyles'

class LocationTickets extends Component {

  // Life cycle of class
  /* Initiating state before the component mount. */
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      searchString: '',
      location: null,
      dataSourceOpen: [],
      dataSourceClose: [],
      activeTicketsTab: 'Open Tickets',
      canRightSwipe: false,
      pageOpen: 0,
      isLoadingMoreOpen: false,
      canLoadMoreOpen: true,
      pageClose: 0,
      isLoadingMoreClose: false,
      canLoadMoreClose: true,
      showAddResponsePopup: false,
      addResponseRow: {},
      isShowSearch: false,
      searchString: '',
      tickets: 'Tickets',
      ticketTitle: 'Ticket',
      locationTitle: 'Location',
      config: {}
    };
    this.onEndReachedCalledDuringMomentum = false
  }

  componentDidMount() {
    this.setState({
      loading: false,
      searchString: '',
      location: null,
      dataSourceOpen: [],
      dataSourceClose: [],
      activeTicketsTab: 'Open Tickets',
      canRightSwipe: false,
      pageOpen: 0,
      isLoadingMoreOpen: false,
      canLoadMoreOpen: true,
      pageClose: 0,
      isLoadingMoreClose: false,
      canLoadMoreClose: true,
      showAddResponsePopup: false,
      addResponseRow: {},
      isShowSearch: false,
      searchString: '',
      tickets: 'Tickets',
      ticketTitle: 'Ticket',
      locationTitle: 'Location',
      config: {}
    });

    CommonFunctions.retrieveData(UserDataKeys.Config)
      .then((response) => {
        let config = JSON.parse(response)
        var ticketTitle = 'Ticket'
        var tickets = 'Tickets'
        if (config.is_customnames) {
          tickets = config.names.ticket.p ?? 'Tickets'
          ticketTitle = config.names.ticket.s ?? 'Ticket'
          locationTitle = config.names.location.s ?? 'Location'
        }
        this.setState({ ticketTitle: ticketTitle, tickets: tickets, locationTitle: locationTitle, config: config, activeTicketsTab: `Open ${tickets}` })
      })

    if (this.props.navigation.state.params !== undefined) {
      if (this.props.navigation.state.params.location !== undefined) {
        this.setState({ location: this.props.navigation.state.params.location })
        // setTimeout(() => {
        this.viewWillAppear()
        // }, 100)
      }
    }

    this.props.navigation.addListener('didFocus', this.viewWillAppear)
  }

  viewWillAppear = async () => {
    if (!this.state.loading) {
      this.setState({
        pageOpen: 0,
        isLoadingMoreOpen: false,
        canLoadMoreOpen: true,
        pageClose: 0,
        isLoadingMoreClose: false,
        canLoadMoreClose: true,
      })
      setTimeout(() => {
        if (this.state.location) {
          this.fetchOpenTicket()
          this.fetchCloseTickets()
        }
      }, 100)
    }
  }

  componentWillUnmount() {
    Keyboard.dismiss();
  }

  //Actions

  /* Filtering location based on searched text */
  searchNow() {
    if (this.state.searchString.trim() !== '') {
      if (this.state.activeTicketsTab == `Closed ${this.state.tickets}`) {
        const arrSearchResult = this.state.dataSourceCloseMain.filter((obj) => {
          let strSearch = this.state.searchString.toLocaleLowerCase()
          return obj.subject.toLocaleLowerCase().includes(strSearch) //obj.startsWith(value)
        })
        this.setState({ dataSourceClose: arrSearchResult })
      } else {
        const arrSearchResult = this.state.dataSourceOpenMain.filter((obj) => {
          let strSearch = this.state.searchString.toLocaleLowerCase()
          return obj.subject.toLocaleLowerCase().includes(strSearch) //obj.startsWith(value)
        })
        this.setState({ dataSourceOpen: arrSearchResult })
      }
    } else {
      this.setState({ dataSourceClose: this.state.dataSourceCloseMain, dataSourceOpen: this.state.dataSourceOpenMain })
    }
  }

  /* Calling api to load more data */
  handleLoadMore() {
    if (!this.state.loading) {
      setTimeout(() => {
        if (this.state.location) {
          if (this.state.activeTicketsTab == `Open ${this.state.tickets}` && !this.state.isLoadingMoreOpen && this.state.canLoadMoreOpen) {
            this.setState({ pageOpen: this.state.pageOpen + 1, isLoadingMoreOpen: true })
            this.fetchOpenTicket()
          } else if (this.state.activeTicketsTab == `Closed ${this.state.tickets}` && !this.state.isLoadingMoreClose && this.state.canLoadMoreClose) {
            this.setState({ pageClose: this.state.pageClose + 1, isLoadingMoreClose: true })
            this.fetchCloseTickets()
          }
        }
      }, 100)
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

  /* Calling api to fetch open tickets */
  fetchOpenTicket = async () => {
    var authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
    var objData = {}
    if (this.state.pageOpen == 0) {
      objData = { limit: 6, status: 'open,onhold', location: this.state.location.id, account: this.state.location.account_id }
    } else {
      objData = { limit: 6, page: this.state.pageOpen, status: 'open,onhold', location: this.state.location.id, account: this.state.location.account_id }
    }
    this.onEndReachedCalledDuringMomentum = false
    ApiHelper.getWithParam(ApiHelper.Apis.Tickets, objData, this, true, authHeader).then((response) => {
      if (this.state.pageOpen !== 0) {
        if (response.length == 0) {
          this.setState({ pageOpen: this.state.pageOpen - 1, canLoadMoreOpen: false })
        } else if (response.length < 6) {
          this.setState({ canLoadMoreOpen: false })
        }
        let arr = [...this.state.dataSourceOpen, ...response]
        this.setState({ dataSourceOpen: arr, dataSourceOpenMain: arr, isLoadingMoreOpen: false })
      } else {
        this.setState({ dataSourceOpen: response, dataSourceOpenMain: response })
      }
    })
      .catch((response) => {
        this.setState({ isLoadingMoreOpen: false })
        ApiHelper.handleErrorAlert(response)
      })
  }

  /* Calling api to fetch closed tickets */
  fetchCloseTickets = async () => {
    var authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
    var objData = {}
    if (this.state.pageClose == 0) {
      objData = { limit: 6, status: 'closed', location: this.state.location.id, account: this.state.location.account_id }
    } else {
      objData = { limit: 6, page: this.state.pageClose, status: 'closed', location: this.state.location.id, account: this.state.location.account_id }
    }
    this.onEndReachedCalledDuringMomentum = false
    ApiHelper.getWithParam(ApiHelper.Apis.Tickets, objData, this, true, authHeader).then((response) => {
      if (this.state.pageClose !== 0) {
        if (response.length == 0) {
          this.setState({ pageClose: this.state.pageClose - 1, canLoadMoreClose: false })
        } else if (response.length < 6) {
          this.setState({ canLoadMoreClose: false })
        }
        let arr = [...this.state.dataSourceClose, ...response]
        this.setState({ dataSourceClose: arr, dataSourceCloseMain: arr, isLoadingMoreClose: false })
      } else {
        this.setState({ dataSourceClose: response, dataSourceCloseMain: response })
      }
    })
      .catch((response) => {
        this.setState({ isLoadingMoreClose: false })
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
      const arrCloseSource = this.state.dataSourceClose
      arrCloseSource.splice(row.index, 1)
      const arrCloseSourceMain = this.state.dataSourceCloseMain
      for (let index = 0; index < arrCloseSourceMain.length; index++) {
        const element = arrCloseSourceMain[index];
        if (element.id == row.item.id) {
          arrCloseSourceMain.splice(index, 1)
        }
      }

      var arrOpenSource = this.state.dataSourceOpen
      arrOpenSource.unshift(row.item)
      var arrOpenSourceMain = this.state.dataSourceOpenMain
      arrOpenSourceMain.unshift(row.item)

      this.setState({ dataSourceClose: arrCloseSource, dataSourceOpen: arrOpenSource, dataSourceCloseMain: arrCloseSourceMain, dataSourceOpenMain: arrOpenSourceMain });

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
    if (this.state.loading && ((this.state.pageOpen == 0 && (this.state.activeTicketsTab == `Open ${this.state.tickets}`) && this.state.dataSourceOpen.length == 0) || this.state.pageClose == 0 && ((this.state.activeTicketsTab == `Closed ${this.state.tickets}`) && this.state.dataSourceClose.length == 0))) {
      return (
        <Animatable.View animation={'fadeIn'} style={styles.noDataContainer}>
          <Label style={styles.noDataTitleStyle}>
            {`${this.state.tickets} will appear here.`}
          </Label>
        </Animatable.View>
      )
    } else if (!this.state.loading && this.state.searchString.trim() !== '' && (((this.state.activeTicketsTab == `Open ${this.state.tickets}`) && this.state.dataSourceOpen.length == 0) || ((this.state.activeTicketsTab == `Closed ${this.state.tickets}`) && this.state.dataSourceClose.length == 0))) {
      return (
        <Animatable.View animation={'zoomIn'} delay={100} style={[styles.noDataContainer, { flex: 1, justifyContent: 'flex-end' }]}>
          <Image style={styles.noDataIcon} source={Images.nosearch} />
          <Label style={styles.noDataTitleStyle}>
            {Messages.NoResultFound}
          </Label>
        </Animatable.View>
      )
    } else if (!this.state.loading && this.state.searchString.trim() === '' && (((this.state.activeTicketsTab == `Open ${this.state.tickets}`) && this.state.dataSourceOpen.length == 0) || ((this.state.activeTicketsTab == `Closed ${this.state.tickets}`) && this.state.dataSourceClose.length == 0))) {
      return (
        <Animatable.View animation={'zoomIn'} delay={100} style={[styles.noDataContainer, { flex: 1, justifyContent: 'flex-end' }]}>
          <Image style={styles.noDataIcon} source={Images.nodata} />
          <Label style={styles.noDataTitleStyle}>
            {Messages.NoData}
          </Label>
        </Animatable.View>
      )
    }
    return (null)
  }

  /* Rendering row */
  renderRow(row) {
    var dec = row.item.initial_post
    dec = dec.replace('\r\n\r\n ', '\n').trim()
    let isShowImgIcon = dec.includes('Following file was uploaded:')
    return (
      <Animatable.View useNativeDriver animation={this.state.searchString.trim().length == 0 ? 'fadeInUpBig' : 'pulse'} >
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
            showTitle={this.state.location ? `${this.state.location.name} ${this.state.tickets}` : this.state.locationTitle}
            rightImage={this.state.isShowSearch ? Images.close : Images.searchInNav}
            hideRightButton={false}
            rightButton={() => {
              if (this.state.searchString.trim() != "") {
                this.setState({
                  searchString: "",
                  dataSourceOpen: this.state.dataSourceOpenMain,
                  dataSourceClose: this.state.dataSourceCloseMain
                })
              } else {
                this.setState({
                  isShowSearch: !(this.state.isShowSearch),
                })
                setTimeout(() => this.state.isShowSearch && this.searchRef._root.focus(), 600)
              }
            }}
          />
        </SafeAreaView>
        {this.state.isShowSearch ? <Animatable.View animation={'fadeIn'} style={styles.searchContainer}>
          <Input
            style={styles.searchInput}
            placeholder={`Search ${this.state.locationTitle}`}
            placeholderTextColor={Colors.placeholder}
            value={this.state.searchString}
            onChangeText={value => {
              this.setState({
                searchString: value
              })
              setTimeout(() => {
                this.searchNow()
              }, 100)
            }}
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
        </Animatable.View> : null}
        <LoaderBar show={this.state.loading} />
        <View style={styles.contentContainer}>
          <SafeAreaView style={styles.mainContainer}>

            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              colors={
                [Colors.mainPrimary,
                Colors.secondary]}
              style={styles.tabBarContainer}>

              <View style={styles.tabBarSubContainer}>
                <TouchableOpacity activeOpacity={0.7} style={styles.tabButton} onPress={() => {
                  if (!this.state.loading) {
                    Keyboard.dismiss();
                    this.setState({
                      activeTicketsTab: `Open ${this.state.tickets}`,
                      searchString: "",
                      dataSourceOpen: this.state.dataSourceOpenMain,
                      dataSourceClose: this.state.dataSourceCloseMain
                    })
                    setTimeout(() => {
                      if (this.state.location && this.state.dataSourceOpen.length == 0) {
                        this.fetchOpenTicket()
                      }
                    }, 100)
                  }
                }}>
                  {this.state.activeTicketsTab == `Open ${this.state.tickets}` ?
                    <Animatable.View style={[styles.backgroundImage, { borderRadius: Metrics.baseMargin, overflow: 'hidden' }]} animation={'pulse'}>
                      <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        colors={
                          [Colors.mainPrimary,
                          Colors.secondary]}
                        style={{ flex: 1 }}
                      />
                    </Animatable.View>
                    : null}
                  {this.state.activeTicketsTab == `Open ${this.state.tickets}` ?
                    <Animatable.View animation={'pulse'}>
                      <Label style={styles.tabCount}>{this.state.location && this.state.location.tickets_count ? this.state.location.tickets_count : this.state.dataSourceOpen.length}</Label>
                    </Animatable.View>
                    : null}
                  <Label style={[styles.tabTitle, this.state.activeTicketsTab == `Open ${this.state.tickets}` ? styles.tabSelectedTitle : {}]}>{`Open ${this.state.tickets}`}</Label>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} style={styles.tabButton} onPress={() => {
                  if (!this.state.loading) {
                    Keyboard.dismiss();
                    this.setState({
                      activeTicketsTab: `Closed ${this.state.tickets}`,
                      searchString: "",
                      dataSourceOpen: this.state.dataSourceOpenMain,
                      dataSourceClose: this.state.dataSourceCloseMain
                    })
                    setTimeout(() => {
                      if (this.state.location && this.state.dataSourceClose.length == 0) {
                        this.fetchCloseTickets()
                      }
                    }, 100)
                  }
                }}>
                  {this.state.activeTicketsTab == `Closed ${this.state.tickets}` ?
                    <Animatable.View style={[styles.backgroundImage, { borderRadius: Metrics.baseMargin, overflow: 'hidden' }]} animation={'pulse'}>
                      <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        colors={
                          [Colors.mainPrimary,
                          Colors.secondary]}
                        style={{ flex: 1 }}
                      />
                    </Animatable.View>
                    : null}
                  <Label style={[styles.tabTitle, this.state.activeTicketsTab == `Closed ${this.state.tickets}` ? styles.tabSelectedTitle : {}]}>{`Closed ${this.state.tickets}`}</Label>
                </TouchableOpacity>
              </View>

            </LinearGradient>
            <View style={styles.mainContainer}>
              {this.renderNoData()}
              {this.renderAddResponse()}
              <SwipeListView
                ref={(ref) => { this.flatLisRef = ref }}
                contentContainerStyle={styles.flatListPadding}
                disableRightSwipe
                data={this.state.activeTicketsTab == `Open ${this.state.tickets}` ? this.state.dataSourceOpen : this.state.dataSourceClose}
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
                      {this.state.activeTicketsTab == `Open ${this.state.tickets}` ?
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
                onEndReachedThreshold={0.05}
                onEndReached={() => this.handleLoadMore()}
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
export default connect(mapStateToProps)(LocationTickets);