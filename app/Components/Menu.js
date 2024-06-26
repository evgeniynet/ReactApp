/* Imports */
import React, { Component } from 'react'
import { View, TouchableOpacity, FlatList, Image, SafeAreaView, Linking, Platform } from 'react-native'
import { NavigationActions, StackActions } from 'react-navigation'
import { Container, Label, CardItem, Toast } from 'native-base';
import { connect } from 'react-redux';
import { DrawerActions } from 'react-navigation-drawer'
import { Buffer } from 'buffer'

//Styles
import { UserDataKeys, Messages } from './Constants';
import CommonFunctions from './CommonFunctions';
import { Colors, Images, Metrics } from '../Themes'
import styles from './Styles/MenuStyles'
import ApiHelper from './ApiHelper';
import Loader from './Loader';
import { userInfo, authToken, org, configInfo } from '../Redux/Actions';
import OrgOptions from './OrgOptions';
import NotificationManager from './NotificationManager';

class Menu extends Component {

  // Life cycle of class
  /* Initiating state before the component mount. */
  constructor(props) {
    super(props);
    // console.log('constructor : ' + JSON.stringify(props));

    this.state = {
      dataSource: [],
      orgDataSource: [],
      selectedOrg: {},
      showOrgPopup: false,
      loading: false,
      selected: 'Dashboard',
      firstname: '',
      lastname: '',
      email: '',
    };
  }

  componentDidMount() {
    this.fetchUserData()
  }

  //Actions
  /* Closing drawer menu */
  onCloseBtnPressed() {
    // this.props.navigation.goBack()
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
  }

  /* Setting profile as a root view and closing drawer menu */
  onProfileBtnPressed() {
    let data = { user: this.state.userData }
    const resetAction = StackActions.replace({ routeName: 'Profile', data });
    this.props.navigation.dispatch(resetAction);
    this.props.navigation.replace(NavigationActions.navigate({ routeName: 'Profile', data }))
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
  }

  /* Setting selected option as a root view and closing drawer menu */
  didPressedRow(row, item, index) {
    if (row.item.ViewId != '' && row.item.ViewId == 'SwitchOrg') {
      // this.setState({ showOrgPopup: true })
      if (this.props.objData && (this.props.objData.authToken != undefined || this.props.objData.authToken == null)) {
        this.fetchOrganizations(this.props.objData.authToken)
      } else {
        CommonFunctions.retrieveData(UserDataKeys.AuthToken)
          .then((auth) => {
            let authData = JSON.parse(auth)
            this.fetchOrganizations(authData.api_token)
          })
      }
      // this.props.navigation.dispatch(DrawerActions.closeDrawer());
    } else if (row.item.ViewId != '' && row.item.ViewId == 'FullAppMode') {
      CommonFunctions.retrieveData(UserDataKeys.Org)
        .then((org) => {
          let objOrg = JSON.parse(org)
          if (objOrg && objOrg.instances && objOrg.instances.length > 0) {
            var strUrl = `${ApiHelper.WebBaseUrl}?dept=` + `${objOrg.instances[0].key}&org=${objOrg.key}`
            Linking.canOpenURL(strUrl).then(supported => {
              if (supported) {
                Linking.openURL(strUrl);
              } else {
                console.log("Don't know how to open URI: " + strUrl);
              }
            });
          }
        })
    } else if (row.item.ViewId != '') {
      const resetAction = StackActions.replace({ routeName: row.item.ViewId });
      this.props.navigation.dispatch(resetAction);
      this.props.navigation.replace(NavigationActions.navigate({ routeName: row.item.ViewId }))
      this.props.navigation.dispatch(DrawerActions.closeDrawer());
    }
  }

  /* Loging out user */
  onLogoutBtnPressed() {
    CommonFunctions.presentAlertWithAction(Messages.AskLogout, Messages.Logout)
      // CommonFunctions.presentAlertWithOkAction('Are sure you want to logout?')
      .then((respose) => {
        this.deregisterWithAzure()
        CommonFunctions.retrieveData(UserDataKeys.User)
          .then((user) => {
            // ApiHelper.postWithParam(ApiHelper.Apis.Logout, {}, this, true, this.props.token)
            //   .then((response) => {
            this.resetNavigationToAuthRoot()
            // })
          })
          .catch((err) => this.resetNavigationToAuthRoot())
      })
  }

