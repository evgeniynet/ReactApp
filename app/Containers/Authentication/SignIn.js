/* Imports */
import React, { Component } from 'react'
import { ScrollView, Image, View, Keyboard, TouchableOpacity, StatusBar, Platform , Linking} from 'react-native'
import { Container, Button, Input, Text, Label, Toast } from 'native-base';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { StackActions, NavigationActions } from 'react-navigation';
import { appleAuthAndroid, AppleButton } from '@invertase/react-native-apple-authentication';
import { Buffer } from 'buffer'

import styles from './Styles/SignInStyles'
import { Images, Colors, Metrics } from '../../Themes'
import ValidationHelper from '../../Components/ValidationHelper';
import CommonFunctions from '../../Components/CommonFunctions';
import { UserDataKeys } from '../../Components/Constants';
import ApiHelper from '../../Components/ApiHelper';
import AppleHelper from '../../Components/AppleHelper';
import GoogleHelper from '../../Components/GoogleHelper';
import Loader from '../../Components/Loader';
import OrgOptions from '../../Components/OrgOptions';
import NotificationManager from '../../Components/NotificationManager';
import { notifiactionTokenManager } from '../../Components/NotifiactionTokenManager'

import {
  userInfo,
  authToken,
  org,
  configInfo,
  resetAuthTokenValueToDefault,
  resetConfigInfo,
  resetDeviceTokenValueToDefault,
  resetOrgValueToDefault,
  resetInfo
} from '../../Redux/Actions';

class SignIn extends Component {

