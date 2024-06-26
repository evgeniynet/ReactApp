/* Imports */
import React, { Component } from 'react'
import { ScrollView, View, TouchableOpacity, Platform, StatusBar, SafeAreaView, Text, Keyboard } from 'react-native'
import { Container, Label, Input, Toast } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';

import ValidationHelper from '../../../Components/ValidationHelper';
import CommonFunctions from '../../../Components/CommonFunctions';
import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Colors, Metrics } from '../../../Themes';
import LinearGradient from 'react-native-linear-gradient';
import ApiHelper from '../../../Components/ApiHelper';
import Loader from '../../../Components/Loader';
import DropDownOptions from '../../../Components/DropDownOptions';
import { UserDataKeys } from '../../../Components/Constants';

// Styless
import styles from './Styles/AddTechnicianStyles'

class AddTechnician extends Component {

  // Life cycle of class
  /* Initiating state before the component mount. */
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      firstName: '',
      lastName: '',
      email: '',
      accountName: '',
      account: null,
      showAccountNamePopup: false,
      accountDataSource: [],
      title: '',
      technician: 'Technician',
      techTitle: 'Tech',
      user: 'User',
      screen: 'AddEditToDo',
      isUser: false,
    };
  }

  componentDidMount() {
    this.setState({
      loading: false,
      firstName: '',
      lastName: '',
      email: '',
      accountName: '',
      account: null,
      showAccountNamePopup: false,
      accountDataSource: [],
      title: '',
      technician: 'Technician',
      techTitle: 'Tech',
      user: 'User',
      screen: 'AddEditToDo',
      isUser: false,
    });

    CommonFunctions.retrieveData(UserDataKeys.Config)
      .then((response) => {
        let config = JSON.parse(response)
        var title = 'Technicians'
        var techTitle = 'Tech'
        var technician = 'Technician'
        if (config.is_customnames) {
          title = config.names.tech.p ?? 'Technicians'
          technician = config.names.tech.s ?? 'Technician'
          user = config.names.user.a ?? 'User'
          techTitle = config.names.tech.a ?? 'Tech'
        }
        this.setState({ title: title, technician: technician, techTitle: techTitle, user })
        // Call Apis
      }).catch(() => {
        this.setState({ title: 'Technicians' })
      })

    if (this.props.navigation.state.params !== undefined) {
      if (this.props.navigation.state.params.screen !== undefined) {
        this.setState({ screen: this.props.navigation.state.params.screen })
      }

      if (this.props.navigation.state.params.isUser !== undefined) {
        this.setState({ isUser: this.props.navigation.state.params.isUser })
      }
    }

    this.viewWillAppear()
    this.props.navigation.addListener('didFocus', this.viewWillAppear)
    // this.fetchAccounts(false)
  }

  viewWillAppear = () => {

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

      let obj = {
        firstname: this.state.firstName,
        lastname: this.state.lastName,
        email: this.state.email,
      }
      console.log(obj)

      ApiHelper.postWithParam(ApiHelper.Apis.Users, obj, this)
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
          } else {
            ApiHelper.handleErrorAlert(response)
          }
        });
    }
  }

  //Class Methods

  /* Calling api to fetch accounts and display in seletion popup */
  fetchAccounts(isShowPopup = false) {
    if (this.state.accountDataSource.length > 0 && isShowPopup) {
      this.setState({ showAccountNamePopup: true })
    } else {
      let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
      let objData = { is_with_statistics: true }
      ApiHelper.getWithParam(ApiHelper.Apis.Accounts, objData, this, isShowPopup, authHeader).then((response) => {
        var arrAccounts = []
        for (const key in response) {
          if (Object.hasOwnProperty.call(response, key)) {
            const account = response[key];
            var aObj = { value: account.name }
            aObj.data = account
            arrAccounts.push(aObj)
          }
        }
        this.setState({ accountDataSource: arrAccounts })
        if (isShowPopup) {
          this.setState({ showAccountNamePopup: true })
        }
      })
        .catch((response) => {
          console.log('Error ====================================');
          console.log(response);
          console.log('====================================');
          if (isShowPopup) {
            ApiHelper.handleErrorAlert(response)
          }
        })
    }
  }

  /* Calling api to add new user */
  addNewUser() {
    if (this.isValid()) {
      let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
      var obj = {
        'email': this.state.email,
        'Firstname': this.state.firstName,
        'Lastname': this.state.lastName,
      }
      ApiHelper.postWithParam(ApiHelper.Apis.Users, obj, this, true, authHeader).then((response) => {
        if (response) {
          var obj = response
          obj.value_title = obj.firstname + ' ' + obj.lastname + (obj.type == 'queue' ? '' : ` (${obj.email})`)
          Toast.show({
            text: `${this.state.isUser ? this.state.user : this.state.technician} has been added successfully.`,
            position: 'top',
            duration: 3000,
            type: 'success',
            style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
          })
          if (this.state.isUser) {
            this.props.navigation.navigate(this.state.screen, { userSelected: obj });
          } else {
            this.props.navigation.navigate(this.state.screen, { techSelected: obj });
          }
        }
      })
        .catch((response) => {
          ApiHelper.handleErrorAlert(response)
        })
    }
  }
  /* Checking validation and returns true/false */
  isValid() {
    this.setState({ isValidateRunTime: true })
    if (ValidationHelper.isInvalidEmail(this.state.email, false)) {
      setTimeout(() => this.emailRef._root.focus(), 200)
      return false
    } else if (ValidationHelper.isInvalidText(this.state.firstName, 1)) {
      setTimeout(() => this.firstNameRef._root.focus(), 200)
      return false
    } else if (ValidationHelper.isInvalidText(this.state.lastName, 1)) {
      setTimeout(() => this.lastNameRef._root.focus(), 200)
      return false
    }
    return true
  }

  /* Hidding(Dismissing) popup screen */
  dismissPopup(option) {
    this.setState({ showAccountNamePopup: false })
  }

  /* Setting state on drop down selection change */
  selectionDidChange(dropDownName, selected, selectedData) {
    if (dropDownName === 'Account') {
      console.log('account====================================');
      console.log(selectedData);
      console.log('====================================');
      this.setState({ accountName: selected, account: selectedData });
    }
    this.dismissPopup();
  }

  /* Rendering popup screen */
  renderDropDownOptions() {
    if (this.state.showAccountNamePopup) {
      return (
        <DropDownOptions dataSource={this.state.accountDataSource} dismissPopup={() => this.dismissPopup()} selected={this.state.accountName} selectionDidChange={(selected, selectedData) => { this.selectionDidChange('Account', selected, selectedData); }} />
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
            showTitle={`Add ${this.state.isUser ? this.state.user : this.state.technician}`}
          />
        </SafeAreaView>
        {this.renderDropDownOptions()}
        <View style={styles.contentContainer}>
          <ScrollView keyboardShouldPersistTaps='handled'>
            <SafeAreaView style={styles.mainContainer}>
              <View style={[styles.mainContainer, { paddingTop: 30, paddingBottom: 30 }]}>
                <View>
                  <Label style={[styles.inputTitle, (ValidationHelper.isInvalidEmail(this.state.email, false) && this.state.isValidateRunTime) ? styles.textErrorColor : styles.placeholderColor]}>Email</Label>
                  <View style={[styles.inputContainer, this.state.currentEditingField == 'email' ? styles.inputActive : styles.inputInactive]}>
                    <Input
                      style={styles.input}
                      placeholder='abc@xyz.com'
                      placeholderTextColor={Colors.placeholder}
                      selectionColor={Colors.mainPrimary}
                      value={this.state.email}
                      onChangeText={value => this.setState({ email: value })}
                      blurOnSubmit={false}
                      keyboardAppearance='dark'
                      autoCapitalize='none'
                      returnKeyType={"next"}
                      keyboardType={'email-address'}
                      onFocus={value => {
                        this.setState({ currentEditingField: 'email' })
                      }}
                      onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                      ref={input => {
                        this.emailRef = input;
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
                        Keyboard.dismiss();
                        this.addNewUser()
                      }}
                    />
                  </View>
                </View>
                <TouchableOpacity activeOpacity={0.7} style={styles.loginButtonContainer} onPress={() => { this.addNewUser(); }}>
                  <Text style={styles.loginButtonText}>{`Add New ${this.state.isUser ? this.state.user : this.state.technician}`}</Text>
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
export default connect(mapStateToProps)(AddTechnician);