  /* Calling organizations in api */
  fetchOrganizations(token, isOnlyFetchData = false) {

    let encryptedAuthHeader = new Buffer(`x:${token}`).toString("base64");

    ApiHelper.get(ApiHelper.Apis.Organizations, this, encryptedAuthHeader, !isOnlyFetchData).then((response) => {
      /* Saving user in redux store and local storage */
      var arrOrgs = []
      response.forEach(org => {
        if (org.instances.length > 1) {
          org.instances.forEach(instance => {
            console.log(instance);
            var aOrg = { ...org }
            aOrg.instances = [instance]
            arrOrgs.push(aOrg)
          });
        } else {
          arrOrgs.push(org)
        }
      });
      CommonFunctions.storeData(UserDataKeys.Organizations, JSON.stringify(arrOrgs))
      if (!isOnlyFetchData) {
        setTimeout(() => {
          this.setState({ orgDataSource: arrOrgs, showOrgPopup: true, loading: false })
        }, 200)
      } else {
        this.displaySwitchOrg()
      }
    }).catch((response) => {
      if (!isOnlyFetchData) {
        if (response.status == 403) {
          Toast.show({
            text: 'Please try again.',
            position: 'top',
            duration: 3000,
            // type: 'warning',
            style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
          })
          // CommonFunctions.presentAlert('Invalid credentials, Please update the email or password and try again.')
        } else {
          ApiHelper.handleErrorAlert(response)
        }
      }
    });
  }

  /* Hidding(Dismissing) popup screen */
  dismissPopup(option) {
    this.setState({ showOrgPopup: false })
  }

  /* Setting state on drop down selection change */
  selectionDidChange(dropDownName, selected) {
    if (dropDownName === 'Org') {
      this.setState({ selectedOrg: selected });
      this.props.org(selected)
      CommonFunctions.storeData(UserDataKeys.Org, JSON.stringify(selected))
      setTimeout(() => {
        this.fetchConfigAndNavigate(selected)
      }, 300)
    }
    this.dismissPopup();
  }

  //Class Methods

  /* Fetching config info and setting new root based on selected org. */
  fetchConfigAndNavigate(org) {
    CommonFunctions.retrieveData(UserDataKeys.User)
      .then((userJson) => {
        let user = JSON.parse(userJson)
        let authHeader = (ApiHelper.authenticationHeader(user, org))

        ApiHelper.getWithParam(ApiHelper.Apis.Config, {c:1}, this, true, authHeader).then((response) => {
          /* Saving user in redux store and local storage */
          this.props.configInfo(response);
          CommonFunctions.storeData(UserDataKeys.Config, JSON.stringify(response))

          var objUser = { ...user, ...response.user }
          this.setState({ userData: objUser })
          this.props.userInfo(objUser);
          CommonFunctions.storeData(UserDataKeys.User, JSON.stringify(objUser))

          this.setState({
            loading: false,
          })
          setTimeout(() => {
            // /* Setting hame(dashboard stack) as root view */
            const resetAction = StackActions.reset({
              index: 0, // <-- currect active route from actions array
              actions: [
                NavigationActions.navigate({ routeName: objUser.is_techoradmin ? 'dashboardStack' : 'ticketStack' }),
              ],
            });
            this.props.navigation.dispatch(resetAction);
          }, 100)
        })
          .catch((response) => {
            ApiHelper.handleErrorAlert(response)
          })
      })

  }

