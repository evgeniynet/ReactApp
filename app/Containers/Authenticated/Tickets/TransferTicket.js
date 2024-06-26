/* Imports */
import React, { Component } from 'react'
import { ScrollView, Image, View, TouchableOpacity, Platform, StatusBar, SafeAreaView, Text, Keyboard, FlatList } from 'react-native'
import { Container, Label, Input, CardItem, Toast, Textarea } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';

import ValidationHelper from '../../../Components/ValidationHelper';
import CommonFunctions from '../../../Components/CommonFunctions';
import { userInfo } from '../../../Redux/Actions';
import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Images, Colors, Metrics } from '../../../Themes';
import LinearGradient from 'react-native-linear-gradient';
import ApiHelper from '../../../Components/ApiHelper';
import Loader from '../../../Components/Loader';
import { Messages, UserDataKeys } from '../../../Components/Constants';

// Styless
import styles from './Styles/TransferTicketStyles'

class TransferTicket extends Component {

  // Life cycle of class
  /* Initiating state before the component mount. */
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      techSelected: null,
      objTicket: null,
      ticketTitle: 'Ticket',
      ticketsTitle: 'Tickets',
      usersTitle: 'Users',
      userTitle: 'User',
      endUsersTitle: 'End Users',
      endUserTitle: 'End User',
      techniciansTitle: 'Technicians',
      techTitle: 'Tech',
      techsTitle: 'Techs',
      isAttached: false,
      isAgentsVisibleOnly: false,
      closingComments:''
    };
  }

  componentDidMount() {
    this.setState({
      loading: false,
      techSelected: null,
      objTicket: null,
      ticketTitle: 'Ticket',
      ticketsTitle: 'Tickets',
      usersTitle: 'Users',
      userTitle: 'User',
      endUsersTitle: 'End Users',
      endUserTitle: 'End User',
      techniciansTitle: 'Technicians',
      techTitle: 'Tech',
      techsTitle: 'Techs',
      isAttached: false,
      isAgentsVisibleOnly: false,
      closingComments:''
    });

    CommonFunctions.retrieveData(UserDataKeys.Config)
      .then((response) => {
        let config = JSON.parse(response)
        var ticketsTitle = 'Tickets'
        var ticketTitle = 'Ticket'
        var userTitle = 'User'
        var usersTitle = 'Users'
        var endUsersTitle = 'End Users'
        var endUserTitle = 'End User'
        var techTitle = 'Tech'
        var techsTitle = 'Techs'
        if (config.is_customnames) {
          ticketsTitle = config.names.ticket.p ?? 'Tickets'
          ticketTitle = config.names.ticket.s ?? 'Ticket'
          usersTitle = config.names.user.a ?? 'Users'
          userTitle = config.names.user.a ?? 'User'
          endUsersTitle = config.names.user.p ?? 'End Users'
          endUserTitle = config.names.user.s ?? 'End User'
          techniciansTitle = config.names.tech.p ?? 'Technicians'
          techTitle = config.names.tech.a ?? 'Tech'
          techsTitle = config.names.tech.ap ?? 'Techs'
        }
        this.setState({
          ticketsTitle,
          ticketTitle,
          usersTitle,
          userTitle,
          endUsersTitle,
          endUserTitle,
          techniciansTitle,
          techTitle,
          techsTitle,
        })
        // Call Apis
      })

    if (this.props.navigation.state.params !== undefined) {
      if (this.props.navigation.state.params.ticket !== undefined) {
        this.setState({ objTicket: this.props.navigation.state.params.ticket })
      }
    }
    this.viewWillAppear()
    this.props.navigation.addListener('didFocus', this.viewWillAppear)
  }

  viewWillAppear = () => {
    if (this.props.navigation.state.params !== undefined) {
      if (this.props.navigation.state.params.techSelected !== undefined) {
        this.setState({ techSelected: this.props.navigation.state.params.techSelected })
      }
    }
  }

  componentWillUnmount() {
    Keyboard.dismiss();
  }

  //Actions

  /* Validating information and calling sign in api */
  btnTransferTicketPressed() {
    /* Checking validation if it's valid calling API*/
    if (this.isValid()) {
      Keyboard.dismiss();
      let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))

      var objData = {
        'note_text': this.state.closingComments.trim(),
        'name': '',
        'tech_id': 0,
        'action': 'transfer',
        'keep_attached': this.state.isAttached,
        'is_techs_only': this.state.isAgentsVisibleOnly,
      }

      if (this.state.techSelected && this.state.techSelected.id != null && this.state.techSelected.id != undefined) {
        objData.tech_id = this.state.techSelected.id
        objData.name = this.state.techSelected.firstname + ' ' + this.state.techSelected.lastname + (this.state.techSelected.type == 'queue' ? '' : ` (${this.state.techSelected.email})`)
      }

      ApiHelper.postWithParam(ApiHelper.Apis.Tickets + `/${this.state.objTicket.key}`, objData, this, true, authHeader).then((response) => {
        Toast.show({
          text: `${this.state.ticketTitle} has been transferred #${this.state.objTicket.number}`,
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

  /* Checking validation and returns true/false */
  isValid() {
    if (this.state.techSelected == undefined || this.state.techSelected == null) {
      this.props.navigation.push('SearchTechnicians', { screen: 'TransferTicket', account: {id: this.state.objTicket.account_id }});
      return false
    }
    return true
  }

  /* Rendering header view */
  renderHeader() {
    return (
      <View>
        <Label style={[styles.inputTitle]}>{this.state.techTitle}</Label>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.inputContainer, this.state.currentEditingField == 'endUser' ? styles.inputActive : styles.inputInactive]}
          onPress={() => {
            this.props.navigation.push('SearchTechnicians', { screen: 'TransferTicket', account: {id: this.state.objTicket.account_id} });
            // this.setState({ showUsersPopup: true }) 
          }}>
          <Input
            pointerEvents={'none'}
            editable={false}
            style={styles.input}
            placeholder={`Choose ${this.state.techTitle}`}
            placeholderTextColor={Colors.placeholder}
            autoCapitalize='words'
            selectionColor={Colors.mainPrimary}
            value={this.state.techSelected ? (this.state.techSelected.firstname + ' ' + this.state.techSelected.lastname) : ''}
            onChangeText={value => this.setState({ class: value })}
            blurOnSubmit={false}
            keyboardAppearance='dark'
            returnKeyType={"next"}
            onFocus={value => {
              this.setState({ currentEditingField: 'endUser' })
            }}
            onEndEditing={value => { this.setState({ currentEditingField: null }) }}
            ref={input => {
              this.endUserRef = input;
            }}
            onSubmitEditing={() => {
              this.closingCommentsRef._root.focus();
            }}
          />
          <Image style={styles.rightIcon} source={Images.downarrow} />
        </TouchableOpacity>
        {this.state.objTicket ?
          <View style={styles.switchContainer}>
            <TouchableOpacity onPress={() => {
              this.setState({ isAttached: !this.state.isAttached })
            }}>
              <Image style={styles.switchIcon} source={this.state.isAttached ? Images.toggleOn : Images.toggleOff} />
            </TouchableOpacity>
            <Label style={styles.switchTitle}>{`Keep ${this.state.objTicket.tech_firstname} ${this.state.objTicket.tech_lastname} attached to this ${this.state.ticketTitle}`}</Label>
          </View>
          : null}
      </View>
    )
  }

  /* Rendering footer view */
  renderFooter() {
    return (
      <View>
        <View >
          <Label style={[styles.inputTitle, styles.placeholderColor]}>Note</Label>
          <View style={[styles.inputContainer, { height: 223, paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10 }, this.state.currentEditingField == 'closingComments' ? styles.inputActive : styles.inputInactive]}>
            <Textarea
              style={[styles.input, { height: '100%', width: '100%' }]}
              placeholder='Add transfer note here...'
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
                this.btnTransferTicketPressed();
              }}
            />
          </View>
        </View>

        <View style={styles.switchContainer}>
          <TouchableOpacity onPress={() => {
            this.setState({ isAgentsVisibleOnly: !this.state.isAgentsVisibleOnly })
          }}>
            <Image style={styles.switchIcon} source={this.state.isAgentsVisibleOnly ? Images.toggleOn : Images.toggleOff} />
          </TouchableOpacity>
          <Label style={styles.switchTitle}>{`${this.state.techsTitle} Visible Only`}</Label>
        </View>
        <TouchableOpacity activeOpacity={0.7} style={styles.buttonContainer} onPress={() => { this.btnTransferTicketPressed(); }}>
          <Text style={styles.buttonText}>{`Transfer`}</Text>
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
            showTitle={this.state.objTicket ? `Transfer ${this.state.endUserTitle} #${this.state.objTicket.number}` : `Close ${this.state.ticketTitle}`}
          />
        </SafeAreaView>
        <View style={styles.contentContainer}>
          <SafeAreaView style={styles.mainContainer}>
            <ScrollView keyboardShouldPersistTaps='handled' style={styles.flatListContainer}>
              {this.renderHeader()}
              {this.renderFooter()}
            </ScrollView>

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
export default connect(mapStateToProps)(TransferTicket);