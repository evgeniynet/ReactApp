/* Imports */
import React, { Component } from 'react'
import { AppState, Image, View, TouchableOpacity, Platform, StatusBar, SafeAreaView, Keyboard, FlatList, RefreshControl } from 'react-native'
import { Container, Button, Text, Label, CardItem, Toast } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { FloatingAction } from 'react-native-floating-action';
import Moment from 'moment';
import { SwipeListView } from 'react-native-swipe-list-view';

import CommonFunctions from '../../../Components/CommonFunctions';
import { UserDataKeys, DateFormat } from '../../../Components/Constants';
import { userInfo, org, configInfo, authToken } from '../../../Redux/Actions';
import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Images, Colors, Metrics } from '../../../Themes';
import LinearGradient from 'react-native-linear-gradient';
import ApiHelper from '../../../Components/ApiHelper';
import Loader from '../../../Components/Loader';
import LoaderBar from '../../../Components/LoaderBar';
// import NotificationManager from '../../../Components/NotificationManager';
// import { notifiactionTokenManager } from '../../../Components/NotifiactionTokenManager';

// Styless
import styles from './Styles/DashboardStyles'

class Dashboard extends Component {

  // Life cycle of class
  /* Initiating state before the component mount. */
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      loadingBar: false,
      searchString: '',
      quickSource: [],
      dataSource: [],
      dataSourceQueues: [],
      dataSourceTodos: [],
      totalTodos: 0,
      dataSourceEvents: [],
      totalEvents: 0,
      flotingMenuDataSource: [],
      accountRes: null,
      billableHours: 0,
      nonBillableHours: 0,
      timeRes: null,
      config: {},
      userTitle: 'User',
      techTitle: 'Tech',
      ticketTitle: 'Ticket',
      appState: AppState.currentState,
      isRefreshing: false,
    };
    this.openRowRefs = [];

    // this.deviceId = DeviceInfo.getUniqueId();
    // this.notificationRegistrationService = new NotificationManager();
  }

  componentDidMount() {
    this.fetchUserData()

    this.setState({
      loading: false,
      loadingBar: false,
      searchString: '',
      quickSource: [],
      dataSource: [],
      dataSourceQueues: [],
      dataSourceTodos: [],
      dataSourceEvents: [],
      flotingMenuDataSource: [],
      accountRes: null,
      billableHours: 0,
      nonBillableHours: 0,
      timeRes: null,
      config: {},
      userTitle: 'User',
      techTitle: 'Tech',
      ticketTitle: 'Ticket',
      isRefreshing: false,
    });
    // this.viewWillAppear()
    // this.props.navigation.addListener('didFocus', this.viewWillAppear)
    CommonFunctions.retrieveData(UserDataKeys.Config)
      .then((response) => {
        let config = JSON.parse(response)

        if (config.is_customnames) {
          var userTitle = 'User'
          var techTitle = 'Tech'
          var ticketTitle = 'Ticket'
          userTitle = config.names.user.a ?? 'User'
          techTitle = config.names.tech.a ?? 'Tech'
          ticketTitle = config.names.ticket.s ?? 'Ticket'
          this.setState({ userTitle, techTitle, ticketTitle })
        }

        let arrOptions = CommonFunctions.floatingMenus(config, config.user)
        this.setState({ flotingMenuDataSource: arrOptions })
      })
      .catch((err) => {
        console.log('Error====================================', err);
      })
    this.props.navigation.addListener('didFocus', this.viewWillAppear)
  }

  componentWillUnmount() {
    this.closeAllOpenRows()
    this.setState({
      loading: false,
      loadingBar: false,
    })
  }

  viewWillAppear = () => {
    this.fetchUserData()
  }

  //Actions

  /* Closing all open rows, and Adding a new row to open array (swipe option)*/
  onRowDidOpen = (rowKey, rowMap) => {
    this.closeAllOpenRows()
    this.openRowRefs.push(rowMap[rowKey]);
  }

  /* Closing all open rows (swipe option)*/
  closeAllOpenRows() {
    this.openRowRefs.forEach(ref => {
      ref.closeRow && ref.closeRow();
    });
  }

  /* Calling api to refresh data */
  onRefresh() {
    this.setState({ isRefreshing: true });
    this.fetchUserData()
  }

  //Class Methods

  /* Registering notification with azure notification hub */
  registerWithAzure = async (token, email) => {
    /* For testing */
    try {
      const pnPlatform = Platform.OS == "ios" ? "apns" : "fcm";
      const pnToken = token;
      const request = {
        installationId: this.deviceId,
        platform: pnPlatform,
        pushChannel: pnToken,
        tags: email && email != '' ? [email] : []
      };
      const response = await this.notificationRegistrationService.registerAsync(request);
      console.log('response====================================');
      console.log(response);
      console.log('====================================');

      /* For testing */
      // try {
      //   await this.notificationRegistrationService.deregisterAsync(this.deviceId);
      //   console.log(`Deregistration Successful`);
      // } catch (e) {
      //   console.log(`Deregistration failed: ${e}`);
      // }
    }
    catch (e) {
      console.log(`Registration failed: ${e}`);
    }
  }

  /* Calling api to fetch config info and storing to local storage, calling nested apis  */
  fetchUserData = async () => {
    CommonFunctions.retrieveData(UserDataKeys.User)
      .then((user) => {
        this.props.userInfo(JSON.parse(user));
        this.props.authToken(JSON.parse(user).api_token);

        /* For testing */
        // CommonFunctions.retrieveData(UserDataKeys.DeviceToken)
        // .then((response) => {
        //   console.log('Saved Token====================================', response);
        //   this.registerWithAzure(response, (JSON.parse(user).email || ''))
        // })
        // .catch((err) => {
        //   notifiactionTokenManager.configure().then((token) => {
        //     console.log('Token:-- ====================================', token);
        //     this.registerWithAzure(token, (JSON.parse(user).email || ''))
        //   })
        // })

        CommonFunctions.retrieveData(UserDataKeys.Org)
          .then((org) => {
            this.props.org(JSON.parse(org))
            let authHeader = (ApiHelper.authenticationHeader(JSON.parse(user), JSON.parse(org)))
            CommonFunctions.retrieveData(UserDataKeys.Config)
              .then((response) => {
                let config = JSON.parse(response)
                if (config.is_customnames) {
                  var userTitle = 'User'
                  var techTitle = 'Tech'
                  userTitle = config.names.user.a ?? 'User'
                  techTitle = config.names.tech.a ?? 'Tech'
                  this.setState({ userTitle, techTitle })
                }
                var objUser = config.user
                this.setState({ config: config })
                this.apiCall(ApiHelper.Apis.Time, authHeader, objUser, config)
              })
              .catch((err) => {
                ApiHelper.get(ApiHelper.Apis.Config, this, authHeader).then((response) => {
                  /* Saving user in redux store and local storage */
                  this.props.configInfo(response);
                  CommonFunctions.storeData(UserDataKeys.Config, JSON.stringify(response))
                  this.setState({ config: response })
                  if (response.is_customnames) {
                    var userTitle = 'User'
                    var techTitle = 'Tech'
                    userTitle = response.names.user.a ?? 'User'
                    techTitle = response.names.tech.a ?? 'Tech'
                    this.setState({ userTitle, techTitle })
                  }
                  var objUser = { ...JSON.parse(user), ...response.user }
                  objUser.api_token = JSON.parse(user).api_token
                  this.props.userInfo(objUser);
                  CommonFunctions.storeData(UserDataKeys.User, JSON.stringify(objUser))
                  this.apiCall(ApiHelper.Apis.Time, authHeader, objUser, response)
                })
                  .catch((response) => {
                    ApiHelper.handleErrorAlert(response)
                    this.apiCall(ApiHelper.Apis.Time, authHeader, objUser, undefined)
                  })
              })
            this.apiCall(ApiHelper.Apis.TicketsCounts, authHeader, JSON.parse(user), undefined)
          })
      })
  }

  /* Calling api based on url */
  apiCall(api, authHeader, user, config) {
    this.setState({
      loading: false,
    })
    if (config) {
      if (api == ApiHelper.Apis.Time && config.is_time_tracking) {
        this.fetchTime(authHeader, user)
      } else if (api == ApiHelper.Apis.TicketsCounts) {
        this.fetchCounts(authHeader, user)
      } else if (api == ApiHelper.Apis.Accounts) {
        if (config.is_account_manager) {
          this.fetchAccount(authHeader, user, config)
        } else {
          this.apiCall(ApiHelper.Apis.ToDos, authHeader, user, config)
        }
      } else if (api == ApiHelper.Apis.ToDos) {
        if (config.is_todos) {
          this.fetchTodosData(authHeader, user, config)
        } else {
          this.apiCall(ApiHelper.Apis.Events, authHeader, user, config)
        }
      } else if (api == ApiHelper.Apis.Events) {
        if (config.user && config.user.is_admin) {
          this.fetchEvents(authHeader, user, config)
        } else {
          this.apiCall(ApiHelper.Apis.Queues, authHeader, user, config)
        }
      } else if (api == ApiHelper.Apis.Queues && config.is_unassigned_queue) {
        this.fetchQueues(authHeader, user, config)
      } else {
        this.setState({ isRefreshing: false })
      }
    } else {
      CommonFunctions.retrieveData(UserDataKeys.Config)
        .then((response) => {
          let configObj = JSON.parse(response)
          this.apiCall(api, authHeader, user, configObj)
        })
    }
  }

  /* Calling api to fetch ticket counts */
  fetchCounts = async (authHeader, user, config) => {

    ApiHelper.getWithParam(ApiHelper.Apis.TicketsCounts, { c: 1 }, this, false, authHeader).then((response) => {
      // ApiHelper.get(ApiHelper.Apis.TicketsCounts, this, authHeader, false).then((response) => {
      this.setState({
        quickSource: [{ id: 1, count: response.open_as_tech, title: 'As Tech', key: 'open_as_tech' },
        { id: 2, count: response.open_as_user, title: 'As User', key: 'open_as_user' },
        { id: 3, count: response.open_as_alttech, title: 'Alt Tech', key: 'open_as_alttech' },
        { id: 4, count: response.open_all, title: 'All Open', key: 'open_all' }],
      })
      this.apiCall(ApiHelper.Apis.Accounts, authHeader, user, config)
    })
      .catch((response) => {

        this.setState({
          quickSource: [{ id: 1, count: 0, title: 'As Tech', key: 'open_as_tech' },
          { id: 2, count: 0, title: 'As User', key: 'open_as_user' },
          { id: 3, count: 0, title: 'Alt Tech', key: 'open_as_alttech' },
          { id: 4, count: 0, title: 'All Open', key: 'open_all' }],
        })
        this.apiCall(ApiHelper.Apis.Accounts, authHeader, user, config)
        ApiHelper.handleErrorAlert(response)
      })
  }

  /* Calling api to fetch events */
  fetchEvents = async (authHeader, user, config) => {
    //account: 0, tech: user.id ?? user.user_id,  date: Moment().format(DateFormat.YYYYMMDD)
    let objData = { tech: user.id || user.user_id, is_calendar: true } //, date: Moment().format(DateFormat.YYYYMMDD), end_date: Moment().add(7, 'days').format(DateFormat.YYYYMMDD) }
    ApiHelper.getWithParam(ApiHelper.Apis.Events, objData, this, false, authHeader).then((response) => {
      var arrResTemp = response && response.length > 0 ? response : []
      var arrEvents = []
      this.setState({ dataSourceEvents: arrEvents })
      arrResTemp.forEach(event => {
        if (arrEvents.length < 2) {// && (event.tech_id && (event.tech_id == user.id || event.tech_id == user.user_id))) {
          arrEvents.push(event)
        }
      });
      this.setState({ dataSourceEvents: arrEvents, totalEvents: arrResTemp.length })
      this.apiCall(ApiHelper.Apis.Queues, authHeader, user, config)
    })
      .catch((response) => {
        this.apiCall(ApiHelper.Apis.Queues, authHeader, user, config)
        ApiHelper.handleErrorAlert(response)
      })
  }

  /* Calling api to fetch queues */
  fetchQueues = async (authHeader, user, config) => {
    CommonFunctions.retrieveData(UserDataKeys.Config)
      .then((response) => {
        let config = JSON.parse(response)
        if (config.is_unassigned_queue) {
          let objData = { sort_by: 'tickets_count' }
          ApiHelper.getWithParam(ApiHelper.Apis.Queues, objData, this, false, authHeader).then((response) => {
            let arrResTemp = (response.length > 0) ? response : []
            var arrDataTemp = []
            this.setState({ dataSourceQueues: arrDataTemp })
            arrResTemp.forEach(queue => {
              if (queue.tickets_count > 0) {
                arrDataTemp.push(queue)
              }
            });
            this.setState({ dataSourceQueues: arrDataTemp, isRefreshing: false })
          })
            .catch((response) => {
              this.setState({ isRefreshing: false })
              ApiHelper.handleErrorAlert(response)
            })
        }
      })
  }

  /* Calling api to fetch accounts */
  fetchAccount = async (authHeader, user, config) => {
    this.apiCall(ApiHelper.Apis.ToDos, authHeader, user, config)
  }

  /* Calling api to fetch time-logs */
  fetchTime = async (authHeader, user) => {
    let objData = { c: 1, account: 0, tech: user.id || user.user_id, start_date: Moment().format(DateFormat.YYYYMMDD), end_date: Moment().format(DateFormat.YYYYMMDD), limit: 25 }
    ApiHelper.getWithParam(ApiHelper.Apis.Time, objData, this, false, authHeader).then((response) => {
      var billableHours = 0
      var nonBillableHours = 0
      response.forEach(time => {
        billableHours += time.hours
        nonBillableHours += time.non_working_hours
      });
      this.setState({ accountRes: response, billableHours: billableHours, nonBillableHours: nonBillableHours })
    })
      .catch((response) => {
        ApiHelper.handleErrorAlert(response)
      })
  }

  /* Calling api to fetch todos */
  fetchTodosData = async (authHeader, user, config, isOnlyTodos = false) => {
    CommonFunctions.retrieveData(UserDataKeys.User)
      .then((user) => {
        let aUser = JSON.parse(user)
        CommonFunctions.retrieveData(UserDataKeys.Org)
          .then((org) => {
            let authHeader = (ApiHelper.authenticationHeader(aUser, JSON.parse(org)))

            var objData = { c: 1, all_item_types: true, is_sub_view: true, is_completed: false, is_due_today: true }//, limit: 6
            objData.assigned_id = aUser.id ? aUser.id : aUser.user_id

            ApiHelper.getWithParam(ApiHelper.Apis.ToDos, objData, this, false, authHeader).then((response) => {
              var arrMainTodos = []
              this.setState({ dataSourceTodos: arrMainTodos })
              var totalCount = 0
              response.forEach(elementMain => {
                var elementMainObj = { ...elementMain }
                elementMainObj.sub = []
                var arrSubTodos = []
                if (elementMain.sub && elementMain.sub.length > 0) {
                  elementMain.sub.forEach(element => {
                    totalCount += 1
                    if (arrSubTodos.length < 2 && arrMainTodos.length < 2) { //Remove Limit if not needed
                      if (element.updated_at && element.is_completed) {
                        let date = Moment(element.updated_at)//CommonFunctions.utcToLocalTimeZone(element.updated_at, DateFormat.YYYYMMDDTHHMMSS)
                        let now = Moment();
                        let workingHours = Moment.duration(now.diff(date)).asHours()
                        if (workingHours <= 24) {
                          arrSubTodos.push(element)
                        }
                      } else {
                        arrSubTodos.push(element)
                      }
                    }
                  });
                }
                elementMainObj.sub = arrSubTodos
                if (arrSubTodos.length > 0) {
                  arrMainTodos.push(elementMainObj)
                }
              });
              this.setState({ dataSourceTodos: arrMainTodos, totalTodos: totalCount })

              this.setTodosAndEvents()
              if (!isOnlyTodos) {
                this.apiCall(ApiHelper.Apis.Events, authHeader, aUser, config)
              }
            })
              .catch((response) => {
                this.setState({ isLoadingMore: false })
                ApiHelper.handleErrorAlert(response)
                if (!isOnlyTodos) {
                  this.apiCall(ApiHelper.Apis.Events, authHeader, aUser, config)
                }
              })
          }).catch(() => {
            if (!isOnlyTodos) {
              this.apiCall(ApiHelper.Apis.Events, authHeader, aUser, config)
            }
          })
      }).catch(() => {
        if (!isOnlyTodos) {
          this.apiCall(ApiHelper.Apis.Events, authHeader, aUser, config)
        }
      })
  }

  /* Calling api to delete todo */
  deleteToDo(row, parentRow) {
    CommonFunctions.retrieveData(UserDataKeys.User)
      .then((user) => {
        let aUser = JSON.parse(user)
        CommonFunctions.retrieveData(UserDataKeys.Org)
          .then((org) => {
            let authHeader = (ApiHelper.authenticationHeader(aUser, JSON.parse(org)))
            let objData = {}
            ApiHelper.deleteWithParam(ApiHelper.Apis.ToDos + `/${row.item.id}`, objData, this, true, authHeader).then((response) => {
              const arrSource = this.state.dataSourceTodos
              arrSource[parentRow.index].sub.splice(row.index, 1)
              this.setState({ dataSourceTodos: arrSource });
              Toast.show({
                text: `ToDo #${row.item.id} has been removed.`,
                position: 'top',
                duration: 3000,
                type: 'success',
                style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
              })
            })
              .catch((response) => {
                ApiHelper.handleErrorAlert(response)
              })
          })
      })
  }

  /* Calling api to delete event */
  deleteEvent(row) {
    CommonFunctions.retrieveData(UserDataKeys.User)
      .then((user) => {
        let aUser = JSON.parse(user)
        CommonFunctions.retrieveData(UserDataKeys.Org)
          .then((org) => {
            let authHeader = (ApiHelper.authenticationHeader(aUser, JSON.parse(org)))
            let objData = {}
            ApiHelper.deleteWithParam(ApiHelper.Apis.Events + `/${row.item.event_id}`, objData, this, true, authHeader).then((response) => {
              const arrSource = this.state.dataSourceEvents
              arrSource.splice(row.index, 1)
              this.setState({ dataSourceEvents: arrSource });
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
          })
      })
  }

  /* Calling api to change todo status (is completed / not completed)*/
  setToDoStatus = async (row, parentRow) => {
    CommonFunctions.retrieveData(UserDataKeys.User)
      .then((user) => {
        let aUser = JSON.parse(user)
        CommonFunctions.retrieveData(UserDataKeys.Org)
          .then((org) => {
            let authHeader = (ApiHelper.authenticationHeader(aUser, JSON.parse(org)))
            const status = row.item.is_completed

            const arrSource = this.state.dataSourceTodos
            arrSource[parentRow.index].sub[row.index].is_completed = status === true ? false : true
            this.setState({ dataSourceTodos: arrSource });

            let objData = { is_completed: status === true ? false : true }
            ApiHelper.putWithParam(ApiHelper.Apis.ToDos + `/${row.item.id}`, objData, this, true, authHeader).then((response) => {
              // const arrSource = this.state.dataSource
              // arrSource[parentRow.index].sub[row.index].is_completed = status === true ? false : true
              // this.setState({ dataSource: arrSource });

              //this.fetchTodosData(undefined, undefined, undefined, true)
            })
              .catch((response) => {
                ApiHelper.handleErrorAlert(response)
                thsi.fetchData()
              })
          })
      })
  }

  /* Show/Hide modules based on website configuration */
  setTodosAndEvents() {
    var arrOptions = []
    if (this.state.config) {
      if (this.state.config.is_todos) {
        arrOptions.push('ToDo’s')
      }
      if (this.state.config.user && this.state.config.user.is_techoradmin) {
        arrOptions.push('Events')
      }
    } else {
      CommonFunctions.retrieveData(UserDataKeys.Config)
        .then((response) => {
          let config = JSON.parse(response)
          if (config.is_todos) {
            arrOptions.push('ToDo’s')
          }
          if (config.user && config.user.is_techoradmin) {
            arrOptions.push('Events')
          }
        })
    }
    this.setState({ dataSource: arrOptions })
  }

  /* Rendering queues */
  renderQueues(row) {
    return (
      <Animatable.View useNativeDriver={true} animation={'pulse'}>
        <CardItem button activeOpacity={0.7} style={styles.quickFooterContainer} onPress={() => {
          let data = { ticket: row.item }
          this.props.navigation.push('QueueTickets', data);
        }}>
          <View style={styles.quickFooterCountContainer}><Label style={styles.quickFooterTitleCont}>{(row.item.tickets_count) > 999 ? '999+' : row.item.tickets_count}</Label></View>
          <View style={styles.quickFooterTitleContainer}><Label style={styles.quickFooterTitle}>{row.item.fullname}</Label></View>
        </CardItem>
      </Animatable.View>
    )
  }

  /* Rendering top counter row */
  renderQuickRow(row) {
    return (
      <Animatable.View useNativeDriver={true} animation={'flipInX'}>
        <CardItem button activeOpacity={0.7} style={styles.quickHeaderItemContainer} onPress={() => {
          switch (row.item.title) {
            case 'As Tech':
              this.props.navigation.push('Tickets', { selectedTab: this.state.techTitle, isFromDashbord: true });
              break;
            case 'As User':
              this.props.navigation.push('Tickets', { selectedTab: this.state.userTitle, isFromDashbord: true });
              break;
            case 'Alt Tech':
              this.props.navigation.push('Tickets', { selectedTab: 'Alt', isFromDashbord: true });
              break;
            case 'All Open':
              console.log('In--------');
              this.props.navigation.push('Tickets', { selectedTab: 'All Open', isFromDashbord: true });
              break;
            default:
              console.log('Out--------');
              break;
          }
        }}>
          <View style={styles.quickHeaderCountContainer}><Label style={styles.quickHeaderTitleCont}>{(row.item.count) > 99 ? '99+' : row.item.count}</Label></View>
          <Label style={styles.quickHeaderTitle}>{row.item.title}</Label>
        </CardItem>
      </Animatable.View>
    )
  }

  /* Rendering event row */
  renderEventRow(row) {
    return (
      <Animatable.View useNativeDriver animation={'pulse'} >
        <CardItem button activeOpacity={1} style={styles.eventRowContainer} onPress={() => {
          if (row.item && row.item.ticket_id && row.item.ticket_id != null && row.item.ticket_id != 0) {
            this.props.navigation.push('TicketDetails', { ticket: { key: row.item.ticket_id, number: row.item.ticket_number, subject: row.item.ticket_subject, status: '' } });
          }
        }}>
          <Label style={styles.eventTitle}>{row.item.subject}</Label>
          {row.item.account_name ?
            <Label style={styles.eventNameText}>{row.item.account_name}</Label>
            : null}
          <View style={styles.eventDateContainer}>
            <View style={styles.eventContainer}>
              <View style={styles.dateContainer}>
                <Image style={styles.dateIcon} source={Images.dateIcon} />
                <Label style={styles.eventDateTitleText}>Start Date</Label>
              </View>
              <Label style={styles.eventDateText}>{row.item && row.item.timezone_offset ? Moment(row.item.start_date).utcOffset(row.item.timezone_offset).local().format(DateFormat.DDMMMYYYYHMMA) : Moment(row.item.start_date).utc().format(DateFormat.DDMMMYYYYHMMA)}</Label>
            </View>
            <View style={styles.eventContainer}>
              <View style={styles.dateContainer}>
                <Image style={styles.dateIcon} source={Images.dateIcon} />
                <Label style={styles.eventDateTitleText}>End Date</Label>
              </View>
              <Label style={styles.eventDateText}>{row.item && row.item.timezone_offset ? Moment(row.item.end_date).utcOffset(row.item.timezone_offset).local().format(DateFormat.DDMMMYYYYHMMA) : Moment(row.item.end_date).utc().format(DateFormat.DDMMMYYYYHMMA)}</Label>
            </View>
          </View>
        </CardItem>
      </Animatable.View>
    )
  }

  /* Rendering todo row */
  renderTodosRow(row, parentRow) {
    return (
      <Animatable.View useNativeDriver animation={'pulse'} >
        <CardItem button activeOpacity={1} style={styles.reusableRowContainerToDos} onPress={() => {
          if (!this.state.loading) {
            this.setToDoStatus(row, parentRow)
          }
        }}>
          <View style={styles.todoRowContainerToDos}>
            <TouchableOpacity onPress={() => {
              if (!this.state.loading) {
                this.setToDoStatus(row, parentRow)
              }
            }}>
              <Image style={styles.leftIconToDos} source={row.item.is_completed ? Images.tick : Images.nontick} />
            </TouchableOpacity>
            <View style={styles.toDoContainerToDos}>
              <Label style={[styles.todoTitleToDos, row.item.is_completed ? { textDecorationLine: 'line-through' } : {}]}>{(row.item.title && row.item.title != '' ? `${row.item.title}` : '') + (row.item.text && row.item.text != '' && row.item.text != 'undefined' ? `\n${row.item.text}` : '')}</Label>
              {row.item.due_date && row.item.due_date != '' ?
                <View style={styles.dateContainerToDos}>
                  {/* {row.item.assigned_name && row.item.assigned_name != '' ?
                  <Label style={styles.dateTextToDos}>{row.item.assigned_name}</Label>
                  : null} */}
                  <Label style={styles.dateTextToDos}>{row.item.due_date && row.item.due_date != '' ? `Due ${CommonFunctions.utcToLocalTimeZone(row.item.due_date, DateFormat.DDMMMYYYY)}` : ''}</Label>
                </View>
                : null}
            </View>
          </View>
        </CardItem>
      </Animatable.View>
    )
  }

  /* Rendering todo title at the top of todos list */
  renderTitle(parentRow) {
    return (
      <Animatable.View useNativeDriver animation={''}>
        <Label style={styles.todoHeaderTitleToDos}>{parentRow.item.name}</Label>
        {parentRow.item.project_name && parentRow.item.project_name != '' ?
          <Label style={styles.ticketTitleToDos}>{parentRow.item.project_name}</Label>
          : null}
        {parentRow.item.list_ticket_number ?
          <TouchableOpacity activeOpacity={0.7} onPress={() => {
            if (parentRow.item && parentRow.item.list_ticket_id && parentRow.item.list_ticket_id != null && parentRow.item.list_ticket_id != 0) {
              this.props.navigation.push('TicketDetails', { ticket: { key: parentRow.item.list_ticket_id, number: parentRow.item.list_ticket_number, subject: parentRow.item.list_ticket_subject, status: '' } });
            }
          }}>
            <Label style={styles.ticketTitleToDos}>{(parentRow.item.list_ticket_number ? `${this.state.ticketTitle} #${parentRow.item.list_ticket_number} ` : '')}<Label style={styles.ticketNameTitle}>{parentRow.item.list_ticket_subject}</Label></Label>
          </TouchableOpacity>
          : null}
        <SwipeListView
          ref={(ref) => { this.flatLisRef = ref }}
          onRowDidOpen={this.onRowDidOpen}
          disableRightSwipe
          data={parentRow.item.sub}
          renderItem={(row) => this.renderTodosRow(row, parentRow)}
          keyExtractor={(item, index) => index.toString()}
          renderHiddenItem={(row, rowMap) => (
            <View style={styles.rowBack}>
              <Animatable.View animation={''} delay={650} style={[styles.backBtnRightContainer, { width: 150, top: 18 }]}>
                <Button transparent style={styles.backRightBtnRight} onPress={() => {
                  this.flatLisRef.safeCloseOpenRow();
                  this.closeAllOpenRows()
                  this.props.navigation.push('AddEditToDo', { todo: row.item, parentTodo: parentRow.item });
                  // this.deleteRow(row);
                }}>
                  <Image style={styles.swipeActionButtonIcon} source={Images.edit} />
                  {/* <Text style={[styles.backTextWhite, { color: Colors.green }]} uppercase={false}>Edit</Text> */}
                </Button>
                <Button transparent style={styles.backRightBtnRight} onPress={() => {
                  this.flatLisRef.safeCloseOpenRow() //.safeCloseOpenRow();
                  this.closeAllOpenRows()
                  CommonFunctions.presentAlertWithAction(`Do you really want to remove ToDo - ${row.item.title}`, 'Delete').then((isYes) => {
                    this.deleteToDo(row, parentRow);
                  })
                }}>
                  <Image style={styles.swipeActionButtonIcon} source={Images.swipeToDelete} />
                  {/* <Text style={[styles.backTextWhite, { color: Colors.placeholderError }]} uppercase={false}>Delete</Text> */}
                </Button>
              </Animatable.View>
            </View>
          )}
          leftOpenValue={150}
          rightOpenValue={-150}
          previewRowKey={this.state.showSwipwToDeletePreview ? '0' : ''}
          previewOpenValue={-90}
          previewOpenDelay={1000}
          closeOnScroll={false}
        />
      </Animatable.View>
    )
  }

  /* Rendering todos and events row */
  renderDataRow(row) {
    return (
      <Animatable.View useNativeDriver={true} animation={''}>
        {row.item == 'ToDo’s' ?
          <FlatList
            scrollEnabled={false}
            ref={(ref) => { this.flatListToDoRef = ref; }}
            data={this.state.dataSourceTodos}
            renderItem={(parentRow) => this.renderTitle(parentRow)}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={() => this.state.totalTodos && this.state.totalTodos > 2 ? <TouchableOpacity onPress={() => {
              this.props.navigation.push('ToDos', { isFromDashbord: true });
            }} >
              <Label style={styles.seeAll}>{`there are ${this.state.totalTodos - 2} more todo${this.state.totalTodos == 3 ? '' : '\'s'}`}</Label>
            </TouchableOpacity> : null}
          />
          : <SwipeListView
            scrollEnabled={false}
            ref={(ref) => { this.flatListEventsRef = ref }}
            onRowDidOpen={this.onRowDidOpen}
            disableRightSwipe
            data={this.state.dataSourceEvents}
            renderItem={(row) => this.renderEventRow(row)}
            keyExtractor={(item, index) => index.toString()}
            renderHiddenItem={(row, rowMap) => (
              <View style={styles.rowBack}>
                <Animatable.View animation={''} delay={650} style={[styles.backBtnRightContainer, { width: 150, top: 15 }]}>
                  <Button transparent style={styles.backRightBtnRight} onPress={() => {
                    this.flatListEventsRef.safeCloseOpenRow();
                    this.closeAllOpenRows()
                    this.props.navigation.push('AddEditEvent', { event: row.item });
                    // this.deleteRow(row);
                  }}>
                    <Image style={styles.swipeActionButtonIcon} source={Images.edit} />
                    <Text style={[styles.backTextWhite, { color: Colors.green }]} uppercase={false}>Edit</Text>
                  </Button>
                  <Button transparent style={styles.backRightBtnRight} onPress={() => {
                    this.flatListEventsRef.safeCloseOpenRow() //.safeCloseOpenRow();
                    this.closeAllOpenRows()
                    CommonFunctions.presentAlertWithAction(`Do you really want to remove Event - ${row.item.subject}`, 'Delete').then((isYes) => {
                      this.deleteEvent(row);
                    })
                  }}>
                    <Image style={styles.swipeActionButtonIcon} source={Images.swipeToDelete} />
                    <Text style={[styles.backTextWhite, { color: Colors.placeholderError }]} uppercase={false}>Delete</Text>
                  </Button>
                </Animatable.View>
              </View>
            )}
            leftOpenValue={150}
            rightOpenValue={-150}
            previewRowKey={this.state.showSwipwToDeletePreview ? '0' : ''}
            previewOpenValue={-90}
            previewOpenDelay={1000}
            closeOnScroll={false}
            ListHeaderComponent={() => this.state.dataSourceEvents && this.state.dataSourceEvents.length > 0 ? <Label style={styles.eventHeaderTitle}>{row.item}</Label> : null}
            ListFooterComponent={() => this.state.totalEvents && this.state.totalEvents > 2 ? <TouchableOpacity onPress={() => {
              this.props.navigation.push('Events', { isFromDashbord: true });
            }} >
              <Label style={styles.seeAll}>{`there are ${this.state.totalEvents - 2} more event${this.state.totalEvents == 3 ? '' : '\'s'}`}</Label>
            </TouchableOpacity> : null}
         />}
      </Animatable.View>
    )
  }

  /* Rendering footer view */
  renderFooter() {
    return (
      <Animatable.View useNativeDriver={true} animation={'zoomIn'}>
        <FlatList
          ref={(ref) => { this.flatListDataRef = ref; }}
          contentContainerStyle={styles.flatListDataPadding}
          data={this.state.dataSourceQueues}
          renderItem={(row) => this.renderQueues(row)}
          keyExtractor={(item, index) => index.toString()}
        />
      </Animatable.View>
    )
  }

  /* What to display on the screen */
  render() {
    return (
      <Container>
        {StatusBar.setBarStyle('light-content', true)}
        {Platform.OS === 'ios' ? null : StatusBar.setBackgroundColor(Colors.mainPrimary)}
        <Loader show={this.state.loading} />
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={
            [Colors.mainPrimary,
            Colors.secondary]}
          style={styles.backgroundImage} />
        <SafeAreaView>
          <NavigationBar
            navigation={this.props.navigation}
            showTitle='Dashboard'
            isEditableSerach
            value={this.state.searchString}
            showClearButton={(this.state.searchString != '')}
            searchPlaceholder='Search'
            searchString={(value) => {
              this.setState({ searchString: value })
              if (value.trim() !== '') {

              }
            }}
            onCancel={() => {
              Keyboard.dismiss();
              this.setState({ searchString: '' })
            }}
            searchRef={(input) => {
              this.searchRef = input;
            }}
            onSearch={() => {
              if (this.state.searchString.trim().length == 0) {
                this.searchRef._root.focus()
              } else {
                this.props.navigation.push('SearchTickets', { searchText: this.state.searchString.trim() });
                this.setState({ searchString: '' })
              }
            }}
          />
        </SafeAreaView>
        <View style={styles.mainContainer}>
          <View style={{ marginTop: 10 }}>
            <LoaderBar show={this.state.loadingBar} />
          </View>
          <View style={styles.topContainer}>
            <Animatable.View useNativeDriver animation={'zoomIn'}>
              <Label style={styles.todayText}>{Moment().format(DateFormat.EMMMDDYYYY)}</Label>
            </Animatable.View>
            {(this.state.accountRes && this.state.accountRes != undefined && this.state.accountRes != null) ?
              <TouchableOpacity activeOpacity={0.7} onPress={() => {
                this.props.navigation.push('Timelogs', { isFromDashbord: true });
              }}>
                <Animatable.View useNativeDriver animation={'fadeIn'} style={styles.hoursContainer}>
                  <Label style={styles.hoursTitle}>Billable Hours    <Label style={styles.hoursText}>{this.state.billableHours < 0 ? 0 : this.state.billableHours}</Label></Label>
                  <Label style={styles.hoursTitle}>Non-Billable Hours   <Label style={styles.hoursText}>{this.state.nonBillableHours < 0 ? 0 : this.state.nonBillableHours}</Label></Label>
                </Animatable.View>
              </TouchableOpacity>
              : null}
          </View>

          <View style={styles.contentContainer}>
            <SafeAreaView style={styles.mainContainer}>
              <View style={styles.quickHeaderContainer}>
                <FlatList
                  horizontal
                  ref={(ref) => { this.flatListQuickRef = ref; }}
                  contentContainerStyle={styles.flatListQuickPadding}
                  data={this.state.quickSource}
                  renderItem={(row) => this.renderQuickRow(row)}
                  keyExtractor={(item, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
              <View style={styles.mainContainer}>
                <FlatList
                  ref={(ref) => { this.flatListDataRef = ref; }}
                  contentContainerStyle={[styles.flatListDataPadding]}
                  data={this.state.dataSource}
                  renderItem={(row) => this.renderDataRow(row)}
                  keyExtractor={(item, index) => index.toString()}
                  ListFooterComponent={this.renderFooter()}
                  refreshControl={
                    <RefreshControl
                      colors={[Colors.mainPrimary, Colors.secondary]}
                      tintColor={Colors.mainPrimary}
                      refreshing={this.state.isRefreshing}
                      onRefresh={this.onRefresh.bind(this)}
                    />
                  }
                />
              </View>

            </SafeAreaView>

          </View>
        </View>
        <FloatingAction
          ref={(ref) => { this.floatingAction = ref; }}
          actions={this.state.flotingMenuDataSource}
          color={Colors.green}
          overlayColor={Colors.snow95}
          iconWidth={20}
          iconHeight={20}
          buttonSize={48}
          shadow={{
            shadowColor: Colors.clear,
          }}
          iconColor={Colors.snow}
          onPressItem={name => {
            console.log(`selected button: ${name}`);
            switch (name) {
              case 'bt_AddTicket':
                this.props.navigation.push('AddEditTicket');
                break;
              case 'bt_AddEvent':
                this.props.navigation.push('AddEditEvent');
                break;
              case 'bt_AddTime':
                this.props.navigation.push('AddTime');
                break;
              case 'bt_CreateInvoice':
                break;
              case 'bt_AddToDo':
                this.props.navigation.push('AddEditToDo');
                break;
              case 'bt_AddExpense':
                this.props.navigation.push('AddEditExpense');
                break;
              default:
                break;
            }

          }}
        />
      </Container>
    )
  }
}

/* Subscribing to redux store for updates */
const mapStateToProps = (state) => {
  var objData = {}
  const { user } = state.userInfo
  const { org } = state.org
  const { configInfo } = state.configInfo
  objData.user = user
  objData.org = org
  objData.configInfo = configInfo
  return { objData }
};

/* Connecting to redux store and exporting class */
export default connect(mapStateToProps, { userInfo, org, configInfo, authToken })(Dashboard);