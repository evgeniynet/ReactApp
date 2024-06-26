/* Imports */
import React, { Component } from 'react'
import { Image, View, TouchableOpacity, Platform, StatusBar, SafeAreaView, Text, Keyboard, FlatList } from 'react-native'
import { Container, Label, Input, CardItem, Toast, Textarea } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';

import ValidationHelper from '../../../Components/ValidationHelper';
import CommonFunctions from '../../../Components/CommonFunctions';
import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Images, Colors, Metrics } from '../../../Themes';
import LinearGradient from 'react-native-linear-gradient';
import DropDownOptions from '../../../Components/DropDownOptions';
import ApiHelper from '../../../Components/ApiHelper';
import Loader from '../../../Components/Loader';
import UsersSelection from './UsersSelection';
import { UserDataKeys } from '../../../Components/Constants';
import Selection from '../Selection';

// Styless
import styles from './Styles/CloseTicketStyles'

class CloseTicket extends Component {

  // Life cycle of class
  /* Initiating state before the component mount. */
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      class: '',
      cc: 'Choose End User',
      closingComments: '',
      classDataSource: [],
      userDataSource: [],
      selectedUsersDataSource: [],
      showUsersPopup: false,
      showClassesPopup: false,
      classData: null,
      objTicket: null,
      ticketTitle: 'Ticket',
      creationCategorySelected: null,
      showCreationCategoryPopup: false,
      creationCategoryDataSource: false,
    };
  }

  componentDidMount() {
    this.setState({
      loading: false,
      class: '',
      cc: 'Choose End User',
      closingComments: '',
      classDataSource: [],
      userDataSource: [],
      showUsersPopup: false,
      showClassesPopup: false,
      classData: null,
      objTicket: null,
      selectedUsersDataSource: [],
      ticketTitle: 'Ticket',
    });

    CommonFunctions.retrieveData(UserDataKeys.Config)
      .then((response) => {
        let config = JSON.parse(response)
        var ticketTitle = 'Ticket'
        var cc = 'Choose End User'
        if (config.is_customnames) {
          ticketTitle = config.names.ticket.s ?? 'Ticket'
          cc = `Choose ${config.names.user.s ?? 'End User'}`
        }
        this.setState({ ticketTitle: ticketTitle, cc: cc })
        // Call Apis
      })

    if (this.props.navigation.state.params !== undefined) {
      if (this.props.navigation.state.params.ticket !== undefined) {
        this.setState({ objTicket: this.props.navigation.state.params.ticket })
        setTimeout(() => {
          this.fetchUsers()
        }, 100)
      }
    }
  }

  componentWillUnmount() {
    Keyboard.dismiss();
  }

  //Actions

  /* Hidding(Dismissing) popup screen */
  dismissPopup(option) {
    this.setState({
      showClassesPopup: false,
      showUsersPopup: false,
      showCreationCategoryPopup: false,
    })
  }

  /* Setting state on drop down selection change */
  selectionDidChange(dropDownName, selected, selectedData) {
    if (dropDownName === 'Class') {
      this.setState({ class: selected, classData: selectedData });
    } else if (dropDownName === 'Users') {
      this.setState({ selectedUsersDataSource: selectedData });
    } else if (dropDownName === 'CreationCategory') {
      this.setState({
        creationCategorySelected: selectedData,
      });
    }
    this.dismissPopup();
  }

  /* Validating information and calling sign in api */
  btnCloseTicketPressed() {
    /* Checking validation if it's valid calling API*/
    if (this.isValid()) {
      Keyboard.dismiss();
      let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
      var arrUserEmails = []
      this.state.selectedUsersDataSource.forEach(element => {
        if (element.email) {
          arrUserEmails.push(element.email)
        }
      });
      let classId = ''
      var objData = {
        status: 'closed',
        note_text: this.state.closingComments.trim(),
        is_send_notifications: this.state.objTicket.is_send_notifications ?? true,
        resolved: true,//this.state.objTicket.resolved,
        class_id: this.state.classData ? this.state.classData.id : this.state.objTicket.class_id,
        confirmed: this.state.objTicket.confirmed ?? true,
        confirm_note: `Confirmed by ${this.props.user ? (this.props.user.firstname + ' ' + this.props.user.lastname) : 'me'}`,
        cc: arrUserEmails.join(', '),
      }

      if (this.state.creationCategorySelected && this.state.creationCategorySelected.id != null && this.state.creationCategorySelected.id != undefined) {
        objData.creation_category_id = this.state.creationCategorySelected.id
        objData.creation_category_name = this.state.creationCategorySelected.name
      }

      ApiHelper.putWithParam(ApiHelper.Apis.Tickets + `/${this.state.objTicket.key}`, objData, this, true, authHeader).then((response) => {
        Toast.show({
          text: `${this.state.ticketTitle} has been closed #${this.state.objTicket.number}`,
          position: 'top',
          duration: 3000,
          type: 'success',
          style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
        })
        this.props.navigation.goBack();
      })
        .catch((response) => {
          ApiHelper.handleErrorAlert(response)
        })
    }
  }

  //Class Methods

  /* Calling api to fetch users and calling fetch classes */
  fetchUsers() {
    let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
    ApiHelper.get(ApiHelper.Apis.Users, this, authHeader).then((response) => {
      this.setState({ userDataSource: response })
      if (this.state.objTicket && (!this.state.objTicket.class_id || this.state.objTicket.class_id == undefined)) {
        this.fetchClasses(true)
      }
    })
      .catch((response) => {
        ApiHelper.handleErrorAlert(response)
      })
  }

  /* Calling api to fetch categories and diaplay in selecetion popup */
  fetchCategories(isShowPopup = false) {
    if (this.state.creationCategoryDataSource.length > 0 && isShowPopup) {
      this.setState({ showCreationCategoryPopup: true })
    } else {
      let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
      ApiHelper.getWithParam(ApiHelper.Apis.Categories, {}, this, true, authHeader).then((response) => {
        var arrTemp = []
        arrTemp.push({ value_title: 'Default', name: 'Default' })
        for (const key in response) {
          if (Object.hasOwnProperty.call(response, key)) {
            var obj = response[key];
            obj.value_title = obj.name
            arrTemp.push(obj)
          }
        }
        this.setState({ creationCategoryDataSource: arrTemp })
        if (isShowPopup) {
          this.setState({ showCreationCategoryPopup: true })
        }
      })
        .catch((response) => {
          ApiHelper.handleErrorAlert(response)
        })
    }
  }

  /* Calling api to fetch classes and diaplay in selecetion popup */
  fetchClasses(isShowLoader = false) {
    let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
    ApiHelper.get(ApiHelper.Apis.Classes, this, authHeader, isShowLoader).then((response) => {

      var arrClasses = []
      //let objTemp = { value: 'Default', data: null }
      //arrClasses.push(objTemp)
      response.forEach(element => {
        let objTemp = { value: element.name, data: element }
        arrClasses.push(objTemp)
      });

      this.setState({ classDataSource: arrClasses })
    })
      .catch((response) => {
        ApiHelper.handleErrorAlert(response)
      })
  }

  /* Checking validation and returns true/false */
  isValid() {
    if ((this.props.configInfo && this.props.configInfo.is_creation_categories && this.props.configInfo.is_creation_categories_required_on_creation) && (!this.state.creationCategorySelected || this.state.creationCategorySelected && !this.state.creationCategorySelected.id)) {
      setTimeout(() => this.fetchCategories(true), 200)
      return false
    } else if ((this.props.configInfo && this.props.configInfo.is_class_tracking) && (this.state.objTicket && (!this.state.objTicket.class_id || this.state.objTicket.class_id == undefined))) {
      if (this.state.classData == null) {
        setTimeout(() => this.setState({ showClassesPopup: true }), 200)
        return false
      }
    }
    return true
  }

  /* Rendering popup screen */
  renderDropDownOptions() {
    if (this.state.showClassesPopup) {
      return (
        <DropDownOptions name="Class" dataSource={this.state.classDataSource} dismissPopup={() => this.dismissPopup()} selected={this.state.class} selectionDidChange={(selected, data) => { this.selectionDidChange('Class', selected, data); }} />
      )
    } else if (this.state.showUsersPopup) {
      return (
        <UsersSelection dataSource={this.state.userDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.selectedUsersDataSource} selectionDidChange={(selected, data) => { this.selectionDidChange('Users', selected, data); }} />
      )
    } else if (this.state.showCreationCategoryPopup) {
      return (
        <Selection name="Creation Category" dataSource={this.state.creationCategoryDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.creationCategorySelected} selectionDidChange={(selected, data) => { this.selectionDidChange('CreationCategory', selected, data); }} />
      )
    } else {
      return null
    }
  }

  /* Rendering header view */
  renderHeader() {
    return (
      <View>
        {this.props.configInfo && this.props.configInfo.is_creation_categories ?
          <View>
            <Label style={[styles.inputTitle, styles.placeholderColor]}>Creation Category</Label>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.inputContainer, this.state.currentEditingField == 'creationCategory' ? styles.inputActive : styles.inputInactive]}
              onPress={() => {
                if (!this.state.isDisableFields) {
                  this.fetchCategories(true)
                }
              }}>
              <Input
                pointerEvents={'none'}
                editable={false}
                style={[styles.input, this.state.isDisableFields ? { color: Colors.textGray } : {}]}
                placeholder='Creation Category'
                placeholderTextColor={Colors.placeholder}
                autoCapitalize='words'
                selectionColor={Colors.mainPrimary}
                value={this.state.creationCategorySelected ? this.state.creationCategorySelected.name : ''}
                onChangeText={value => this.setState({ accountType: value })}
                blurOnSubmit={false}
                keyboardAppearance='dark'
                returnKeyType={"next"}
                onFocus={value => {
                  this.setState({ currentEditingField: 'creationCategory' })
                }}
                onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                ref={input => {
                  this.creationCategoryRef = input;
                }}
                onSubmitEditing={() => {
                  this.ticketRef._root.focus();
                }}
              />
              <Image style={styles.rightIcon} source={Images.downarrow} />
            </TouchableOpacity>
          </View>
          : null}
        {(this.props.configInfo && this.props.configInfo.is_class_tracking) && (this.state.objTicket && (!this.state.objTicket.class_id || this.state.objTicket.class_id == undefined)) ?
          <View>
            <Label style={[styles.inputTitle, (ValidationHelper.isInvalidText(this.state.class, 1) && this.state.isValidateRunTime) ? styles.textErrorColor : styles.placeholderColor]}>Class</Label>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.inputContainer, this.state.currentEditingField == 'class' ? styles.inputActive : styles.inputInactive]}
              onPress={() => { this.setState({ showClassesPopup: true }) }}>
              <Input
                pointerEvents={'none'}
                editable={false}
                style={styles.input}
                placeholder='Class'
                placeholderTextColor={Colors.placeholder}
                autoCapitalize='words'
                selectionColor={Colors.mainPrimary}
                value={this.state.class}
                onChangeText={value => this.setState({ class: value })}
                blurOnSubmit={false}
                keyboardAppearance='dark'
                returnKeyType={"next"}
                onFocus={value => {
                  this.setState({ currentEditingField: 'class' })
                }}
                onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                ref={input => {
                  this.classRef = input;
                }}
                onSubmitEditing={() => {
                  this.classRef._root.focus();
                }}
              />
              <Image style={styles.rightIcon} source={Images.downarrow} />
            </TouchableOpacity>
          </View>
          : null}
        <View>
          <View>
            <Label style={[styles.inputTitle, (ValidationHelper.isInvalidText(this.state.cc, 1) && this.state.isValidateRunTime) ? styles.textErrorColor : styles.placeholderColor]}>CC</Label>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.inputContainer, this.state.currentEditingField == 'cc' ? styles.inputActive : styles.inputInactive]}
              onPress={() => { this.setState({ showUsersPopup: true }) }}>
              <Input
                pointerEvents={'none'}
                editable={false}
                style={styles.input}
                placeholder='Choose End User'
                placeholderTextColor={Colors.placeholder}
                autoCapitalize='words'
                selectionColor={Colors.mainPrimary}
                value={this.state.cc}
                onChangeText={value => this.setState({ class: value })}
                blurOnSubmit={false}
                keyboardAppearance='dark'
                returnKeyType={"next"}
                onFocus={value => {
                  this.setState({ currentEditingField: 'cc' })
                }}
                onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                ref={input => {
                  this.ccRef = input;
                }}
                onSubmitEditing={() => {
                  this.closingCommentsRef._root.focus();
                }}
              />
              <Image style={styles.rightIcon} source={Images.downarrow} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  /* Rendering option  */
  renderRow(row, item, index) {
    return (
      <CardItem button style={styles.rowContainer} onPress={() => {
        var arrSelected = this.state.selectedUsersDataSource
        for (let index = 0; index < arrSelected.length; index++) {
          const element = arrSelected[index];
          if (element.id == row.item.id) {
            arrSelected.splice(index, 1)
          }
        }
        this.setState({ selectedUsersDataSource: arrSelected })
      }}>
        <Text uppercase={false} style={styles.titleText} >
          {row.item.firstname + ' ' + row.item.lastname}
        </Text>
        <Image style={styles.closeIcon} source={Images.close} />
      </CardItem>
    )
  }

  /* Rendering footer view with message composer view  */
  renderFooter() {
    return (
      <View>
        <View style={{ marginTop: this.state.selectedUsersDataSource.length > 0 ? Metrics.doubleBaseMargin : 0 }}>
          <Label style={[styles.inputTitle, styles.placeholderColor]}>Add closing comments</Label>
          <View style={[styles.inputContainer, { height: 223, paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10 }, this.state.currentEditingField == 'closingComments' ? styles.inputActive : styles.inputInactive]}>
            <Textarea
              style={[styles.input, { height: '100%', width: '100%' }]}
              placeholder='Add closing comments here...'
              placeholderTextColor={Colors.placeholder}
              selectionColor={Colors.mainPrimary}
              value={this.state.closingComments}
              onChangeText={value => this.setState({ closingComments: value })}
              blurOnSubmit={false}
              keyboardAppearance='dark'
              returnKeyType={"go"}
              onFocus={value => {
                this.setState({ currentEditingField: 'closingComments' })
              }}
              onEndEditing={value => { this.setState({ currentEditingField: null }) }}
              ref={input => {
                this.closingCommentsRef = input;
              }}
              onSubmitEditing={() => {
                this.btnCloseTicketPressed();
              }}
            />
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.7} style={styles.buttonContainer} onPress={() => { this.btnCloseTicketPressed(); }}>
          <Text style={styles.buttonText}>{`Close ${this.state.ticketTitle}`}</Text>
        </TouchableOpacity>
      </View>
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
            showTitle={this.state.objTicket ? `Close ${this.state.ticketTitle} #${this.state.objTicket.number}` : `Close ${this.state.ticketTitle}`}
          />
        </SafeAreaView>
        {this.renderDropDownOptions()}
        <View style={styles.contentContainer}>
          <SafeAreaView style={styles.mainContainer}>
            <FlatList
              numColumns={2}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}

              data={this.state.selectedUsersDataSource}
              renderItem={(row, item, index) => this.renderRow(row, item, index)}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.flatListContainer}
              ListHeaderComponent={this.renderHeader()}
              ListFooterComponent={this.renderFooter()}
              keyboardShouldPersistTaps='handled'
            />
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
export default connect(mapStateToProps)(CloseTicket);