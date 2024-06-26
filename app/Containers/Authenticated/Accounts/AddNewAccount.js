/* Imports */
import React, { Component } from 'react'
import { ScrollView, Image, View, TouchableOpacity, Platform, StatusBar, SafeAreaView, Text, Keyboard } from 'react-native'
import { Container, Label, Input, CardItem, Toast } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';

import ValidationHelper from '../../../Components/ValidationHelper';
import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Images, Colors } from '../../../Themes';
import LinearGradient from 'react-native-linear-gradient';
import DropDownOptions from '../../../Components/DropDownOptions';
import ApiHelper from '../../../Components/ApiHelper';

// Styless
import styles from './Styles/AddNewAccountStyles'

class AddNewAccount extends Component {

  // Life cycle of class
  /* Initiating state before the component mount. */
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      firstName: '',
      lastName: '',
      accountContactEmailAddress: '',
      accountType: 'Customer',
      accountOrgName: '',
      emailSuffixes: '',
      isInviteContactToCreateTheirOwnSherpaDeskInstance: false,
      accountTypeDataSource: [{
        value: 'Customer',
      }, {
        value: 'Individual Customer',
      }, {
        value: 'Service Provider/Vendor',
      }, {
        value: 'Customer + Service Provider/Vendor',
      }],
      showAccountTypePopup: false,
    };
  }

  componentDidMount() {
    this.setState({
      loading: false,
      firstName: '',
      lastName: '',
      accountContactEmailAddress: '',
      accountType: 'Customer',
      accountOrgName: '',
      emailSuffixes: '',
      isInviteContactToCreateTheirOwnSherpaDeskInstance: false,
      showAccountTypePopup: false,
    });
    this.viewWillAppear()
    this.props.navigation.addListener('didFocus', this.viewWillAppear)
  }

  viewWillAppear = async () => {

  }

  componentWillUnmount() {
    Keyboard.dismiss();
  }

  //Actions

  /* Validating information and calling sign in api */
  btnAddTechPressed() {
    /* Checking validation if it's valid calling API*/
    if (this.isValid()) {
      Keyboard.dismiss();
      // let obj = {
      //   email: this.state.email,
      //   password: this.state.password,
      //   device_token: this.props.deviceToken ?? ''
      // }
      let obj = {
        name: this.state.accountOrgName,
        firstname: this.state.firstName,
        lastname: this.state.lastName,
        email: this.state.accountContactEmailAddress,
        email_suffixes: this.state.emailSuffixes
      }

      console.log(obj)
      return
      ApiHelper.postWithParam(ApiHelper.Apis.Accounts, obj, this)
        .then((response) => {
          this.props.navigation.goBack();
        }).catch((response) => {
          if (response.status == 403) {
            Toast.show({
              text: response.data,
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

  /* Hidding(Dismissing) popup screen */
  dismissPopup(option) {
    this.setState({ showAccountTypePopup: false })
  }

  /* Setting state on drop down selection change */
  selectionDidChange(dropDownName, selected) {
    if (dropDownName === 'AccountType') {
      if (selected == 'Individual Customer') {
        this.setState({ accountType: selected, isInviteContactToCreateTheirOwnSherpaDeskInstance: true });
      } else {
        this.setState({ accountType: selected });
      }
    }
    this.dismissPopup();
  }

  //Class Methods

  /* Checking validation and returns true/false */
  isValid() {
    this.setState({ isValidateRunTime: true })
    if (ValidationHelper.isInvalidText(this.state.accountType, 1)) {
      setTimeout(() => this.setState({ showAccountTypePopup: true }), 200)
      return false
    }
    if (this.state.accountType != 'Individual Customer') {
      if (ValidationHelper.isInvalidText(this.state.accountOrgName, 1)) {
        setTimeout(() => this.accountOrgNameRef._root.focus(), 200)
        return false
      } else if (ValidationHelper.isInvalidText(this.state.emailSuffixes, 1)) {
        setTimeout(() => this.emailSuffixesRef._root.focus(), 200)
        return false
      }
    } else if (this.state.isInviteContactToCreateTheirOwnSherpaDeskInstance) {
      if (ValidationHelper.isInvalidEmail(this.state.accountContactEmailAddress, false)) {
        setTimeout(() => this.accountContactEmailAddressRef._root.focus(), 200)
        return false
      } else if (ValidationHelper.isInvalidText(this.state.firstName, 1)) {
        setTimeout(() => this.firstNameRef._root.focus(), 200)
        return false
      } else if (ValidationHelper.isInvalidText(this.state.lastName, 1)) {
        setTimeout(() => this.lastNameRef._root.focus(), 200)
        return false
      }
    }
    return true
  }

  /* Rendering popup screen */
  renderDropDownOptions() {
    if (this.state.showAccountTypePopup) {
      return (
        <DropDownOptions dataSource={this.state.accountTypeDataSource} dismissPopup={() => this.dismissPopup()} selected={this.state.accountType} selectionDidChange={(selected) => { this.selectionDidChange('AccountType', selected); }} />
      )
    } else {
      return null
    }
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
            showTitle='Add New Account'
          />
        </SafeAreaView>
        {this.renderDropDownOptions()}
        <View style={styles.contentContainer}>
          <ScrollView keyboardShouldPersistTaps='handled'>
            <SafeAreaView style={styles.mainContainer}>
              <View style={[styles.mainContainer, { paddingTop: 30, paddingBottom: 30 }]}>
                <View>
                  <Label style={[styles.inputTitle, (ValidationHelper.isInvalidText(this.state.accountType, 1) && this.state.isValidateRunTime) ? styles.textErrorColor : styles.placeholderColor]}>Account Type</Label>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.inputContainer, this.state.currentEditingField == 'accountType' ? styles.inputActive : styles.inputInactive]}
                    onPress={() => { this.setState({ showAccountTypePopup: true }) }}>
                    <Input
                      pointerEvents={'none'}
                      editable={false}
                      style={styles.input}
                      placeholder='Customer'
                      placeholderTextColor={Colors.placeholder}
                      autoCapitalize='words'
                      selectionColor={Colors.mainPrimary}
                      value={this.state.accountType}
                      onChangeText={value => this.setState({ accountType: value })}
                      blurOnSubmit={false}
                      keyboardAppearance='dark'
                      returnKeyType={"next"}
                      onFocus={value => {
                        this.setState({ currentEditingField: 'accountType' })
                      }}
                      onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                      ref={input => {
                        this.accountTypeRef = input;
                      }}
                      onSubmitEditing={() => {
                        this.accountOrgNameRef._root.focus();
                      }}
                    />
                  </TouchableOpacity>
                </View>
                {this.state.accountType != 'Individual Customer' ?
                  <View>
                    <View>
                      <Label style={[styles.inputTitle, (ValidationHelper.isInvalidText(this.state.accountOrgName, 1) && this.state.isValidateRunTime) ? styles.textErrorColor : styles.placeholderColor]}>Account / Org Name</Label>
                      <View style={[styles.inputContainer, this.state.currentEditingField == 'accountOrgName' ? styles.inputActive : styles.inputInactive]}>
                        <Input
                          style={styles.input}
                          placeholder='Organization'
                          placeholderTextColor={Colors.placeholder}
                          autoCapitalize='words'
                          selectionColor={Colors.mainPrimary}
                          value={this.state.accountOrgName}
                          onChangeText={value => this.setState({ accountOrgName: value })}
                          blurOnSubmit={false}
                          keyboardAppearance='dark'
                          returnKeyType={"next"}
                          onFocus={value => {
                            this.setState({ currentEditingField: 'accountOrgName' })
                          }}
                          onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                          ref={input => {
                            this.accountOrgNameRef = input;
                          }}
                          onSubmitEditing={() => {
                            this.emailSuffixesRef._root.focus();
                          }}
                        />
                      </View>
                    </View>
                    <View>
                      <Label style={[styles.inputTitle, (ValidationHelper.isInvalidText(this.state.emailSuffixes, 1) && this.state.isValidateRunTime) ? styles.textErrorColor : styles.placeholderColor]}>Email Suffixes</Label>
                      <View style={[styles.inputContainer, this.state.currentEditingField == 'emailSuffixes' ? styles.inputActive : styles.inputInactive]}>
                        <Input
                          style={styles.input}
                          placeholder='Organization'
                          placeholderTextColor={Colors.placeholder}
                          autoCapitalize='words'
                          selectionColor={Colors.mainPrimary}
                          value={this.state.emailSuffixes}
                          onChangeText={value => this.setState({ emailSuffixes: value })}
                          blurOnSubmit={false}
                          keyboardAppearance='dark'
                          returnKeyType={this.state.isInviteContactToCreateTheirOwnSherpaDeskInstance ? "next" : "go"}
                          onFocus={value => {
                            this.setState({ currentEditingField: 'emailSuffixes' })
                          }}
                          onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                          ref={input => {
                            this.emailSuffixesRef = input;
                          }}
                          onSubmitEditing={() => {
                            if (this.state.isInviteContactToCreateTheirOwnSherpaDeskInstance) {
                              this.accountContactEmailAddressRef._root.focus();
                            } else {
                              this.btnAddTechPressed();
                            }
                          }}
                        />
                      </View>
                    </View>
                  </View> : null}
                <View>
                  <CardItem style={[styles.inputContainer, { height: null }]}>
                    <Label style={styles.switchTitle}>Invite contact to create their own SherpaDesk instance</Label>
                    <TouchableOpacity onPress={() => {
                      if (this.state.accountType != 'Individual Customer') {
                        this.setState({
                          isInviteContactToCreateTheirOwnSherpaDeskInstance: !this.state.isInviteContactToCreateTheirOwnSherpaDeskInstance
                        })
                      }
                    }}>
                      <Image style={styles.switchIcon} source={this.state.isInviteContactToCreateTheirOwnSherpaDeskInstance ? Images.toggleOn : Images.toggleOff} />
                    </TouchableOpacity>
                  </CardItem>
                </View>
                {this.state.isInviteContactToCreateTheirOwnSherpaDeskInstance ? <View>
                  <View>
                    <Label style={[styles.inputTitle, (ValidationHelper.isInvalidEmail(this.state.accountContactEmailAddress, false) && this.state.isValidateRunTime) ? styles.textErrorColor : styles.placeholderColor]}>{(this.state.accountType == 'Individual Customer') ? 'Customer\'s Email Address' : 'Account Contact\'s Email Address'}</Label>
                    <View style={[styles.inputContainer, this.state.currentEditingField == 'accountContactEmailAddress' ? styles.inputActive : styles.inputInactive]}>
                      <Input
                        style={styles.input}
                        placeholder='abc@xyz.com'
                        placeholderTextColor={Colors.placeholder}
                        selectionColor={Colors.mainPrimary}
                        value={this.state.accountContactEmailAddress}
                        onChangeText={value => this.setState({ accountContactEmailAddress: value })}
                        blurOnSubmit={false}
                        keyboardAppearance='dark'
                        autoCapitalize='none'
                        returnKeyType={"next"}
                        keyboardType={'email-address'}
                        onFocus={value => {
                          this.setState({ currentEditingField: 'accountContactEmailAddress' })
                        }}
                        onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                        ref={input => {
                          this.accountContactEmailAddressRef = input;
                        }}
                        onSubmitEditing={() => {
                          this.firstNameRef._root.focus();
                        }}
                      />
                    </View>
                  </View>
                  <View>
                    <Label style={[styles.inputTitle, (ValidationHelper.isInvalidText(this.state.firstName, 1) && this.state.isValidateRunTime) ? styles.textErrorColor : styles.placeholderColor]}>First Name</Label>
                    <View style={[styles.inputContainer, this.state.currentEditingField == 'firstName' ? styles.inputActive : styles.inputInactive]}>
                      <Input
                        style={styles.input}
                        placeholder='John'
                        placeholderTextColor={Colors.placeholder}
                        autoCapitalize='words'
                        selectionColor={Colors.mainPrimary}
                        value={this.state.firstName}
                        onChangeText={value => this.setState({ firstName: value })}
                        blurOnSubmit={false}
                        keyboardAppearance='dark'
                        returnKeyType={"next"}
                        onFocus={value => {
                          this.setState({ currentEditingField: 'firstName' })
                        }}
                        onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                        ref={input => {
                          this.firstNameRef = input;
                        }}
                        onSubmitEditing={() => {
                          this.lastNameRef._root.focus();
                        }}
                      />
                    </View>
                  </View>
                  <View>
                    <Label style={[styles.inputTitle, (ValidationHelper.isInvalidText(this.state.lastName, 1) && this.state.isValidateRunTime) ? styles.textErrorColor : styles.placeholderColor]}>Last Name</Label>
                    <View style={[styles.inputContainer, this.state.currentEditingField == 'lastName' ? styles.inputActive : styles.inputInactive]}>
                      <Input
                        style={styles.input}
                        placeholder='Doe'
                        placeholderTextColor={Colors.placeholder}
                        autoCapitalize='words'
                        selectionColor={Colors.mainPrimary}
                        value={this.state.lastName}
                        onChangeText={value => this.setState({ lastName: value })}
                        blurOnSubmit={false}
                        keyboardAppearance='dark'
                        returnKeyType={"go"}
                        onFocus={value => {
                          this.setState({ currentEditingField: 'lastName' })
                        }}
                        onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                        ref={input => {
                          this.lastNameRef = input;
                        }}
                        onSubmitEditing={() => {
                          this.btnAddTechPressed();
                        }}
                      />
                    </View>
                  </View>
                </View> : null}
                <TouchableOpacity activeOpacity={0.7} style={styles.loginButtonContainer} onPress={() => { this.btnAddTechPressed(); }}>
                  <Text style={styles.loginButtonText}>Create Account & Continue</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </ScrollView>
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
export default connect(mapStateToProps)(AddNewAccount);