  /* Calling api to fetch user infromation */
  fetchUserData = async () => {
    CommonFunctions.retrieveData(UserDataKeys.User)
      .then((user) => {
        let aUser = JSON.parse(user)
        this.setState({
          firstname: aUser.firstname ?? 'Welcome',
          lastname: aUser.lastname ?? '',
          email: aUser.email ?? '',
        })
        this.setState({ userData: aUser })
        /* Calling api to fetch organizations */
        this.fetchOrganizations(aUser.api_token, true)

        CommonFunctions.retrieveData(UserDataKeys.Org)
          .then((org) => {
            this.setState({ selectedOrg: JSON.parse(org) })
            this.props.org(JSON.parse(org))
            let authHeader = (ApiHelper.authenticationHeader(aUser, JSON.parse(org)))
            if (this.state.lastname == undefined || this.state.lastname == null || this.state.lastname == '') {
              /* Calling api to fetch user profile */
              ApiHelper.get(ApiHelper.Apis.Profile, this, authHeader, false).then((response) => {
                /* Saving user in redux store and local storage */
                var objUser = { ...aUser, ...response }
                objUser.api_token = aUser.api_token

                this.setState({
                  firstname: response.firstname,
                  lastname: response.lastname,
                  email: response.email,
                  userData: objUser
                })
                this.props.userInfo(objUser);
                this.props.authToken(aUser.api_token);
                CommonFunctions.storeData(UserDataKeys.User, JSON.stringify(objUser))

              })
                .catch((response) => {
                  console.log('Error response====================================');
                  console.log(response);
                  console.log('====================================');
                  // ApiHelper.handleErrorAlert(response)
                })
            } else {

              CommonFunctions.retrieveData(UserDataKeys.Config)
                .then((response) => {
                  let config = JSON.parse(response)
                  this.setMenuData(config, aUser)
                  this.fetchConfig(aUser, authHeader)
                })
                .catch((err) => {

                  /* Calling api to fetch config info */
                  ApiHelper.get(ApiHelper.Apis.Config, this, authHeader).then((response) => {
                    this.setState({
                      loading: false
                    })
                    /* Saving user in redux store and local storage */
                    this.props.configInfo(response);
                    CommonFunctions.storeData(UserDataKeys.Config, JSON.stringify(response))

                    var objUser = { ...JSON.parse(user), ...response.user }
                    objUser.api_token = JSON.parse(user).api_token
                    this.setState({ userData: objUser })
                    this.props.userInfo(objUser);
                    CommonFunctions.storeData(UserDataKeys.User, JSON.stringify(objUser))

                    this.setMenuData(response, objUser)
                  })
                    .catch((response) => {
                      ApiHelper.handleErrorAlert(response)
                    })
                })

            }
          })
      })

    /* Calling func for prepar switch org array */
    this.displaySwitchOrg()

  }

  /* Calling api to fetch config info */
  fetchConfig = async (user, authHeader) => {
    ApiHelper.get(ApiHelper.Apis.Config, this, authHeader).then((response) => {
      /* Saving user in redux store and local storage */
      this.props.configInfo(response);
      CommonFunctions.storeData(UserDataKeys.Config, JSON.stringify(response))

      var objUser = { ...user, ...response.user }
      objUser.api_token = user.api_token
      this.setState({ userData: objUser })
      CommonFunctions.storeData(UserDataKeys.User, JSON.stringify(objUser))
      this.setMenuData(response, objUser)

      console.log('Config Saved====================================', response);
      this.setState({
        loading: false
      })
    })
      .catch((response) => {
      })
  }

