/* Imports */
import React, { Component } from 'react'
import { Image, View, TouchableOpacity, Platform, SafeAreaView, FlatList } from 'react-native'
import { Label, CardItem, Text, Button, Toast } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import Moment from 'moment';

import { DateFormat, Messages, UserDataKeys } from '../../../Components/Constants';
import { Images, Colors, Metrics } from '../../../Themes';
import CommonFunctions from '../../../Components/CommonFunctions';
import ApiHelper from '../../../Components/ApiHelper';
import LoaderBar from '../../../Components/LoaderBar';

// Styless
import styles from './Styles/AccountEventsStyles'

class AccountEvents extends Component {

  // Life cycle of class
  /* Initiating state before the component mount. */
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      dataSource: [],
      ticketTitle: 'Ticket',
    };

    this.openRowRefs = [];
  }
  
  componentDidMount() {
    CommonFunctions.retrieveData(UserDataKeys.Config)
      .then((response) => {
        let config = JSON.parse(response)
        let arrOptions = CommonFunctions.floatingMenus(config, config.user)
        this.setState({ flotingMenuDataSource: arrOptions })
        var ticketTitle = 'Ticket'
        if (config.is_customnames) {
          ticketTitle = config.names.ticket.s ?? 'Ticket'
        }
        this.setState({ ticketTitle: ticketTitle })
      })
  
    if (this.props.account) {
      this.setState({ account: this.props.account })
      setTimeout(() => {
        this.fetchEvents()
        this.props.mainState.subs = [
          this.props.mainState.props.navigation.addListener('didFocus', this.viewWillAppear)
        ]
      }, 100)
    }
  }

  /* Calling api to refresh data when view will appears */
  viewWillAppear = () => {
    if (!this.state.loading && this.props.mainState && this.props.mainState.state.selectedTab == 'Events') {
      this.fetchEvents()
    }
  }

  componentWillUnmount() {
    if (this.props && this.props.mainState && this.props.mainState.sub) {
        this.props.mainState.subs.forEach((sub) => {
            sub.remove();
        });
    }
}

  //Class Methods

  /* Calling api to fetch Events */
  fetchEvents = async () => {
    let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
    let objData = { account_ids: `${this.props.account.id}`, is_calendar: true, date: Moment().format(DateFormat.YYYYMMDD), end_date: Moment().add(30, 'days').format(DateFormat.YYYYMMDD) }
    ApiHelper.getWithParam(ApiHelper.Apis.Events, objData, this, true, authHeader).then((response) => {
      this.setState({ dataSourceMain: response, dataSource: response })
    })
      .catch((response) => {
        ApiHelper.handleErrorAlert(response)
      })
  }


  /* Calling api to delete todo */
  deleteEvent(row) {
    let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
    let objData = {}
    ApiHelper.deleteWithParam(ApiHelper.Apis.Events + `/${row.item.event_id}`, objData, this, true, authHeader).then((response) => {
      const arrSource = this.state.dataSource
      arrSource.splice(row.index, 1)
      this.setState({ dataSource: arrSource });
      Toast.show({
        text: `Event #${row.item.subject} has been removed.`,
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

  /* Redering no data view */
  renderNoData() {
    if (this.state.loading && this.state.dataSource.length == 0 && (this.props.account)) {
      return (
        <Animatable.View animation={'fadeIn'} style={styles.noDataContainer}>
          <Label style={styles.noDataTitleStyle}>
           Events will appear here.
          </Label>
        </Animatable.View>
      )
    } else if (!this.state.loading && this.state.dataSource.length == 0) {
      return (
        <Animatable.View animation={'zoomIn'} delay={100} style={[styles.noDataContainer, { flexGrow: 1, justifyContent: 'flex-end' }]}>
          <Image style={styles.noDataIcon} source={Images.nodata} />
          <Label style={styles.noDataTitleStyle}>
            {Messages.NoData}
          </Label>
        </Animatable.View>
      )
    }
    return (null)
  }

  /* Rendering events row */
  renderRow(row) {
    return (
      <Animatable.View useNativeDriver={true} animation={'fadeInUpBig'} >
        <CardItem button activeOpacity={1} style={styles.reusableRowContainer} onPress={() => {
          if (row.item && row.item.ticket_id && row.item.ticket_id != null && row.item.ticket_id != 0) {
            this.props.mainState.props.navigation.push('TicketDetails', { ticket: { key: row.item.ticket_id, number: row.item.ticket_number, subject: row.item.ticket_subject, status: '' } });
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

  /* What to display on the screen */
  render() {
    return (
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
                        this.props.mainState.props.navigation.push('AddEditEvent', { event: data.item, account: this.props.account });
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
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 4 }}>
            <LoaderBar show={this.state.loading} />
          </View>
        </View>
      </SafeAreaView>
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
export default connect(mapStateToProps)(AccountEvents);