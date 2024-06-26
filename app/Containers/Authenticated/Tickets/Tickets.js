/* Imports */
import React, { Component } from 'react'
import { Image, View, TouchableOpacity, Platform, StatusBar, SafeAreaView, FlatList, Keyboard } from 'react-native'
import { Container, Label, CardItem, Toast, Button, Text } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';

import { UserDataKeys, Messages } from '../../../Components/Constants';
import { userInfo, org, configInfo, authToken } from '../../../Redux/Actions';
import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Images, Colors, Metrics } from '../../../Themes';
import LinearGradient from 'react-native-linear-gradient';
import CommonFunctions from '../../../Components/CommonFunctions';
import ApiHelper from '../../../Components/ApiHelper';
import Loader from '../../../Components/Loader';
import LoaderBar from '../../../Components/LoaderBar';
import AddResponse from '../Accounts/AddResponse';

// Styless
import styles from './Styles/TicketsStyles'

class Tickets extends Component {

  // Life cycle of class
  /* Initiating state before the component mount. */
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      loadingBar: false,
      searchString: '',
      dataSourceTabs: [],
      selectedTab: '',
      flotingMenuDataSource: [],
      title: '',
      ticketTitle: 'Ticket',
      usersTitle: 'Users',
      userTitle: 'User',
      techTitle: 'Tech',
      config: null,
      pageOpen: 0,
      isLoadingMoreOpen: false,
      canLoadMoreOpen: false,
      pageClose: 0,
      isLoadingMoreClose: false,
      canLoadMoreClose: false,
      pageAlt: 0,
      isLoadingMoreAlt: false,
      canLoadMoreAlt: false,
      pageTech: 0,
      isLoadingMoreTech: false,
      canLoadMoreTech: false,
      pageUser: 0,
      isLoadingMoreUser: false,
      canLoadMoreUser: false,
    };
  }

  componentDidMount() {
    this.setState({
      loading: false,
      loadingBar: false,
      searchString: '',
      dataSourceTabs: [],
      selectedTab: '',
      flotingMenuDataSource: [],
      title: '',
      ticketTitle: 'Ticket',
      usersTitle: 'Users',
      userTitle: 'User',
      techTitle: 'Tech',
      config: null,
      dataSourceUser: [],
      dataSourceTech: [],
      dataSourceClose: [],
      dataSourceAlt: [],
      dataSourceOpen: [],
      pageOpen: 0,
      isLoadingMoreOpen: false,
      canLoadMoreOpen: false,
      pageClose: 0,
      isLoadingMoreClose: false,
      canLoadMoreClose: false,
      pageAlt: 0,
      isLoadingMoreAlt: false,
      canLoadMoreAlt: false,
      pageTech: 0,
      isLoadingMoreTech: false,
      canLoadMoreTech: false,
      pageUser: 0,
      isLoadingMoreUser: false,
      canLoadMoreUser: false,
    });

    this.fetchConfigData()
    CommonFunctions.retrieveData(UserDataKeys.Config)
      .then((response) => {
        let config = JSON.parse(response)
        var tickets = 'Tickets'
        var ticketTitle = 'Ticket'
        var user = 'User'
        var users = 'Users'
        var techTitle = 'Tech'
        if (config.is_customnames) {
          tickets = config.names.ticket.p ?? 'Tickets'
          ticketTitle = config.names.ticket.s ?? 'Ticket'
          users = config.names.user.a ?? 'Users'
          user = config.names.user.a ?? 'User'
          techTitle = config.names.tech.a ?? 'Tech'
        }
        let arrOptions = CommonFunctions.floatingMenus(config, config.user)

        var sltdTab = techTitle
        if (this.props.navigation.state.params !== undefined) {
          if (this.props.navigation.state.params.selectedTab !== undefined) {
            sltdTab = this.props.navigation.state.params.selectedTab
            console.log('sltdTab====================================');
            console.log(sltdTab);
            console.log('====================================');
          }
        }

        this.setState({
          title: tickets,
          ticketTitle,
          usersTitle: users,
          userTitle: user,
          techTitle,
          flotingMenuDataSource: arrOptions,
          config: config,
          dataSourceTabs: [user, techTitle, 'Closed', 'Alt', 'All Open'],
          selectedTab: sltdTab,
        })

        this.viewWillAppear()
        // Call Apis
      })
      .catch((err) => {
        console.log('Error====================================', err);
      })
    this.subs = [
      this.props.navigation.addListener('didFocus', this.viewWillAppear)
    ]
  }

  viewWillAppear = () => {

    this.setState({
      pageOpen: 0,
      isLoadingMoreOpen: false,
      canLoadMoreOpen: false,
      pageClose: 0,
      isLoadingMoreClose: false,
      canLoadMoreClose: false,
      pageAlt: 0,
      isLoadingMoreAlt: false,
      canLoadMoreAlt: false,
      pageTech: 0,
      isLoadingMoreTech: false,
      canLoadMoreTech: false,
      pageUser: 0,
      isLoadingMoreUser: false,
      canLoadMoreUser: false
    })

    if (this.props.navigation.state.params !== undefined) {
      if (this.props.navigation.state.params.selected !== undefined) {
        if (this.props.navigation.state.params.selected.account !== undefined) {
          this.setState({ account: this.props.navigation.state.params.selected.account })
        }
        if (this.props.navigation.state.params.selected.tech !== undefined) {
          this.setState({ selectedTech: this.props.navigation.state.params.selected.tech })
        }

        if (this.props.navigation.state.params.selected.location !== undefined) {
          this.setState({ selectedLocation: this.props.navigation.state.params.selected.location })
        }

        if (this.props.navigation.state.params.selected.class !== undefined) {
            this.setState({ selectedClass: this.props.navigation.state.params.selected.class })
        }

        if (this.props.navigation.state.params.selected.status !== undefined) {
            this.setState({ selectedStatus: this.props.navigation.state.params.selected.status })
        }

        if (this.props.navigation.state.params.selected.priority !== undefined) {
            this.setState({ selectedPriority: this.props.navigation.state.params.selected.priority })
        }
      }
    }

    setTimeout(() => {
      if (this.state.authHeader == null || this.state.authHeader == undefined) {
        this.fetchAuthToken().then((token) => {
          console.log('Ops====================================');
          console.log(token);
          console.log('====================================');
          this.fetchData()
        })
      } else {
        this.fetchData()
      }
    }, 100)

  }

  componentWillUnmount() {
    Keyboard.dismiss();
    if (this.sub) {
      this.subs.forEach((sub) => {
        sub.remove();
      });
    }
  }

  //Actions

  /* Calling api to load more tickets based on selected tab */
  handleLoadMore() {
    if (!this.state.loadingBar) {
      switch (this.state.selectedTab) {
        case this.state.userTitle:
          if (!this.state.isLoadingMoreUser && this.state.canLoadMoreUser) {
            this.setState({ pageUser: this.state.pageUser + 1, isLoadingMoreUser: true })
            setTimeout(() => {
              this.fetchUserTickets()
            }, 100)
          }
          break;
        case this.state.techTitle:
          if (!this.state.isLoadingMoreTech && this.state.canLoadMoreTech) {
          this.setState({ pageTech: this.state.pageTech + 1, isLoadingMoreTech: true })
          setTimeout(() => {
            this.fetchTechTickets()
          }, 100)
        }
          break;
        case 'Closed':
          if (!this.state.isLoadingMoreClose && this.state.canLoadMoreClose) {
          this.setState({ pageClose: this.state.pageClose + 1, isLoadingMoreClose: true })
          setTimeout(() => {
            this.fetchCloseTickets()
          }, 100)
        }
          break;
        case 'Alt':
          if (!this.state.isLoadingMoreAlt && this.state.canLoadMoreAlt) {
          this.setState({ pageAlt: this.state.pageAlt + 1, isLoadingMoreAlt: true })
          setTimeout(() => {
            this.fetchAltTicket()
          }, 100)}
          break;
        case 'All Open':
          if (!this.state.isLoadingMoreOpen && this.state.canLoadMoreOpen) {
          this.setState({ pageOpen: this.state.pageOpen + 1, isLoadingMoreOpen: true })
          setTimeout(() => {
            this.fetchOpenTicket()
          }, 100)}
          break;
        default:
          break;
      }
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
        this.addResponseTicket(this.state.addResponseRow, selected);
      }, 600)
    }
    this.dismissPopup();
  }

  //Class Methods

  /* Calling api based on selected tab if loader (to check api in progresss) is off */
  fetchData() {
    setTimeout(() => {
      if (!this.state.loadingBar) {
        switch (this.state.selectedTab) {
          case this.state.userTitle:
            this.fetchUserTickets()
            break;
          case this.state.techTitle:
            this.fetchTechTickets()
            break;
          case 'Closed':
            this.fetchCloseTickets()
            break;
          case 'Alt':
            this.fetchAltTicket()
            break;
          case 'All Open':
            this.fetchOpenTicket()
            break;
          default:
            break;
        }
      }
    }, 150)
  }

  /* Calling api to fetch config data and setting floating menus */
  fetchConfigData = async () => {
    CommonFunctions.retrieveData(UserDataKeys.User)
      .then((user) => {
        this.props.userInfo(JSON.parse(user));
        this.props.authToken(JSON.parse(user).api_token);
        CommonFunctions.retrieveData(UserDataKeys.Org)
          .then((org) => {
            this.props.org(JSON.parse(org))
            // console.log('Dashbord====================================');
            // console.log(this.props.objData.org.key);
            // console.log('====================================');
            let authHeader = (ApiHelper.authenticationHeader(JSON.parse(user), JSON.parse(org)))
            this.setState({ authHeader, user: JSON.parse(user) })
            CommonFunctions.retrieveData(UserDataKeys.Config)
              .then((response) => {
                let config = JSON.parse(response)
                var objUser = config.user
                var tickets = 'Tickets'
                var ticketTitle = 'Ticket'
                var user = 'User'
                var users = 'Users'
                var techTitle = 'Tech'
                if (config.is_customnames) {
                  tickets = config.names.ticket.p ?? 'Tickets'
                  ticketTitle = config.names.ticket.s ?? 'Ticket'
                  users = config.names.user.a ?? 'Users'
                  user = config.names.user.a ?? 'User'
                  techTitle = config.names.tech.a ?? 'Tech'
                }
                let arrOptions = CommonFunctions.floatingMenus(config, config.user)
                var sltdTab = techTitle
                if (this.props.navigation.state.params !== undefined) {
                  if (this.props.navigation.state.params.selectedTab !== undefined) {
                    sltdTab = this.props.navigation.state.params.selectedTab
                    console.log('sltdTab====================================');
                    console.log(sltdTab);
                    console.log('====================================');
                  }
                }
                this.setState({
                  title: tickets,
                  ticketTitle,
                  usersTitle: users,
                  userTitle: user,
                  techTitle,
                  flotingMenuDataSource: arrOptions,
                  config: config,
                  dataSourceTabs: [user, techTitle, 'Closed', 'Alt', 'All Open'],
                  selectedTab: sltdTab,
                })
                if (this.state.config == null) {
                  this.viewWillAppear()
                }
                // Call Apis
              })
              .catch((err) => {
                console.log('ApiHelper====================================');
                console.log();
                console.log('====================================');
                ApiHelper.get(ApiHelper.Apis.Config, this, authHeader).then((response) => {
                  /* Saving user in redux store and local storage */
                  this.props.configInfo(response);
                  CommonFunctions.storeData(UserDataKeys.Config, JSON.stringify(response))

                  var objUser = { ...JSON.parse(user), ...response.user }
                  objUser.api_token = JSON.parse(user).api_token
                  this.props.userInfo(objUser);
                  CommonFunctions.storeData(UserDataKeys.User, JSON.stringify(objUser))
                  // Call Apis
                  var tickets = 'Tickets'
                  var ticketTitle = 'Ticket'
                  var user = 'User'
                  var users = 'Users'
                  var techTitle = 'Tech'
                  if (response.is_customnames) {
                    tickets = response.names.ticket.p ?? 'Tickets'
                    ticketTitle = response.names.ticket.s ?? 'Ticket'
                    users = response.names.user.a ?? 'Users'
                    user = response.names.user.a ?? 'User'
                    techTitle = response.names.tech.a ?? 'Tech'
                  }
                  let arrOptions = CommonFunctions.floatingMenus(response, response.user)
                  var sltdTab = techTitle
                  if (this.props.navigation.state.params !== undefined) {
                    if (this.props.navigation.state.params.selectedTab !== undefined) {
                      sltdTab = this.props.navigation.state.params.selectedTab
                      console.log('sltdTab====================================');
                      console.log(sltdTab);
                      console.log('====================================');
                    }
                  }
                  this.setState({
                    title: tickets,
                    ticketTitle,
                    usersTitle: users,
                    userTitle: user,
                    techTitle,
                    flotingMenuDataSource: arrOptions,
                    config: response,
                    dataSourceTabs: [user, techTitle, 'Closed', 'Alt', 'All Open'],
                    selectedTab: sltdTab,
                  })
                  if (this.state.config == null) {
                    this.viewWillAppear()
                  }
                })
                  .catch((response) => {
                    ApiHelper.handleErrorAlert(response)
                  })
              })
            // Call Apis
          })
      })
  }

  /* Returns authentication token */
  fetchAuthToken = () => {
    return new Promise(resolve => {
      CommonFunctions.retrieveData(UserDataKeys.User)
        .then((user) => {
          this.props.userInfo(JSON.parse(user));
          this.props.authToken(JSON.parse(user).api_token);
          CommonFunctions.retrieveData(UserDataKeys.Org)
            .then((org) => {
              this.props.org(JSON.parse(org))
              let authHeader = (ApiHelper.authenticationHeader(JSON.parse(user), JSON.parse(org)))
              this.setState({ authHeader, user: JSON.parse(user) })
              resolve(authHeader)
            })
        })
    })
  }

  /* Calling api to fetch user ticket */
  fetchUserTickets = async () => {
    // var authHeader = (ApiHelper.authenticationHeader({ api_token: this.state.authToken }, this.state.org))
    var objData = { limit: 15, status: 'open,onhold', role: 'user' }

    if (this.state.pageUser != 0) {
      objData.page = this.state.pageUser
    }
    if (this.state.account && this.state.account.id != undefined) {
      objData.account = this.state.account ? this.state.account.id : 0
    }
    if (this.state.selectedTech && this.state.selectedTech.id != undefined) {
      objData.tech = this.state.selectedTech ? this.state.selectedTech.id : 0
    }

    if (this.state.selectedLocation && this.state.selectedLocation.id != undefined) {
      objData.location = this.state.selectedLocation ? this.state.selectedLocation.id : 0
    }
    if (this.state.selectedClass && this.state.selectedClass.id != undefined) {
      objData.class = this.state.selectedClass ? this.state.selectedClass.id : 0
    }

    if (this.state.selectedStatus && this.state.selectedStatus.name != undefined && this.state.selectedStatus.name != '') {
      objData.status = this.state.selectedStatus ? this.state.selectedStatus.api_value : ''
    }
    
    if (this.state.selectedPriority && this.state.selectedPriority.id != undefined) {
      objData.priority = this.state.selectedPriority ? this.state.selectedPriority.id : 0
    }

    this.onEndReachedCalledDuringMomentum = false
    ApiHelper.getWithParam(ApiHelper.Apis.Tickets, objData, this, false, this.state.authHeader).then((response) => {
      if (response.length == 15) {
        this.setState({ canLoadMoreUser: true })
      }
      if (this.state.pageUser !== 0) {
        if (response.length == 0) {
          this.setState({ pageUser: this.state.pageUser - 1, canLoadMoreUser: false })
        } else if (response.length < 15) {
          this.setState({ canLoadMoreUser: false })
        }
        let arr = [...this.state.dataSourceUser, ...response]
        this.setState({ dataSourceUser: arr, isLoadingMoreUser: false })
      } else {
        this.setState({ dataSourceUser: response })
      }
    })
      .catch((response) => {
        this.setState({ isLoadingMoreUser: false })
        ApiHelper.handleErrorAlert(response)
      })
  }

  /* Calling api to fetch tech ticket */
  fetchTechTickets = async () => {
    // var authHeader = (ApiHelper.authenticationHeader({ api_token: this.state.authToken }, this.state.org))
    var objData = { limit: 15, status: 'open,onhold', role: 'tech' }
 
    if (this.state.pageTech != 0) {
      objData.page = this.state.pageTech
    }

    if (this.state.account && this.state.account.id != undefined) {
      objData.account = this.state.account ? this.state.account.id : 0
    }
    if (this.state.selectedTech && this.state.selectedTech.id != undefined) {
      objData.tech = this.state.selectedTech ? this.state.selectedTech.id : 0
    }

    if (this.state.selectedLocation && this.state.selectedLocation.id != undefined) {
      objData.location = this.state.selectedLocation ? this.state.selectedLocation.id : 0
    }
    if (this.state.selectedClass && this.state.selectedClass.id != undefined) {
      objData.class = this.state.selectedClass ? this.state.selectedClass.id : 0
    }

    if (this.state.selectedStatus && this.state.selectedStatus.name != undefined && this.state.selectedStatus.name != '') {
      objData.status = this.state.selectedStatus ? this.state.selectedStatus.api_value : ''
    }

    if (this.state.selectedPriority && this.state.selectedPriority.id != undefined) {
      objData.priority = this.state.selectedPriority ? this.state.selectedPriority.id : 0
    }

    this.onEndReachedCalledDuringMomentum = false
    ApiHelper.getWithParam(ApiHelper.Apis.Tickets, objData, this, false, this.state.authHeader).then((response) => {
      if (response.length == 15)
      {
      this.setState({ canLoadMoreTech: true })
      }
      if (this.state.pageTech !== 0) {
        if (response.length == 0) {
          this.setState({ pageTech: this.state.pageTech - 1, canLoadMoreTech: false })
        } else if (response.length < 15) {
          this.setState({ canLoadMoreTech: false })
        }
        let arr = [...this.state.dataSourceTech, ...response]
        this.setState({ dataSourceTech: arr, isLoadingMoreTech: false })
      } else {
        this.setState({ dataSourceTech: response })
      }
    })
      .catch((response) => {
        this.setState({ isLoadingMoreTech: false })
        ApiHelper.handleErrorAlert(response)
      })
  }

  /* Calling api to fetch closed ticket */
  fetchCloseTickets = async () => {
    // var authHeader = (ApiHelper.authenticationHeader({ api_token: this.state.authToken }, this.state.org))
    var objData = { limit: 15, status: 'closed', role: 'tech' }
    if (this.state.pageClose != 0) {
      objData.page = this.state.pageClose
    }

    if (this.state.account && this.state.account.id != undefined) {
      objData.account = this.state.account ? this.state.account.id : 0
    }
    if (this.state.selectedTech && this.state.selectedTech.id != undefined) {
      objData.tech = this.state.selectedTech ? this.state.selectedTech.id : 0
    }

    if (this.state.selectedLocation && this.state.selectedLocation.id != undefined) {
      objData.location = this.state.selectedLocation ? this.state.selectedLocation.id : 0
    }
    if (this.state.selectedClass && this.state.selectedClass.id != undefined) {
      objData.class = this.state.selectedClass ? this.state.selectedClass.id : 0
    }

    if (this.state.selectedStatus && this.state.selectedStatus.name != undefined && this.state.selectedStatus.name != '') {
      objData.status = this.state.selectedStatus ? this.state.selectedStatus.api_value : ''
    }

    if (this.state.selectedPriority && this.state.selectedPriority.id != undefined) {
      objData.priority = this.state.selectedPriority ? this.state.selectedPriority.id : 0
    }

    this.onEndReachedCalledDuringMomentum = false
    ApiHelper.getWithParam(ApiHelper.Apis.Tickets, objData, this, false, this.state.authHeader).then((response) => {
      if (response.length == 15) {
        this.setState({ canLoadMoreClose: true })
      }
      if (this.state.pageClose !== 0) {
        if (response.length == 0) {
          this.setState({ pageClose: this.state.pageClose - 1, canLoadMoreClose: false })
        } else if (response.length < 15) {
          this.setState({ canLoadMoreClose: false })
        }
        let arr = [...this.state.dataSourceClose, ...response]
        this.setState({ dataSourceClose: arr, isLoadingMoreClose: false })
      } else {
        this.setState({ dataSourceClose: response })
      }
    })
      .catch((response) => {
        this.setState({ isLoadingMoreClose: false })
        ApiHelper.handleErrorAlert(response)
      })
  }

  /* Calling api to fetch alt ticket */
  fetchAltTicket = async () => {
    // var authHeader = (ApiHelper.authenticationHeader({ api_token: this.state.authToken }, this.state.org))
    var objData = { limit: 15, status: 'open,onhold', role: 'alt_tech' }
    if (this.state.pageAlt != 0) {
      objData.page = this.state.pageAlt
    }

    if (this.state.account && this.state.account.id != undefined) {
      objData.account = this.state.account ? this.state.account.id : 0
    }
    if (this.state.selectedTech && this.state.selectedTech.id != undefined) {
      objData.tech = this.state.selectedTech ? this.state.selectedTech.id : 0
    }

    if (this.state.selectedLocation && this.state.selectedLocation.id != undefined) {
      objData.location = this.state.selectedLocation ? this.state.selectedLocation.id : 0
    }
    if (this.state.selectedClass && this.state.selectedClass.id != undefined) {
      objData.class = this.state.selectedClass ? this.state.selectedClass.id : 0
    }

    if (this.state.selectedStatus && this.state.selectedStatus.name != undefined && this.state.selectedStatus.name != '') {
      objData.status = this.state.selectedStatus ? this.state.selectedStatus.api_value : ''
    }

    if (this.state.selectedPriority && this.state.selectedPriority.id != undefined) {
      objData.priority = this.state.selectedPriority ? this.state.selectedPriority.id : 0
    }

    this.onEndReachedCalledDuringMomentum = false
    ApiHelper.getWithParam(ApiHelper.Apis.Tickets, objData, this, false, this.state.authHeader).then((response) => {
      if (response.length == 15) {
        this.setState({ canLoadMoreAlt: true })
      }
      if (this.state.pageAlt !== 0) {
        if (response.length == 0) {
          this.setState({ pageAlt: this.state.pageAlt - 1, canLoadMoreAlt: false })
        } else if (response.length < 15) {
          this.setState({ canLoadMoreAlt: false })
        }
        let arr = [...this.state.dataSourceAlt, ...response]
        this.setState({ dataSourceAlt: arr, isLoadingMoreAlt: false })
      } else {
        this.setState({ dataSourceAlt: response })
      }
    })
      .catch((response) => {
        this.setState({ isLoadingMoreAlt: false })
        ApiHelper.handleErrorAlert(response)
      })
  }

  /* Calling api to fetch open ticket */
  fetchOpenTicket = async () => {
    // var authHeader = (ApiHelper.authenticationHeader({ api_token: this.state.authToken }, this.state.org))
    var objData = { limit: 15, status: 'allopen', query: 'all' }
    if (this.state.pageOpen != 0) {
      objData.page = this.state.pageOpen
    }

    if (this.state.account && this.state.account.id != undefined) {
      objData.account = this.state.account ? this.state.account.id : 0
    }
    if (this.state.selectedTech && this.state.selectedTech.id != undefined) {
      objData.tech = this.state.selectedTech ? this.state.selectedTech.id : 0
    }

    if (this.state.selectedLocation && this.state.selectedLocation.id != undefined) {
      objData.location = this.state.selectedLocation ? this.state.selectedLocation.id : 0
    }
    if (this.state.selectedClass && this.state.selectedClass.id != undefined) {
      objData.class = this.state.selectedClass ? this.state.selectedClass.id : 0
    }

    if (this.state.selectedStatus && this.state.selectedStatus.name != undefined && this.state.selectedStatus.name != '') {
      objData.status = this.state.selectedStatus ? this.state.selectedStatus.api_value : ''
    }

    if (this.state.selectedPriority && this.state.selectedPriority.id != undefined) {
      objData.priority = this.state.selectedPriority ? this.state.selectedPriority.id : 0
    }
    
    this.onEndReachedCalledDuringMomentum = false
    ApiHelper.getWithParam(ApiHelper.Apis.Tickets, objData, this, false, this.state.authHeader).then((response) => {
      if (response.length == 15) {
        this.setState({ canLoadMoreOpen: true })
      }
      if (this.state.pageOpen !== 0) {
        if (response.length == 0) {
          this.setState({ pageOpen: this.state.pageOpen - 1, canLoadMoreOpen: false })
        } else if (response.length < 15) {
          this.setState({ canLoadMoreOpen: false })
        }
        let arr = [...this.state.dataSourceOpen, ...response]
        this.setState({ dataSourceOpen: arr, isLoadingMoreOpen: false })
      } else {
        this.setState({ dataSourceOpen: response })
      }
    })
      .catch((response) => {
        this.setState({ isLoadingMoreOpen: false })
        ApiHelper.handleErrorAlert(response)
      })
  }

  /* Calling api to reopen ticket */
  reopenTicket(row) {
    // CommonFunctions.presentAlertWithAction(Messages.AskReopen + ` #${row.item.number}?`, Messages.ReOpen)
    //     .then((respose) => {
    // let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
    let objData = { status: 'open', note_text: '' }
    ApiHelper.putWithParam(ApiHelper.Apis.Tickets + `/${row.item.key}`, objData, this, true, this.state.authHeader).then((response) => {
      // const arrSource = this.state.dataSource
      // this.setState({ dataSource: arrSource });

      const arrSource = this.selectedTabDataSource()
      arrSource.splice(row.index, 1)
      this.setState({ dataSourceClose: arrSource });

      // this.viewWillAppear()
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
  addResponseTicket(row, note) {
    // CommonFunctions.presentAlertWithAction(Messages.AskReopen + ` #${row.item.number}?`, Messages.ReOpen)
    //     .then((respose) => {
    // let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
    let objData = { action: 'response', note_text: note, files: [] }
    ApiHelper.postWithParam(ApiHelper.Apis.Tickets + `/${row.item.id}`, objData, this, true, this.state.authHeader).then((response) => {
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

  /* Returns selected tab array */
  selectedTabDataSource() {
    switch (this.state.selectedTab) {
      case this.state.userTitle:
        return this.state.dataSourceUser
        break;
      case this.state.techTitle:
        return this.state.dataSourceTech
        break;
      case 'Closed':
        return this.state.dataSourceClose
        break;
      case 'Alt':
        return this.state.dataSourceAlt
        break;
      case 'All Open':
        return this.state.dataSourceOpen
        break;
      default:
        return []
        break;
    }
  }

  /* Savaing array to state based on selected tab */
  setSelectedTabDataSource(arr) {
    switch (this.state.selectedTab) {
      case this.state.userTitle:
        this.setState({ dataSourceUser: arr })
        break;
      case this.state.techTitle:
        this.setState({ dataSourceTech: arr })
        break;
      case 'Closed':
        this.setState({ dataSourceClose: arr })
        break;
      case 'Alt':
        this.setState({ dataSourceAlt: arr })
        break;
      case 'All Open':
        this.setState({ dataSourceOpen: arr })
        break;
      default:
        return []
        break;
    }
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
    if (this.state.loadingBar && this.selectedTabDataSource().length == 0) {
      return (
        <Animatable.View animation={'fadeIn'} style={styles.noDataContainer}>
          <Label style={styles.noDataTitleStyle}>
            {`${this.state.selectedTab} ${this.state.title.toLowerCase()} will appear here.`}
          </Label>
        </Animatable.View>
      )
    } else if (!this.state.loadingBar && this.selectedTabDataSource().length == 0) {
      return (
        <Animatable.View animation={'zoomIn'} delay={900} style={[styles.noDataContainer, { flex: 1, justifyContent: 'flex-end' }]}>
          <Image style={styles.noDataIcon} source={Images.nosearch} />
          <Label style={styles.noDataTitleStyle}>
            {Messages.NoData}
          </Label>
        </Animatable.View>
      )
    }
    return (null)
  }

  /* Rendering tab row */
  renderTabRow(row) {
    return (
      <Animatable.View useNativeDriver={true} animation={row.item == this.state.selectedTab ? 'zoomIn' : null}>
        <TouchableOpacity
          style={[styles.rowTabContainer, row.item == this.state.selectedTab ? styles.selectedTab : {}]}
          onPress={() => {
            if (!this.state.loading) {
              Keyboard.dismiss();
              if (this.sub) {
                this.subs.forEach((sub) => {
                  sub.remove();
                });
              }
              // if (!this.props.loading) {
              this.setState({ selectedTab: row.item })
              this.flatListTabRef.scrollToIndex({ animated: true, index: row.index, viewPosition: 0.5 })
              this.viewWillAppear()
              // }
            }
          }}>
          <Label style={[styles.tabTitle, row.item == this.state.selectedTab ? styles.tabSelectedTitle : {}]}>{row.item}</Label>
        </TouchableOpacity>
      </Animatable.View>
    )
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
          {/*<Label style={styles.ticketDescriptionText}>{row.item.days_old_in_minutes + ' ago'}</Label>*/}
                                
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
            isTransparent
            navigation={this.props.navigation}
            showTitle={this.state.title}
            rightImage={Images.searchInNav}
            hideRightButton={false}
            rightButton={() => {
              this.props.navigation.push('SearchTickets');
            }}
            isShowTwoRightButtons
            rightSecondImage={Images.filter}
            rightSecondButton={() => {
              this.props.navigation.push('FilterTickets', { selected: { 
                                                                        account: this.state.account, 
                                                                        tech: this.state.selectedTech,
                                                                        location: this.state.selectedLocation,
                                                                        class: this.state.selectedClass,
                                                                        status: this.state.selectedStatus, 
                                                                        priority: this.state.selectedPriority
                                                                      } });
            }}
          />
        </SafeAreaView>
        <LoaderBar show={this.state.loadingBar} />
        {this.state.selectedTab != '' && this.state.dataSourceTabs.length > 0 ?
          <Animatable.View animation={'fadeIn'} style={styles.flatListTabContainer}>
            <FlatList
              horizontal
              ref={(ref) => { this.flatListTabRef = ref; }}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flatListTabPadding}
              data={this.state.dataSourceTabs}
              renderItem={(row) => this.renderTabRow(row)}
              keyExtractor={(item, index) => index.toString()}
              keyboardShouldPersistTaps='handled'
            />
          </Animatable.View> : null}
        <View style={styles.contentContainer}>
          <SafeAreaView style={styles.mainContainer}>
            <View style={styles.mainContainer}>
              {this.renderNoData()}
              {this.renderAddResponse()}
              <SwipeListView
                ref={(ref) => { this.flatLisRef = ref }}
                contentContainerStyle={styles.flatListPadding}
                disableRightSwipe
                data={this.selectedTabDataSource()}
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
                onEndReachedThreshold={0.05}
                onEndReached={() => this.handleLoadMore()}
              />
            </View>
            <TouchableOpacity activeOpacity={0.7} style={styles.floatingContainer} onPress={() => {
              this.props.navigation.push('AddEditTicket');
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
export default connect(mapStateToProps, { userInfo, org, configInfo, authToken })(Tickets);