  /* Preparing menu list array */
  setMenuData(config, user) {
    console.log('setMenuData====================================');
    //console.log(config);
    console.log('====================================');
    var arrOptions = []
    var menus = ['Dashboard', 'Tickets', 'Events', 'Timelogs', 'Accounts', 'Locations', 'Technicians', 'Expenses', 'Queues', 'ToDos', 'Assets']
    menus.forEach(menu => {
      switch (menu) {
        case 'Dashboard':
          if (user.is_techoradmin) {
            arrOptions.push({ Title: 'Dashboard', Icon: Images.smDashboard, ViewId: 'Dashboard' })
          }
          break;
        case 'Tickets':
          var name = 'Tickets'
          if (config.is_customnames) {
            name = config.names.ticket.p ?? 'Tickets'
          }
          arrOptions.push({ Title: name, Icon: Images.smTickets, ViewId: 'Tickets' })
          // }
          break;
        case 'Events':
          if (user.is_techoradmin && config.is_events) {
            arrOptions.push({ Title: 'Events', Icon: Images.smEvents, ViewId: 'Events' })
          }
          break;
        case 'Timelogs':
          if (user.is_techoradmin && config.is_time_tracking) {
            arrOptions.push({ Title: 'Timelogs', Icon: Images.smTimelogs, ViewId: 'Timelogs' })
          }
          break;
        case 'Accounts':
          if (user.is_techoradmin && config.is_account_manager) {
            var name = 'Accounts'
            if (config.is_customnames) {
              name = config.names.account.p ?? 'Accounts'
            }
            arrOptions.push({ Title: name, Icon: Images.smAccounts, ViewId: 'Accounts' })
          }
          break;
        case 'Locations':
          if (user.is_techoradmin && config.is_location_tracking) {
            var name = 'Locations'
            if (config.is_customnames) {
              name = config.names.location.p ?? 'Locations'
            }
            arrOptions.push({ Title: name, Icon: Images.smLocations, ViewId: 'Locations' })
          }
          break;
        case 'Technicians':
          if (user.is_techoradmin) {
            var name = 'Technicians'
            if (config.is_customnames) {
              name = config.names.tech.p ?? 'Technicians'
            }
            arrOptions.push({ Title: name, Icon: Images.smTechnicians, ViewId: 'Technicians' })
          }
          break;
        case 'Expenses':
          if (user.is_techoradmin && config.is_expenses) {
            arrOptions.push({ Title: 'Expenses', Icon: Images.smInvoices, ViewId: 'Expenses' })
          }
          break;
        case 'Queues':
          if (user.is_techoradmin && config.is_unassigned_queue && (!user.is_limit_assigned_tkts || user.is_admin)) {
            arrOptions.push({ Title: 'Queues', Icon: Images.smQueues, ViewId: 'Queues' })
          }
          break;
        case 'ToDos':
          if (user.is_techoradmin && config.is_todos) {
            arrOptions.push({ Title: 'ToDos', Icon: Images.smTodos, ViewId: 'ToDos' })
          }
          break;
        case 'Assets':
            if (user.is_techoradmin && config.is_asset_tracking) {
              arrOptions.push({ Title: 'Assets', Icon: Images.smAsset, ViewId: 'Assets' })
            }
            break;
        default:
          break;
      }
    });

    this.setState({
      dataSource: arrOptions
    })

    /* Calling func for prepar switch org array */
    this.displaySwitchOrg()
  }

  /* Preparing switch organization array (Organizations) */
  displaySwitchOrg() {
    CommonFunctions.retrieveData(UserDataKeys.Organizations)
      .then((orgs) => {
        let arrOrgs = JSON.parse(orgs)
        if (arrOrgs != null && arrOrgs != undefined) {
          if (arrOrgs.length > 1) {
            let arrMenu = this.state.dataSource.filter((menu) => {
              return menu.ViewId == 'SwitchOrg'
            })
            console.log('SwitchOrgs====================================');
            console.log(arrMenu);
            console.log('orgs====================================', arrOrgs.length);
            let arrMenus = this.state.dataSource.filter((menu) => {
              return menu.ViewId == 'FullAppMode'
            })

            if (arrMenu.length == 0) {
              let arrTemp = this.state.dataSource
              arrTemp.push({ Title: 'Switch Org', Icon: Images.smSwitchOrg, ViewId: 'SwitchOrg' })
              if (arrMenus.length == 0) {
                arrTemp.push({ Title: 'Full App Mode', Icon: Images.smFullApp, ViewId: 'FullAppMode' })
              }
              this.setState({ dataSource: arrTemp })
            }
          } else {
            let arrTemp = this.state.dataSource
            let arrMenu = this.state.dataSource.filter((menu) => {
              return menu.ViewId == 'FullAppMode'
            })
            if (arrMenu.length == 0) {
              arrTemp.push({ Title: 'Full App Mode', Icon: Images.smFullApp, ViewId: 'FullAppMode' })
              this.setState({ dataSource: arrTemp })
            }
          }
        }
      }).catch(() => {
        let arrTemp = this.state.dataSource
        arrTemp.push({ Title: 'Full App Mode', Icon: Images.smFullApp, ViewId: 'FullAppMode' })
        this.setState({ dataSource: arrTemp })
      })
  }

