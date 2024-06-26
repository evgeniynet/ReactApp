/* Imports */
import React, { Component } from 'react'
import { Image, View, TouchableOpacity, Platform, StatusBar, SafeAreaView } from 'react-native'
import { Container, Label, CardItem, Text, Button, Toast } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import Moment from 'moment';
import { SwipeListView } from 'react-native-swipe-list-view';

import { Messages, DateFormat, UserDataKeys } from '../../../Components/Constants';
import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Images, Colors, Metrics } from '../../../Themes';
import LinearGradient from 'react-native-linear-gradient';
import ApiHelper from '../../../Components/ApiHelper';
import CommonFunctions from '../../../Components/CommonFunctions';
import LoaderBar from '../../../Components/LoaderBar';

// Styless
import styles from './Styles/TimelogsStyles'

class Timelogs extends Component {

  // Life cycle of class
  /* Initiating state before the component mount. */
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      searchString: '',
      dataSource: [],
      flotingMenuDataSource: [],
      page: 0,
      isLoadingMore: false,
      canLoadMore: true,
      account: null,
      ticketTitle: 'Ticket',
      isFromDashbord: false,
    };
  }

  componentDidMount() {
    this.setState({
      loading: false,
      searchString: '',
      dataSource: [],
      flotingMenuDataSource: [],
      page: 0,
      isLoadingMore: false,
      canLoadMore: true,
      account: null,
      ticketTitle: 'Ticket',
      isFromDashbord: false,
    });

    CommonFunctions.retrieveData(UserDataKeys.Config)
      .then((response) => {
        let config = JSON.parse(response)
        let arrOptions = CommonFunctions.floatingMenus(config, config.user)
        this.setState({ flotingMenuDataSource: arrOptions })
        var ticketTitle = 'Ticket'
        if (config.user) {
          let aUser = config.user
          var obj = { ...aUser }
          obj.id = aUser.user_id
          this.setState({ selectedTech: obj })
      } 
        if (config.is_customnames) {
          ticketTitle = config.names.ticket.s ?? 'Ticket'
        }
        this.setState({ ticketTitle: ticketTitle })
        // Call Apis
      })
    this.viewWillAppear()
    this.props.navigation.addListener('didFocus', this.viewWillAppear)
  }

  viewWillAppear = () => {
    if (this.props.navigation.state.params !== undefined) {
      if (this.props.navigation.state.params.selected !== undefined) {
        if (this.props.navigation.state.params.selected.account !== undefined) {
          this.setState({ account: this.props.navigation.state.params.selected.account })
        }
        if (this.props.navigation.state.params.selected.tech !== undefined) {
          this.setState({ selectedTech: this.props.navigation.state.params.selected.tech })
        }
      }
      if (this.props.navigation.state.params.isFromDashbord !== undefined) {
        this.setState({ isFromDashbord: true })
      }
    }
    if (!this.state.loading) {
      this.setState({
        page: 0,
        isLoadingMore: false,
        canLoadMore: true,
      })
      setTimeout(() => {
        this.fetchData()
      }, 100)
    }
  }

  //Actions

  /* Calling api to load more data */
  handleLoadMore() {
    if (!this.state.loading && !this.state.isLoadingMore && this.state.canLoadMore && !this.state.isFromDashbord) {
      setTimeout(() => {
        this.setState({ page: this.state.page + 1, isLoadingMore: true })
        setTimeout(() => this.fetchData(), 100)
      }, 100)
    }
  }

  /* Calling api to delete time log */
  deleteTime(row) {
    let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
    let objData = { is_project_log: row.item.is_project_log }
    ApiHelper.deleteWithParam(ApiHelper.Apis.Time + `/${row.item.time_id}`, objData, this, true, authHeader).then((response) => {
      const arrSource = this.state.dataSource
      arrSource.splice(row.index, 1)
      this.setState({ dataSource: arrSource });
      Toast.show({
        text: `Time log #${row.item.time_id} has been removed.`,
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

  //Class Methods
  /* Calling api to fetch time-logs */
  fetchData = async () => {
    var authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
    var objData = { c: 1 }

    if (this.state.account && this.state.account.id != undefined) {
      objData.account = this.state.account ? this.state.account.id : 0
    }
    if (this.state.selectedTech && this.state.selectedTech.id != undefined) {
      objData.tech = this.state.selectedTech ? this.state.selectedTech.id : 0
    }
    if (this.state.isFromDashbord) {
      objData.start_date = Moment().format(DateFormat.YYYYMMDD)
      objData.end_date = Moment().format(DateFormat.YYYYMMDD)
      if (this.props.configInfo && this.props.configInfo.user && this.props.configInfo.user.user_id || this.props.configInfo && this.props.configInfo.user && this.props.configInfo.user.id) {
        objData.tech = this.props.configInfo.user.user_id || this.props.configInfo.user.id
      }
    } else {
      if (this.state.page == 0) {
        objData.limit = 25
      } else {
        objData.limit = 25,
          objData.page = this.state.page
      }
    }

    ApiHelper.getWithParam(ApiHelper.Apis.Time, objData, this, true, authHeader).then((response) => {
      if (this.state.page !== 0 && response) {
        if (response.length == 0) {
          this.setState({ page: this.state.page - 1, canLoadMore: false })
        } else if (response.length < 25) {
          this.setState({ canLoadMore: false })
        }
        let arr = [...this.state.dataSource, ...response]
        this.setState({ dataSource: arr, isLoadingMore: false })
      } else {
        if (response) {
          this.setState({ dataSource: response })
        }
      }
    })
      .catch((response) => {
        this.setState({ isLoadingMore: false })
        ApiHelper.handleErrorAlert(response)
      })
  }

  /* Rendering no data view */
  renderNoData() {
    if (this.state.loading && this.state.dataSource.length == 0) {
      return (
        <Animatable.View animation={'fadeIn'} style={styles.noDataContainer}>
          <Label style={styles.noDataTitleStyle}>
            Timelogs will appear here.
          </Label>
        </Animatable.View>
      )
    } else if (!this.state.loading && this.state.dataSource.length == 0) {
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
    return (
      <Animatable.View useNativeDriver={true} animation={'fadeInUpBig'}>
        <CardItem button activeOpacity={1} style={styles.reusableRowContainer} onPress={() => {
          if (row.item && row.item.ticket_id && row.item.ticket_id != null && row.item.ticket_id != 0) {
            this.props.navigation.push('TicketDetails', { ticket: { key: row.item.ticket_id, number: row.item.ticket_number, subject: row.item.ticket_subject, status: '' } });
          }
        }}>
          <View style={styles.workingHoursContainer}>
            <View style={[styles.hoursContainer, { alignSelf: 'flex-start' }]}>
              {row.item.hours && row.item.hours > 0 ?
                <View style={styles.hoursContainer}>
                  <Image style={styles.icon} source={Images.workingHours} />
                  <Label style={styles.workingHoursTitleText}>{`${row.item.hours} Hrs`}</Label>
                </View>
                : null}
              {row.item.hours && row.item.hours > 0 && row.item.non_working_hours && row.item.non_working_hours > 0 ?
                <Label style={[styles.workingHoursTitleText, { marginLeft: 3, marginRight: 3 }]}>|</Label>
                : null}
              {row.item.non_working_hours && row.item.non_working_hours > 0 ?
                <View style={styles.hoursContainer}>
                  <Image style={styles.icon} source={Images.nonWorkingHours} />
                  <Label style={styles.workingHoursTitleText}>{`${row.item.non_working_hours} Hrs+`}</Label>
                </View>
                : null}
            </View>
            <Label style={[styles.titleText, { marginLeft: 10 }]}>{row.item.user_name}</Label>
          </View>
          {(row.item.contract_name && row.item.contract_name != '') || (row.item.task_type && row.item.task_type != '') ?
            <Label style={styles.contractTitleText}>{(row.item.contract_name && row.item.contract_name != '') ? row.item.contract_name : (row.item.task_type && row.item.task_type != '' ? row.item.task_type : '')}</Label>
            : null}
          <Label style={styles.accountTitleText}>{row.item.account_name}</Label>
          {row.item.note && row.item.note != '' ?
            <Label numberOfLines={10} selectable style={styles.noteText}>{row.item.note.replace(/<br\/>/g, '\n').trim()}</Label>
            : null}
          <View style={styles.dateContainer}>
            <Image style={styles.dateIcon} source={Images.dateIcon} />
            <Label style={styles.dateText}>{Moment(row.item.date).format(DateFormat.DDMMMYYYY)}</Label>
          </View>


          {row.item.ticket_number && row.item.ticket_number != 0 ?
            <Label style={[styles.titleText, { marginTop: 10 }]}>{this.state.ticketTitle} <Label style={styles.ticketNuberText}>{`#${row.item.ticket_number} ${row.item.ticket_subject}`}</Label></Label>
            : null}
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
            showTitle='Timelogs'
            rightImage={Images.filter}
            hideRightButton={false}
            rightButton={() => {
              this.props.navigation.push('FilterTimelogs', { selected: { account: this.state.account, tech: this.state.selectedTech } });
            }}
          />
        </SafeAreaView>
        <LoaderBar show={this.state.loading} />
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
                    <Animatable.View animation={'zoomIn'} delay={650} style={[styles.backBtnRightContainer, { marginTop: Metrics.doubleBaseMargin, bottom: 0 }]}>
                      <Button transparent style={styles.backRightBtnRight} onPress={() => {
                        this.flatLisRef.safeCloseOpenRow();
                        this.props.navigation.push('AddTime', { timelog: data.item });
                      }}>
                        <Image style={styles.swipeActionButtonIcon} source={Images.edit} />
                        <Text style={[styles.backTextWhite, { color: Colors.green }]} uppercase={false}>Edit</Text>
                      </Button>
                      <Button transparent style={styles.backRightBtnRight} onPress={() => {
                        this.flatLisRef.safeCloseOpenRow();
                        CommonFunctions.presentAlertWithAction(`Do you really want to remove Time log #${data.item.time_id}`, 'Delete').then((isYes) => {
                          this.deleteTime(data);
                        })
                      }}>
                        <Image style={styles.swipeActionButtonIcon} source={Images.swipeToDelete} />
                        <Text style={[styles.backTextWhite, { color: Colors.placeholderError }]} uppercase={false}>{'Delete'}</Text>
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
                onEndReached={() => this.handleLoadMore()}
              />
            </View>
            <TouchableOpacity activeOpacity={0.7} style={styles.floatingContainer} onPress={() => {
              this.props.navigation.push('AddTime');
            }}>
              {/* <Animatable.View animation={'swing'} delay={500}> */}
              <Image style={styles.loginButtonText} source={Images.floatinOption} />
              {/* </Animatable.View> */}
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
  const { configInfo } = state.configInfo
  return { authToken, org, user, configInfo }
};

/* Connecting to redux store and exporting class */
export default connect(mapStateToProps)(Timelogs);