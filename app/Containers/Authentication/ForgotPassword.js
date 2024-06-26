/* Imports */
import React, { Component } from 'react'
import { ScrollView, Image, View, Keyboard, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native'
import { Container, Input, Text, Label } from 'native-base';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

import styles from './Styles/ForgotPasswordStyles'
import { Images, Colors, Metrics } from '../../Themes'
import { deviceToken } from '../../Redux/Actions';
import ValidationHelper from '../../Components/ValidationHelper';
import { NavigationBar } from '../../Navigation/NavigationBar';
import CommonFunctions from '../../Components/CommonFunctions';

class ForgotPassword extends Component {

  // Life cycle of class
  /* Initiating state before the component mount. */
  constructor(props) {
    super(props)
    this.state = { loading: false, email: '', isValidateRunTime: false };
  }

  componentDidMount() {
    const email = this.props.navigation.state.params.email
    this.setState({
      loading: false,
      email: ((email.trim()) != '') ? email : '',
      isValidateRunTime: false,
    });
    // setTimeout(() => this.emailRef._root.focus(), 400)
  }

  componentWillUnmount() {
    Keyboard.dismiss();
  }

  //Actions

  /* Validating information and calling sign in api */
  btnResetPressedPressed() {
    /* Checking validation if it's valid calling API*/
    if (this.isValid()) {
      Keyboard.dismiss();
      //   let obj = {
      //     email: this.state.email,
      //     device_token: this.props.deviceToken ?? ''
      //   }

      // ApiHelper.postWithParam(ApiHelper.Apis.ForgotPassword, obj, this)
      //     .then((response) => {
      //'A new password has been sent to your email address.'
      setTimeout(() => {
        // CommonFunctions.presentAlertWithOkAction(response.message)
        CommonFunctions.presentAlertWithOkAction('Your new password has been sent to your email address.')
          .then((respose) => {
            /* Returns to previous screen */
            setTimeout(() => this.props.navigation.goBack(), 200)
          })
      }, 100)
      //     })
    }
  }

  /* Navigating to create new account screen */
  btnSignInPressed() {
    Keyboard.dismiss();
    this.props.navigation.goBack();
  }

  //Class Methods

  /* Checking validation and returns true/false */
  isValid() {
    this.setState({ isValidateRunTime: true })
    Keyboard.dismiss();
    if (ValidationHelper.isInvalidEmail(this.state.email, false)) {
      setTimeout(() => this.emailRef._root.focus(), 200)
      return false
    }
    return true
  }

  /* What to display on the screen */
  render() {
    return (
      <Container>
        {Platform.OS === 'ios' ? null : StatusBar.setBarStyle('dark-content', true)}
        {Platform.OS === 'ios' ? null : StatusBar.setBackgroundColor(Colors.snow)}
        <SafeAreaView>
          {this.state.currentView != 'SignIn' ?
            <NavigationBar
              navigation={this.props.navigation}
              showTitle={'Forgot Password'}
              leftButton={() => {
                this.setState({ currentView: 'SignIn' })
              }}
            />
            : null}
        </SafeAreaView>
        <View pointerEvents='none' style={[styles.logoMainContainer, styles.container]}>
          <Animatable.View animation={'pulse'} delay={100} style={styles.logoContainer}>
            {/* <Label style={styles.welcomeTitle}>Welcome!</Label> */}
            <Image style={styles.logo} source={Images.forgotPassword} />
          </Animatable.View>
        </View>
        <ScrollView keyboardShouldPersistTaps='handled'>
          <View style={{ flex: 1, height: Metrics.screenHeight - Metrics.navBarHeight }}>
            <View pointerEvents='none' style={styles.logoMainContainer} />
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
                        returnKeyType={"go"}
                        ref={input => {
                          this.emailRef = input;
                        }}
                        onSubmitEditing={() => {
                          this.btnResetPressedPressed();
                        }}
                      />
                    </View>
                  </View>
                  <View>
                    <TouchableOpacity activeOpacity={0.7} style={styles.resetButtonContainer} onPress={() => { this.btnResetPressedPressed(); }}>
                      <Text style={styles.resetButtonText}>Reset Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} style={styles.loginAccountContainer} activeOpacity={1} underlayColor={Colors.clear} onPress={() => { this.btnSignInPressed(); }}>
                      <Label style={styles.iHaveAccountTitle}>Remember password ? <Label style={styles.loginTitle}>Login</Label></Label>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </Animatable.View>
          </View>
        </ScrollView>
      </Container>
    )
  }
}

/* Subscribing to redux store for updates */
const mapStateToProps = (state) => {
  const { deviceToken } = state.deviceToken
  return { deviceToken }
};

/* Connecting to redux store and exporting class */
export default connect(mapStateToProps, { deviceToken })(ForgotPassword);