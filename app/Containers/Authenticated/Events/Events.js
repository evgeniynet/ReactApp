/* Imports */
import React, { Component } from 'react'
import { Image, View, TouchableOpacity, Platform, StatusBar, SafeAreaView, Keyboard } from 'react-native'
import { Container, Input, Label, CardItem, Button, Text, Toast } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import Moment from 'moment';
import { SwipeListView } from 'react-native-swipe-list-view';

import { Messages, DateFormat, UserDataKeys } from '../../../Components/Constants';
import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Images, Colors, Metrics } from '../../../Themes';
import LinearGradient from 'react-native-linear-gradient';
import ApiHelper from '../../../Components/ApiHelper';
import LoaderBar from '../../../Components/LoaderBar';
import CommonFunctions from '../../../Components/CommonFunctions';

// Styless
import styles from './Styles/EventsStyles'

class Events extends Component {

  // Life cycle of class
  /* Initiating state before the component mount. */
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      searchString: '',
      dataSource: [],
      isShowSearch: false,
      dataSourceMain: [],
      page: 0,
      isLoadingMore: false,
      canLoadMore: true,
      flotingMenuDataSource: [],
      config: null,
    };
  }

  componentDidMount() {
    this.setState({
      loading: true,
      searchString: '',
      dataSource: [],
      dataSourceMain: [],
      isShowSearch: false,
      page: 0,
      isLoadingMore: false,
      canLoadMore: true,
      flotingMenuDataSource: [],
      config: null,
    });

    CommonFunctions.retrieveData(UserDataKeys.Config)
      .then((response) => {
        let config = JSON.parse(response)
        let arrOptions = CommonFunctions.floatingMenus(config, config.user)
        this.setState({ flotingMenuDataSource: arrOptions, config })
      })
      .catch((err) => {
        console.log('Error====================================', err);
      })

    setTimeout(() => {
      this.setState({
        dataSource: this.state.dataSourceMain
      })
    }, 100)

    CommonFunctions.retrieveData(UserDataKeys.EventSwipeToDelete)
      .then((result) => {
        if (result === null || result !== '1') {
          this.setState({ showSwipwToDeletePreview: true })
          setTimeout(() => CommonFunctions.storeData(UserDataKeys.EventSwipeToDelete, '1'), 3000)
        }
      })

    this.viewWillAppear()
    this.props.navigation.addListener('didFocus', this.viewWillAppear)
  }


  viewWillAppear = () => {
    let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))

    let objData = { is_calendar: true, date: Moment().format(DateFormat.YYYYMMDD), end_date: Moment().add(30, 'days').format(DateFormat.YYYYMMDD) }
    ApiHelper.getWithParam(ApiHelper.Apis.Events, objData, this, true, authHeader).then((response) => {
      this.setState({ dataSourceMain: response, dataSource: response })
    })
      .catch((response) => {
        ApiHelper.handleErrorAlert(response)
      })
  }

  componentWillUnmount() {
    Keyboard.dismiss();
  }

  //Actions

  /* Filtering events based on searched text */
  searchNow() {
    if (this.state.searchString.trim() !== '') {
      const arrSearchResult = this.state.dataSourceMain.filter((obj) => {
        let strSearch = this.state.searchString.toLocaleLowerCase()
        return obj.subject.toLocaleLowerCase().includes(strSearch) || obj.account_name.toLocaleLowerCase().includes(strSearch) //obj.startsWith(value)
      })
      this.setState({ dataSource: arrSearchResult })
    } else {
      this.setState({ dataSource: this.state.dataSourceMain })
    }
  }

  //Class Methods

  /* Calling api to delete event */
  deleteEvent(row) {
    let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
    let objData = {}
    ApiHelper.deleteWithParam(ApiHelper.Apis.Events + `/${row.item.event_id}`, objData, this, true, authHeader).then((response) => {
      const arrSource = this.state.dataSource
      arrSource.splice(row.index, 1)
      this.setState({ dataSource: arrSource });
      Toast.show({
        text: `Event ${row.item.subject} has been removed.`,
        position: 'top',
        duration: 3000,
        type: 'success',
        style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
      })
    })
      .catch((response) => {
        ApiHelper.handleErrorAlert(response)
      })
  }

  /* Rendering row */
  renderRow(row) {
    return (
      <Animatable.View useNativeDriver={true} animation={this.state.searchString.trim().length == 0 ? 'fadeInUpBig' : 'fadeInUpBig'} >
        <CardItem button activeOpacity={1} style={styles.reusableRowContainer} onPress={() => {
          if (row.item && row.item.ticket_id && row.item.ticket_id != null && row.item.ticket_id != 0) {
            this.props.navigation.push('TicketDetails', { ticket: { key: row.item.ticket_id, number: row.item.ticket_number, subject: row.item.ticket_subject, status: '' } });
          }
        }}>
          {/* <View style={{ flex: 1 }}> */}
          <Label style={styles.titleNameText}>{row.item.subject}</Label>
          {row.item.account_name ?
            <Label style={styles.nameText}>{row.item.account_name}</Label>
            : null}
          {row.item.description ? <Label style={styles.descriptionText}>{row.item.description}</Label> : null}
          <View style={styles.gridContainer}>
            <View style={styles.itemContainer}>
              <View style={styles.dateContainer}>
                <Image style={styles.dateIcon} source={Images.dateIcon} />
                <Label style={[styles.titleText, { marginTop: 0 }]}>Start Date</Label>
              </View>
              {/* this.props.configInfo && this.props.configInfo.timezone_offset ? Moment(row.item.start_date).utcOffset(this.props.configInfo.timezone_offset).format(DateFormat.DDMMMYYYYHMMA) : Moment(row.item.start_date).utc().format(DateFormat.DDMMMYYYYHMMA) */}
              {/* row.item && row.item.timezone_offset ? Moment(row.item.start_date).utcOffset(row.item.timezone_offset).format(DateFormat.DDMMMYYYYHMMA) : Moment(row.item.start_date).utc().format(DateFormat.DDMMMYYYYHMMA) */}
              <Label style={styles.dateText}>{row.item && row.item.timezone_offset ? Moment(row.item.start_date).utcOffset(row.item.timezone_offset).local().format(DateFormat.DDMMMYYYYHMMA) : Moment(row.item.start_date).utc().format(DateFormat.DDMMMYYYYHMMA)}</Label>
            </View>
            <View style={styles.itemContainer}>
              <View style={styles.dateContainer}>
                <Image style={styles.dateIcon} source={Images.dateIcon} />
                <Label style={[styles.titleText, { marginTop: 0 }]}>End Date</Label>
              </View>
              <Label style={styles.dateText}>{row.item && row.item.timezone_offset ? Moment(row.item.end_date).utcOffset(row.item.timezone_offset).local().format(DateFormat.DDMMMYYYYHMMA) : Moment(row.item.end_date).utc().format(DateFormat.DDMMMYYYYHMMA)}</Label>
            </View>
          </View>
          {row.item.ticket_name ?
            <Label style={[styles.titleText, { marginTop: 15 }]}>Ticket <Label style={styles.ticketText}>{`#${row.item.ticket_name}`}</Label></Label>
            : null}
          {/* </View> */}
          <View style={styles.gridContainer}>
            <View style={styles.itemContainer}>
              <Label style={styles.titleText}>Type</Label>
              <Label style={styles.valueText}>{row.item.event_type_name}</Label>
            </View>
            {/* {row.item.tech_name ? */}
            <View style={styles.itemContainer}>
              <Label style={styles.titleText}>Technician</Label>
              <Label style={styles.valueText}>{row.item.tech_name || '-'}</Label>
            </View>
            {/* // : null } */}
          </View>
          <View style={styles.gridContainer}>
            {row.item.project_name ?
              <View style={styles.itemContainer}>
                <Label style={styles.titleText}>Project</Label>
                <Label style={styles.valueText}>{row.item.project_name}</Label>
              </View>
              : null}
          </View>
        </CardItem>
      </Animatable.View>
    )
  }

  /* Rendering no data view */
  renderNoData() {
    if (this.state.loading && this.state.dataSource.length == 0) {
      return (
        <Animatable.View animation={'fadeIn'} style={styles.noDataContainer}>
          <Label style={styles.noDataTitleStyle}>
            Events will appear here.
          </Label>
        </Animatable.View>
      )
    } else if (!this.state.loading && this.state.searchString.trim() !== '' && this.state.dataSource.length == 0) {
      return (
        <Animatable.View animation={'zoomIn'} style={styles.noDataContainer}>
          <Image style={styles.noDataIcon} source={Images.nosearch} />
          <Label style={styles.noDataTitleStyle}>
            {Messages.NoResultFound}
          </Label>
        </Animatable.View>
      )
    } else if (!this.state.loading && this.state.searchString.trim() == '' && this.state.dataSource.length == 0 && this.state.dataSourceMain.length == 0) {
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
            showTitle='Events'
            rightImage={this.state.isShowSearch ? Images.close : Images.searchInNav}
            hideRightButton={false}
            rightButton={() => {
              if (this.state.searchString.trim() != "") {
                this.setState({
                  searchString: "",
                  dataSource: this.state.dataSourceMain
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
        <LoaderBar show={this.state.loading} />
        {this.state.isShowSearch ? <Animatable.View animation={'fadeIn'} style={styles.searchContainer}>
          <Input
            style={styles.searchInput}
            placeholder={'Search events'}
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
        <View style={styles.contentContainer}>
          <SafeAreaView style={styles.mainContainer}>
            <View style={styles.mainContainer}>
              {this.renderNoData()}
              <SwipeListView
                ref={(ref) => { this.flatLisRef = ref }}
                contentContainerStyle={styles.flatListPadding}
                disableRightSwipe
                data={this.state.dataSource}
                renderItem={(row) => this.renderRow(row)}
                keyExtractor={(item, index) => index.toString()}
                renderHiddenItem={(data, rowMap) => (
                  <View style={styles.rowBack}>
                    <Animatable.View animation={'zoomIn'} delay={650} style={[styles.backBtnRightContainer]}>
                      <Button transparent style={styles.backRightBtnRight} onPress={() => {
                        this.flatLisRef.safeCloseOpenRow();
                        this.props.navigation.push('AddEditEvent', { event: data.item });
                      }}>
                        <Image style={styles.swipeActionButtonIcon} source={Images.edit} />
                        <Text style={[styles.backTextWhite, { color: Colors.green }]} uppercase={false}>Edit</Text>
                      </Button>
                      <Button transparent style={styles.backRightBtnRight} onPress={() => {
                        this.flatLisRef.safeCloseOpenRow() //.safeCloseOpenRow();
                        CommonFunctions.presentAlertWithAction(`Do you really want to remove Event - ${data.item.subject}`, 'Delete').then((isYes) => {
                          this.deleteEvent(data);
                        })
                      }}>
                        <Image style={styles.swipeActionButtonIcon} source={Images.swipeToDelete} />
                        <Text style={[styles.backTextWhite, { color: Colors.placeholderError }]} uppercase={false}>Delete</Text>
                      </Button>
                    </Animatable.View>
                  </View>
                )}
                leftOpenValue={226}
                rightOpenValue={-226}
                previewRowKey={this.state.showSwipwToDeletePreview ? '0' : ''}
                previewOpenValue={-170}
                previewOpenDelay={1000}
                onEndReachedThreshold={0.05}
              // onEndReachedThreshold={0.05}
              // onEndReached={() => this.handleLoadMore()}
              />
            </View>
            <TouchableOpacity activeOpacity={0.7} style={styles.floatingContainer} onPress={() => {
              this.props.navigation.push('AddEditEvent');
            }}>
              <Image style={styles.loginButtonText} source={Images.floatinOption} />
            </TouchableOpacity>
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
export default connect(mapStateToProps)(Events);