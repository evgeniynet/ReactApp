/* Imports */
import React, { Component } from 'react'
import { AppState, Image, View, TouchableOpacity, Platform, StatusBar, SafeAreaView, FlatList, ActivityIndicator, Linking } from 'react-native'
import { Container, Label, CardItem, Toast } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import PushNotification from 'react-native-push-notification';

import CommonFunctions from '../../../Components/CommonFunctions';
import { Messages, UserDataKeys } from '../../../Components/Constants';
import { userInfo, org, authInfo } from '../../../Redux/Actions';
import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Images, Colors, Metrics } from '../../../Themes';
import LinearGradient from 'react-native-linear-gradient';
import ApiHelper from '../../../Components/ApiHelper';
import Loader from '../../../Components/Loader';
import LoaderBar from '../../../Components/LoaderBar';
import NotificationManager from '../../../Components/NotificationManager';
import { notifiactionTokenManager } from '../../../Components/NotifiactionTokenManager';
import AppleHelper from '../../../Components/AppleHelper';
import GoogleHelper from '../../../Components/GoogleHelper';

// Styless
import styles from './Styles/ProfileStyles'

class Profile extends Component {

  // Life cycle of class
  /* Initiating state before the component mount. */
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      loadingBar: false,
      searchString: '',
      dataSource: [],
      isNotificationsOn: true,
      firstName: '',
      lastName: '',
      email: '',
      companyPhoneNumber: '',
      mobileNumber: '',
      skypeId: '',
      userData: null,
      isNotificationInProg: false,
      appState: AppState.currentState,
    };
  }

  componentDidMount() {
    this.setState({
      loading: false,
      loadingBar: false,
      searchString: '',
      dataSource: [{
        id: 4,
        title: 'Problem Management',
        isBadgeOn: true,
      }, {
        id: 7,
        title: 'Payroll',
        isBadgeOn: true,
      }],
      firstName: 'Hello!',
      lastName: '',
      email: '',
      companyPhoneNumber: '',
      mobileNumber: '',
      skypeId: '',
      userData: null,
      isNotificationInProg: false,
      appState: AppState.currentState,
    });

    this.viewWillAppear()
    this.props.navigation.addListener('didFocus', this.viewWillAppear)
    AppState.addEventListener('change', this._handleAppStateChange);
    
    GoogleHelper.googleSignInConfigure()
  }


  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }


  viewWillAppear = () => {
    this.fetchUserData()
    this.checkPermissions()
  }

  //Actions

  /* Checking notification permission and setting app state to state */
  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      console.log('App has come to the foreground!')
      this.checkPermissions()
    }
    this.setState({ appState: nextAppState });
  }

  //Class Methods

  /* Calling api to fetch user info */
  fetchUserData = async (isEdit = false) => {
    CommonFunctions.retrieveData(UserDataKeys.User)
      .then((user) => {
        this.props.userInfo(JSON.parse(user));

        CommonFunctions.retrieveData(UserDataKeys.Org)
          .then((org) => {
            let authHeader = (ApiHelper.authenticationHeader(JSON.parse(user), JSON.parse(org)))
            ApiHelper.get(ApiHelper.Apis.Profile, this, authHeader).then((response) => {
              this.setState({
                firstName: response.firstname,
                lastName: response.lastname,
                email: response.email,
                companyPhoneNumber: response.mobile_email,
                mobileNumber: response.mobile_phone,
                skypeId: response.skype,
                userData: response
              })
              /* Saving user in redux store and local storage */
              var objUser = { ...JSON.parse(user), ...response }
              objUser.api_token = JSON.parse(user).api_token
              this.props.userInfo(objUser);
              CommonFunctions.storeData(UserDataKeys.User, JSON.stringify(objUser))
              if (isEdit) {
                let data = { user: response }
                this.props.navigation.push('EditProfile', data);
              }
              this.fetchQueues(authHeader)
            })
              .catch((response) => {
                ApiHelper.handleErrorAlert(response)
              })
          })
      })
  }

  /* Calling api to fetch queues */
  fetchQueues(authHeader) {
    let objData = { sort_by: 'tickets_count' }
    ApiHelper.getWithParam(ApiHelper.Apis.Queues, objData, this, true, authHeader).then((response) => {
      this.setState({ dataSource: response })
    })
      .catch((response) => {
        ApiHelper.handleErrorAlert(response)
      })
  }

    /* Calling api to fetch user queues */
    fetchQueuesMember(authHeader) {
      let objData = {  }
      ApiHelper.getWithParam(ApiHelper.Apis.QueuesMember, objData, this, true, authHeader).then((response) => {
        this.setState({ dataSource: response })
      })
        .catch((response) => {
          ApiHelper.handleErrorAlert(response)
        })
    }

  /* Calling link account api */
  linkAccount(data) {
    CommonFunctions.retrieveData(UserDataKeys.User)
      .then((user) => {
        CommonFunctions.retrieveData(UserDataKeys.Org)
          .then((org) => {
            var email = ''
            if (data && data.social_type == 'google') {
              if (data.email.includes('@gmail.com')) {
                email = data.email
              } else {
                email = `${data.email}.googleprivaterelay.com`
              }
            } else if (data && data.social_type == 'apple') {
              email = `${data.social_id}@appleprivaterelay.com`
            }
            let obj = {
              emails: email,
              // provider: data.social_type,
            }
            console.log(obj)
            let authHeader = (ApiHelper.authenticationHeader(JSON.parse(user), JSON.parse(org)))
            ApiHelper.postWithParam(ApiHelper.Apis.Altemails, obj, this, false, authHeader)
              .then((response) => {
                this.fetchUserData()
              }).catch((response) => {
                console.log('====================================');
                console.log(response);
                console.log('====================================');
                if (response.status == 409) {
                  Toast.show({
                      text: 'Email is already registered in SherpaDesk',
                      position: 'top',
                      duration: 3000,
                      // type: 'warning',
                      style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
                    })
                } else if (response.status == 500) {
                  Toast.show({
                      text: `Email is already exists`,
                      position: 'top',
                      duration: 3000,
                      // type: 'warning',
                      style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
                    })
                } else {
                  ApiHelper.handleErrorAlert(response)
                }
              });
          })
      })
  }

  /* Calling link account api */
  unlinkAccount(type) {
    CommonFunctions.retrieveData(UserDataKeys.User)
      .then((user) => {
        CommonFunctions.retrieveData(UserDataKeys.Org)
          .then((org) => {
            var email = ''

            let linkedApple = this.state.userData && this.state.userData.alternate_emails.filter(email => email.includes('@appleprivaterelay.com'))
            let linkedGoogle = this.state.userData && this.state.userData.alternate_emails.filter(email => email.includes('@gmail.com') || email.includes('.googleprivaterelay.com') )

            if (type == 'google') {
              email = linkedGoogle.length > 0 ? linkedGoogle[0] : ''
            } else if (type == 'apple') {
              email = linkedApple.length > 0 ? linkedApple[0] : ''
            }
            let obj = {
              emails: email,
            }
            console.log(obj)
            let authHeader = (ApiHelper.authenticationHeader(JSON.parse(user), JSON.parse(org)))
            ApiHelper.deleteWithParam(ApiHelper.Apis.Altemails, obj, this, false, authHeader)
              .then((response) => {
                this.fetchUserData()              
              }).catch((response) => {
                console.log('====================================');
                console.log(response);
                console.log('====================================');
                ApiHelper.handleErrorAlert(response)
              });
          })
      })
  }

  /* Registering notification with azure notification hub */
  registerWithAzure = async (token, email) => {
    this.notificationRegistrationService = new NotificationManager();
    try {
      const pnPlatform = Platform.OS == "ios" ? "apns" : "fcm";
      const pnToken = token;
      const request = {
        installationId: '',
        platform: pnPlatform,
        pushChannel: pnToken,
        tags: email && email != '' ? [email] : []
      };
      const response = await this.notificationRegistrationService.registerAsync(request);
      console.log('response====================================');
      console.log(response);
      console.log('====================================');
      this.checkPermissions()
      this.setState({ isNotificationInProg: false })
    }
    catch (e) {
      console.log(`Registration failed: ${e}`);
      this.checkPermissions()
      this.setState({ isNotificationInProg: false })
      Toast.show({
        text: Messages.FailedToRegisterPNS,
        position: 'top',
        duration: 3000,
        style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
      })
    }
  }

  /* Deregistering device with azure notification hub */
  async deregisterWithAzure() {
    this.notificationRegistrationService = new NotificationManager();
    try {
      await this.notificationRegistrationService.deregisterAsync();
      console.log(`Deregistration Successful`);
      CommonFunctions.storeData(UserDataKeys.AzureRegistration, '')
      setTimeout(() => {
        this.checkPermissions()
        this.setState({ isNotificationInProg: false })
      }, 100)
    } catch (e) {
      console.log(`Deregistration failed: ${e}`);
      CommonFunctions.storeData(UserDataKeys.AzureRegistration, '')
      setTimeout(() => {
        this.checkPermissions()
        this.setState({ isNotificationInProg: false })
        Toast.show({
          text: Messages.FailedToDeregisterPNS,
          position: 'top',
          duration: 3000,
          style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
        })
      }, 100)
    }
  }

  /* Checking notification permission and setting status to state */
  checkPermissions() {
    CommonFunctions.retrieveData(UserDataKeys.AzureRegistration)
      .then((response) => {
        if (response && response != '{}' && response != '') {
          console.log('====================================', response);
          PushNotification.checkPermissions((permissions) => {
            console.log('permissions====================================');
            console.log(permissions);
            console.log('====================================');
            this.setState({ isNotificationsOn: (permissions.alert || false) })
            // this.setState({ isNotificationsOn: permissions.alert || false })
          })
        } else {
          this.setState({ isNotificationsOn: false })
        }
      })
      .catch((err) => {
        this.setState({ isNotificationsOn: false })
      })

  }

  /* Rendering row */
  renderRow(row) {
    return (
      <View style={styles.rowContainer}>
        <Label style={styles.titleText}>{'Queue ' + (row.index + 1)}</Label>
        <CardItem activeOpacity={0.7} style={styles.reusableRowContainer}>
          <TouchableOpacity activeOpacity={1} style={styles.queueContentContainer} onPress={() => {
            // const data = { selected: row.item }
            // this.props.navigation.push('QueueSelection', data);
          }}>
            <Label style={styles.queueTitleText}>{row.item.fullname}</Label>
          </TouchableOpacity>
          { <View style={styles.badgeContainer}>
            <Label style={styles.badgeTitleText}>{'Badge on app icon'}</Label>
            <TouchableOpacity style={styles.switchContainer} onPress={() => {
              let arrRows = this.state.dataSource
              arrRows[row.index].isBadgeOn = !(arrRows[row.index].isBadgeOn)
              this.setState({
                dataSource: arrRows
              })
            }}>
              <Image style={styles.switchIcon} source={!row.item.isBadgeOn ? Images.toggleOn : Images.toggleOff} />
            </TouchableOpacity>
          </View> }
        </CardItem>
      </View>
    )
  }

  /* Rendering header view */
  renderHeader() {
    return (
      <View>
        <View style={styles.contentContainer} />
        <View style={styles.rowContainer}>
          <View>
            <Label style={styles.titleText}>Company Phone Number</Label>
            <CardItem style={styles.inputContainer}>
              <Label style={styles.inputTitle}>{this.state.companyPhoneNumber}</Label>
            </CardItem>
          </View>
          <View>
            <Label style={styles.titleText}>Mobile Phone</Label>
            <CardItem style={styles.inputContainer}>
              <Label style={styles.inputTitle}>{this.state.mobileNumber}</Label>
            </CardItem>
          </View>
          <View>
            <Label style={styles.titleText}>Skype</Label>
            <CardItem style={styles.inputContainer}>
              <Label style={styles.inputTitle}>{this.state.skypeId}</Label>
            </CardItem>
          </View>
          {this.props.objData && this.props.objData.user && (this.props.objData.user.is_techoradmin == true) ?
            <View>
              <CardItem style={styles.inputContainer}>
                <Label style={styles.inputTitle}>Notification</Label>
                <TouchableOpacity onPress={() => {
                  this.setState({ isNotificationInProg: true })
                  if (this.state.isNotificationsOn) {
                    this.deregisterWithAzure()
                    setTimeout(() => {
                      this.checkPermissions()
                    }, 100)
                  } else {
                    CommonFunctions.retrieveData(UserDataKeys.User)
                      .then((user) => {
                        CommonFunctions.retrieveData(UserDataKeys.DeviceToken)
                          .then((response) => {
                            console.log('Saved Token====================================', response);
                            console.log('objUser====================================', JSON.parse(user));
                            this.registerWithAzure(response, (JSON.parse(user).login_id || ''))
                          })
                          .catch((err) => {
                            notifiactionTokenManager.configure().then((token) => {
                              console.log('Token:-- ====================================', token);
                              console.log('objUser====================================', JSON.parse(user));
                              this.registerWithAzure(token, (JSON.parse(user).login_id || ''))
                            })
                          })
                      })
                  }
                }}>
                  {this.state.isNotificationInProg ? <ActivityIndicator size="small" color={Colors.mainPrimary} /> : <Image style={styles.switchIcon} source={this.state.isNotificationsOn ? Images.toggleOn : Images.toggleOff} />}
                </TouchableOpacity>
              </CardItem>
            </View>
            : null}
        </View>
      </View>
    )
  }

  /* Rendering footer view */
  renderFooter() {
    let isLinkedApple = this.state.userData && this.state.userData.alternate_emails.filter(email => email.includes('@appleprivaterelay.com')).length > 0
    let isLinkedGoogle = this.state.userData && this.state.userData.alternate_emails.filter(email => email.includes('@gmail.com') || email.includes('.googleprivaterelay.com') ).length > 0
    let isGoogleMainAccount = this.state.userData && this.state.userData.email.includes('@gmail.com')
    return (
      <View>
        <View style={{ flexDirection: 'row', }}>
          {Platform.OS == 'ios' ?
            <TouchableOpacity activeOpacity={0.7} style={[styles.buttonContainer, { flex: 1, marginRight: 0 }]} onPress={() => {
              if (isLinkedApple) {
                this.unlinkAccount('apple')
              } else {
                AppleHelper.signInWithApple()
                  .then((userData) => {
                    console.log('Apple userData ----->', userData);
                    if (userData !== null) {
                      this.linkAccount(userData)
                    }
                  })
              }
            }}>
              <Label style={styles.buttonText}>{`${isLinkedApple ? 'Unlink' : 'Link'} with Apple`}</Label>
            </TouchableOpacity>
            : null }
            <TouchableOpacity activeOpacity={0.7} style={[styles.buttonContainer, { flex: 1 }]} onPress={() => {
               if (isLinkedGoogle) {
                this.unlinkAccount('google')
               } else if (!isLinkedGoogle && isGoogleMainAccount) {
                  Toast.show({
                    text: `You can't unlink this email address for this account.`,
                    position: 'top',
                    duration: 3000,
                    // type: 'warning',
                    style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
                  })
               } else {
                GoogleHelper.signInWithGoogle()
                  .then((userData) => {
                    console.log('Google userData ----->', userData);
                    if (userData !== null) {
                      this.linkAccount(userData)
                    }
                  })
              }
            }}>
              <Label style={styles.buttonText}>{`${isLinkedGoogle || isGoogleMainAccount ? 'Unlink' : 'Link'} with Google`}</Label>
            </TouchableOpacity>
        </View>
      <View>
        <TouchableOpacity activeOpacity={0.7} style={styles.buttonContainer} onPress={() => {
          CommonFunctions.retrieveData(UserDataKeys.Org)
            .then((org) => {
              let objOrg = JSON.parse(org)
              if (objOrg && objOrg.instances && objOrg.instances.length > 0) {
                var strUrl = `${ApiHelper.WebBaseUrl}?dept=` + `${objOrg.instances[0].key}&org=${objOrg.key}&ReturnUrl=%2fmc%2fadmin%2faccountsettings.aspx`
                Linking.canOpenURL(strUrl).then(supported => {
                  if (supported) {
                    Linking.openURL(strUrl);
                  } else {
                    console.log("Don't know how to open URI: " + strUrl);
                  }
                });
              }
            })
        }}>
          <Label style={styles.buttonText}>Delete All My Personal Data</Label>
        </TouchableOpacity>
        <Label style={styles.noteText}>{"To delete your personal data and close account you should go into the \'Configuration\' section and then down to \'Delete Organization\'"}</Label>
      </View>
      </View>
    )
  }

  /* What to display on the screen */
  render() {
    return (
      <Container>
        {StatusBar.setBarStyle('light-content', true)}
        {Platform.OS === 'ios' ? null : StatusBar.setBackgroundColor(Colors.mainPrimary)}
        <Loader show={this.state.loadingBar} />
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={
            [Colors.mainPrimary,
            Colors.secondary]}
          style={styles.backgroundImage} />
        <View style={styles.backgroundEmptyContainer} />
        <SafeAreaView>
          <NavigationBar
            isTransparent
            navigation={this.props.navigation}
            showTitle='Profile'
            rightImage={Images.editP}
            hideRightButton={this.props.objData && this.props.objData.user && this.props.objData.user.is_techoradmin ? false : true}
            rightButton={() => {
              if (!this.state.loading && this.state.userData) {
                let data = { user: this.state.userData }
                this.props.navigation.push('EditProfile', data);
              } else if (!this.state.loading && this.state.userData == null) {
                this.fetchUserData(true)
              }
            }}
          />
        </SafeAreaView>
        <LoaderBar show={this.state.loading} />
        <View>
          <Label style={styles.userNameText}>{this.state.firstName}</Label>
          <Label style={styles.userEmailText}>{this.state.email}</Label>
        </View>
        <View style={styles.contentContainer}>
          <SafeAreaView style={styles.mainContainer}>
            <View style={styles.mainContainer}>
              <FlatList
                ref={(ref) => { this.flatLisRef = ref; }}
                contentContainerStyle={styles.flatListPadding}
                data={(this.props.objData && this.props.objData.user && (this.props.objData.user.is_techoradmin == true)) ? this.state.dataSource : []}
                renderItem={(row) => this.renderRow(row)}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={this.renderHeader()}
                ListFooterComponent={this.renderFooter()}
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
  var objData = {}
  const { org } = state.org
  const { authToken } = state.authToken
  const { user } = state.userInfo
  objData.org = org
  objData.authToken = authToken
  objData.user = user
  return { objData }
};

/* Connecting to redux store and exporting class */
export default connect(mapStateToProps, { userInfo, org })(Profile);