  // Life cycle of class
  /* Initiating state before the component mount. */
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      email: '',
      password: '',
      isValidateRunTime: false,
      showAppleSignIn: false,
      orgDataSource: [],
      selectedOrg: {},
      showOrgPopup: false,
      apiToken: null
    };
  }

  componentDidMount() {
    this.setState({
      loading: false,
      email: '',
      password: '',
      isValidateRunTime: false,
      showAppleSignIn: false,
      isShowPasswordAsText: false,
      showAppleSignIn: false,
      orgDataSource: [],
      selectedOrg: {},
      showOrgPopup: false,
      apiToken: null
    });

    if (Platform.OS === 'ios') {
      const majorVersionIOS = parseInt(Platform.Version, 10);
      if (majorVersionIOS >= 13) {
        this.setState({ showAppleSignIn: true })
      }
    }
    this.props.resetInfo()
    this.props.resetAuthTokenValueToDefault()
    this.props.resetConfigInfo()
    this.props.resetDeviceTokenValueToDefault()
    this.props.resetOrgValueToDefault()
    GoogleHelper.googleSignInConfigure()
  }

  componentWillUnmount() {
    Keyboard.dismiss();
    this.setState({
      loading: false,
    })
  }

  //Actions

    /* Social sign in with apple */
    signInWithApplePressed() {
      Keyboard.dismiss();
      console.log('signInWithApplePressed');
      AppleHelper.signInWithApple()
        .then((userData) => {
          console.log('Apple userData ----->', userData);
          if (userData !== null) {
            this.socialSignIn(userData)
          }
        })
    }

      /* Social sign in with google */
  signInWithGooglePressed() {
    Keyboard.dismiss();
    // this.socialSignIn({ email: 'wvedeveloper@gmail.com'})
    GoogleHelper.signInWithGoogle()
      .then((userData) => {
        console.log('Google userData ----->', userData);
        if (userData !== null) {
          this.socialSignIn(userData)
        }
      })
  }


  /* Validating information and calling sign in api */
  btnSignInPressed() {
    /* Checking validation if it's valid calling API*/
    if (this.isValid()) {
      Keyboard.dismiss();
      let obj = {
        // id: 1,
        username: this.state.email,
        password: this.state.password,
      }
      ApiHelper.postWithParam(ApiHelper.Apis.SignIn, obj, this).then((response) => {
        /* Saving user in redux store and local storage */
        this.setState({ apiToken: response })
        this.props.authToken(response.api_token);
        CommonFunctions.storeData(UserDataKeys.AuthToken, JSON.stringify(response))
        this.fetchOrganizations(response.api_token)
      }).catch((response) => {
        if (response.status == 403) {
          Toast.show({
            text: 'Invalid credentials, Please update the email or password and try again.',
            position: 'top',
            duration: 3000,
            // type: 'warning',
            style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
          })
          // CommonFunctions.presentAlert('Invalid credentials, Please update the email or password and try again.')
        } else {
          ApiHelper.handleErrorAlert(response)
        }
      });
    }
  }

  /* Navigating to forgot password screen */
  btnForgotPressed() {
    Keyboard.dismiss();
    // this.props.navigation.push('ForgotPassword', { email: this.state.email });
    const data = { title: 'Forgot Password' }
    this.props.navigation.push('WebViewInfo', data);
  }

  /* Show/Hide secure password as plain text */
  btnShowHidePasswordPressed() {
    this.setState({ isShowPasswordAsText: !this.state.isShowPasswordAsText })
  }

  /* Navigating to create new account screen */
  btnSignUpPressed() {
    Keyboard.dismiss();
    Keyboard.dismiss();
    //this.props.navigation.push('SignUp');
    var strUrl = 'https://www.sherpadesk.com/free-trial'
    Linking.canOpenURL(strUrl).then(supported => {
      if (supported) {
        Linking.openURL(strUrl);
      } else {
        console.log("Don't know how to open URI: " + strUrl);
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
      this.setOrgAndNavigate(selected)
    }
    this.dismissPopup();
  }

  /* Saving selected org. and calling api to fetch config info */
  setOrgAndNavigate(selected) {
    this.setState({ selectedOrg: selected });
    this.props.org(selected)
    CommonFunctions.storeData(UserDataKeys.Org, JSON.stringify(selected))
    setTimeout(() => {
      /* Calling api to fetch config info based on selected org. */
      this.fetchConfig(this.state.apiToken, selected)
    }, 200)
  }

  //Class Methods

  /* Calling api to fetch config info and registering notification with azure notification hub */
  fetchConfig(user, org) {
    let authHeader = (ApiHelper.authenticationHeader(user, org))

    ApiHelper.get(ApiHelper.Apis.Config, this, authHeader).then((response) => {

      /* Saving user in redux store and local storage */
      this.props.configInfo(response);
      CommonFunctions.storeData(UserDataKeys.Config, JSON.stringify(response))

      var objUser = { ...user, ...response.user }
      // objUser.api_token = user.api_token
      this.props.userInfo(objUser);
      CommonFunctions.storeData(UserDataKeys.User, JSON.stringify(objUser))

      CommonFunctions.retrieveData(UserDataKeys.DeviceToken)
        .then((response) => {
          console.log('Saved Token====================================', response);
          console.log('objUser====================================', objUser);
          /* Calling func for register notification*/
          this.registerWithAzure(response, (objUser.login_id || ''))
        })
        .catch((err) => {
          notifiactionTokenManager.configure().then((token) => {
            console.log('Token:-- ====================================', token);
            console.log('objUser====================================', objUser);
            /* Calling func for register notification*/
            this.registerWithAzure(token, (objUser.login_id || ''))
          })
        })

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
      }, 300)
    })
      .catch((response) => {
        ApiHelper.handleErrorAlert(response)
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
    }
    catch (e) {
      console.log(`Registration failed: ${e}`);
    }
  }

  /* Checking validation and returns true/false */
  isValid() {
    this.setState({ isValidateRunTime: true })
    Keyboard.dismiss();
    if (ValidationHelper.isInvalidEmail(this.state.email, false)) {
      setTimeout(() => this.emailRef._root.focus(), 200)
      return false
    } else if (ValidationHelper.isInvalidPassword(this.state.password, false)) {
      setTimeout(() => this.passwordRef._root.focus(), 200)
      return false
    }
    return true
  }

    /* Calling api social sign in and setting dashboard stack as root view */
    socialSignIn(data) {
      // var params = data
      // params.device_token = this.props.deviceToken ?? ''

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
        // id: 1,
        username: email,
        password: 'Sya29In.1.AADtN_',
        provider: data.social_type,
      }

      ApiHelper.postWithParam(ApiHelper.Apis.SignIn, obj, this).then((response) => {
        /* Saving user in redux store and local storage */
        this.setState({ apiToken: response })
        this.props.authToken(response.api_token);
        CommonFunctions.storeData(UserDataKeys.AuthToken, JSON.stringify(response))
        this.fetchOrganizations(response.api_token)
      }).catch((response) => {
        if (response.status == 403) {
          // Toast.show({
          //   text: 'Invalid credentials, Please update the email or password and try again.',
          //   position: 'top',
          //   duration: 3000,
          //   // type: 'warning',
          //   style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
          // })
          CommonFunctions.presentAlertCustomNameWithActions('User account does not exist in SherpaDesk. Please create new SherpaDesk account for free!', 'Create', 'Login').then((isLogin) => {
            if (!isLogin) {
              setTimeout(() => {
                this.btnSignUpPressed();
              }, 100)
            } 
          })
        } else {
          ApiHelper.handleErrorAlert(response)
        }
      });
    }


  /* Calling api to fethc organizations */
  fetchOrganizations(token) {
    let encryptedAuthHeader = new Buffer(`x:${token}`).toString("base64");
    ApiHelper.get(ApiHelper.Apis.Organizations, this, encryptedAuthHeader).then((response) => {
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
      if (arrOrgs.length > 1) {
        // setTimeout(() => {
        this.setState({ orgDataSource: arrOrgs, showOrgPopup: true, loading: false })
        // }, 200)
      } else {
        /* Calling func for save selected org. and fetch config info */
        this.setOrgAndNavigate(response[0])
      }
    }).catch((response) => {
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
    });
  }

  /* Rendering popup screen */
  renderDropDownOptions() {
    if (this.state.showOrgPopup) {
      return (
        <OrgOptions isShowAsModal={false} canDismiss={false} dataSource={this.state.orgDataSource} dismissPopup={() => this.dismissPopup()} selected={this.state.selectedOrg} selectionDidChange={(selected) => { this.selectionDidChange('Org', selected); }} />
      )
    } else {
      return null
    }
  }

  /* What to display on the screen */
  render() {
    return (
      <Container>
        {Platform.OS === 'ios' ? null : StatusBar.setBarStyle('dark-content', true)}
        {Platform.OS === 'ios' ? null : StatusBar.setBackgroundColor(Colors.snow)}
        <Loader show={this.state.loading} />
        <ScrollView keyboardShouldPersistTaps='handled' style={styles.container}>
          <View style={styles.logoMainContainer}>
            <View style={styles.emptyTopDivider} />
            <Animatable.View animation={'pulse'} delay={100} style={styles.logoContainer}>
              <Label style={styles.welcomeTitle}>Welcome!</Label>
              <Image style={styles.logo} source={Images.logo} />
            </Animatable.View>
            <View style={styles.socialSignInContainer}>
              <Animatable.View animation={'flipInX'} duration={500} style={styles.socialSignInButtonsContainer}>
              {this.state.showAppleSignIn ?
                  <Button transparent onPress={() => this.signInWithApplePressed()}>
                    <Image style={styles.socialIcon} source={Images.apple} />
                  </Button>
                  : null}
                {/* { appleAuthAndroid &&  Platform.OS == 'android' ?
                   <Button transparent onPress={() => this.signInWithAppleAndroidPressed()}>
                      <Image style={styles.socialIcon} source={Images.apple} />
                   </Button> 
                  : null } */}
                {/* {this.state.showAppleSignIn ?
                  <AppleButton
                    buttonStyle={AppleButton.Style.BLACK}
                    buttonType={AppleButton.Type.SIGN_IN}
                    style={{
                      // marginTop: Metrics.doubleBaseMargin,
                      height: 50,
                    }}
                    onPress={() => { this.signInWithApplePressed() }}
                  />
                  : null} */}
                <Button transparent onPress={() => this.signInWithGooglePressed()}>
                  <Image style={styles.socialIcon} source={Images.google} />
                </Button>
                {/* <Button transparent onPress={() => this.signInWithFrontDeskPressed()}>
                  <Image style={styles.socialIcon} source={Images.frontdesk} />
                </Button>
                <Button transparent onPress={() => this.signInWithIntuitPressed()}>
                  <Image style={styles.socialIcon} source={Images.intuit} />
                </Button> */}
              </Animatable.View>
              <Animatable.View animation={'fadeIn'} style={styles.loginSpratorContainer}>
                <View style={styles.sprator} />
                <Label style={styles.spratorTitle}>OR LOGIN WITH EMAIL</Label>
                <View style={styles.sprator} />
              {/* </Animatable.View> */}

              </Animatable.View>
              <Animatable.View animation={'fadeIn'} style={styles.loginSpratorContainer}>
              </Animatable.View>
            </View>
          </View>
          <Animatable.View animation={'fadeInUpBig'} >
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={
                [Colors.mainPrimary,
                Colors.secondary]}
              style={styles.loginMainContainer}>
              <View style={styles.loginItemsContainer}>
                <View>
                  <Label style={styles.inputTitle}>Email</Label>
                  <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={Images.email} />
                    <Input
                      style={[styles.input, (ValidationHelper.isInvalidEmail(this.state.email, false) && this.state.isValidateRunTime) ? styles.textErrorColor : styles.textColor]}
                      placeholder='Email'
                      placeholderTextColor={(ValidationHelper.isInvalidEmail(this.state.email, false) && this.state.isValidateRunTime) ? Colors.placeholderError : Colors.placeholder}
                      keyboardType='email-address'
                      autoCapitalize='none'
                      selectionColor={Colors.mainPrimary}
                      value={this.state.email}
                      onChangeText={value => this.setState({ email: value.trim() })}
                      blurOnSubmit={false}
                      keyboardAppearance='dark'
                      returnKeyType={"next"}
                      ref={input => {
                        this.emailRef = input;
                      }}
                      onSubmitEditing={() => {
                        this.passwordRef._root.focus();
                      }}
                    />
                  </View>
                </View>
                <View>
                  <Label style={styles.inputTitle}>Password</Label>
                  <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={Images.lock} />
                    <Input
                      style={[styles.input, (ValidationHelper.isInvalidPassword(this.state.password, false) && this.state.isValidateRunTime) ? styles.textErrorColor : styles.textColor]}
                      secureTextEntry={!this.state.isShowPasswordAsText}
                      placeholder='Password'
                      placeholderTextColor={(ValidationHelper.isInvalidPassword(this.state.password, false) && this.state.isValidateRunTime) ? Colors.placeholderError : Colors.placeholder}
                      value={this.state.password}
                      selectionColor={Colors.mainPrimary}
                      onChangeText={value => this.setState({ password: value })}
                      onSubmitEditing={() => { this.btnSignInPressed(); }}
                      blurOnSubmit={false}
                      keyboardAppearance='dark'
                      returnKeyType={"go"}
                      ref={input => {
                        this.passwordRef = input;
                      }}
                    />
                    <Button transparent onPress={() => { this.btnShowHidePasswordPressed(); }}>
                      <Image style={styles.inputIcon} source={this.state.isShowPasswordAsText ? Images.openeye : Images.closeeye} />
                    </Button>
                  </View>
                  <TouchableOpacity activeOpacity={0.7} style={styles.forgotPasswordContainer} underlayColor={Colors.clear} onPress={() => { this.btnForgotPressed(); }}>
                    <Label style={styles.forgotPasswordTitle}>Forgot Password?</Label>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7} style={styles.loginButtonContainer} onPress={() => { this.btnSignInPressed(); }}>
                    <Text style={styles.loginButtonText}>Login</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7} style={styles.createAccountContainer} underlayColor={Colors.clear} onPress={() => { this.btnSignUpPressed(); }}>
                    <Label style={styles.dontHaveAccountTitle}>Don’t have an account? <Label style={styles.createAccountTitle}>Create Account</Label></Label>
                  </TouchableOpacity>

                  <Label style={styles.appVersion}>App version: {Platform.OS === 'ios' ? '1.3.9' : '1.3.9'} Last Update: May 2023</Label>
                 
                </View>
              </View>
            </LinearGradient>
          </Animatable.View>
        </ScrollView>
        {this.renderDropDownOptions()}
      </Container>
    )
  }
}

/* Subscribing to redux store for updates */
const mapStateToProps = (state) => {
  const { authToken } = state.authToken
  const { deviceToken } = state.deviceToken
  return { authToken, deviceToken }
};

/* Connecting to redux store and exporting class */
export default connect(mapStateToProps, {
  authToken,
  org,
  userInfo,
  resetAuthTokenValueToDefault,
  resetConfigInfo,
  resetDeviceTokenValueToDefault,
  resetOrgValueToDefault,
  resetInfo,
  configInfo
})(SignIn);