  /* Deregistering device with azure notification hub */
  async deregisterWithAzure() {
    this.notificationRegistrationService = new NotificationManager();
    try {
      await this.notificationRegistrationService.deregisterAsync();
      console.log(`Deregistration Successful`);
      CommonFunctions.storeData(UserDataKeys.AzureRegistration, '')
    } catch (e) {
      console.log(`Deregistration failed: ${e}`);
    }
  }

  /* Setting login screen */
  resetNavigationToAuthRoot() {
    setTimeout(() => {
      CommonFunctions.storeData(UserDataKeys.User, '')
      CommonFunctions.storeData(UserDataKeys.AuthToken, '')
      CommonFunctions.storeData(UserDataKeys.Config, '')
      CommonFunctions.storeData(UserDataKeys.Org, '')
      CommonFunctions.storeData(UserDataKeys.DeviceToken, '')
      //Setting hame as root view
      const resetAction = StackActions.reset({
        index: 0, // <-- currect active route from actions array
        actions: [
          NavigationActions.navigate({ routeName: 'authStack' }),
        ],
      });
      this.props.navigation.dispatch(resetAction);
    }, 100)
  }

  /* Rendering popup screen */
  renderDropDownOptions() {
    if (this.state.showOrgPopup) {
      return (
        <OrgOptions isShowAsModal={true} canDismiss={true} dataSource={this.state.orgDataSource} dismissPopup={() => this.dismissPopup()} selected={this.state.selectedOrg} selectionDidChange={(selected) => { this.selectionDidChange('Org', selected); }} />
      )
    } else {
      return null
    }
  }

  /* Rendering option  */
  renderRow(row, item, index) {
    return (
      <CardItem button activeOpacity={0.7} style={styles.menuItem} onPress={() => this.didPressedRow(row, item, index)}>
        <Image style={styles.menuIconStyle} source={row.item.Icon} />
        <Label style={styles.menuTitleStyle}>{row.item.Title}</Label>
      </CardItem>
    );
  }

  /* What are displaying on the screen */
  render() {
    const { navigation } = this.props
    return (
      <Container>
        <Loader show={this.state.loading} />
        <SafeAreaView bounces={false} style={styles.container}>
          <View style={styles.topBottonsContainer}>
            <TouchableOpacity style={styles.topButton} onPress={() => { this.onLogoutBtnPressed(); }}>
              <Image style={styles.buttonIcon} source={Images.signout} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.topButton} onPress={() => { this.onCloseBtnPressed(); }}>
              <Image style={styles.buttonIcon} source={Images.cancel} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.7} style={styles.userConatiner} onPress={() => { this.onProfileBtnPressed(); }}>
            <Label style={styles.userName}>{(this.state.firstname + ' ' + this.state.lastname)}</Label>
          </TouchableOpacity>
          <FlatList
            contentContainerStyle={styles.menuListContainer}
            // bounces={false}
            numColumns={2}
            enableEmptySections
            showsVerticalScrollIndicator={false}
            data={this.state.dataSource}
            renderItem={(row, item, index) => this.renderRow(row, item, index)}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={<Label style={styles.appVersionMenu}>App version: {Platform.OS === 'ios' ? '1.3.9' : '1.3.9'} Last Update: May 2023</Label>}
          />
        </SafeAreaView>
        {this.renderDropDownOptions()}
        
      </Container>
    )
  }
}

/* Subscribing to redux store for updates */
const mapStateToProps = (state) => {
  var objData = {}
  const { user } = state.userInfo
  const { authToken } = state.authToken
  const { org } = state.org
  const { configInfo } = state.configInfo

  objData.user = user
  objData.authToken = authToken
  objData.org = org
  objData.configInfo = configInfo

  return { objData }
};

/* Connecting to redux store and exporting class */
export default connect(mapStateToProps, { userInfo, org, authToken, configInfo })(Menu)
