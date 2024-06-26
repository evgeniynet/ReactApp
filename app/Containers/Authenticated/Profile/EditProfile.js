/* Imports */
import React, { Component } from 'react'
import { ScrollView, View, Platform, StatusBar, SafeAreaView, Keyboard } from 'react-native'
import { Container, Input, Label } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import ValidationHelper from '../../../Components/ValidationHelper';
import CommonFunctions from '../../../Components/CommonFunctions';
import { UserDataKeys, } from '../../../Components/Constants';
import { userInfo, } from '../../../Redux/Actions';
import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Images, Colors } from '../../../Themes';
import ApiHelper from '../../../Components/ApiHelper';
import Loader from '../../../Components/Loader';

// Styless
import styles from './Styles/EditProfileStyles'

class EditProfile extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            firstName: '',
            lastName: '',
            email: '',
            companyPhoneNumber: '',
            mobileNumber: '',
            skypeId: '',
            image: '',
            userData: null,
        };
    }

    componentDidMount() {
        this.setState({
            loading: false,
        });

        if (this.props.navigation.state.params !== undefined) {
            if (this.props.navigation.state.params.user !== undefined) {
                this.onSuccess(this.props.navigation.state.params.user)
            }
        }

        this.viewWillAppear()
        this.props.navigation.addListener('didFocus', this.viewWillAppear)
    }

    viewWillAppear = () => {
        this.fetchUserData()
    }

    componentWillUnmount() {
        Keyboard.dismiss();
    }

    //Actions

    /* Validating information and calling sign in api */
    btnProfilePressed() {
        /* Checking validation if it's valid calling API*/
        if (this.isValid()) {
            Keyboard.dismiss();

            let obj = {
                firstname: this.state.firstName,
                lastname: this.state.lastName,
                email: this.state.email,
                mobile_email: this.state.companyPhoneNumber,
                mobile_phone: this.state.mobileNumber,
                skype: this.state.skypeId,
            }
            console.log(obj)

            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
            ApiHelper.putWithParam(ApiHelper.Apis.Profile + `/${this.state.userData.id}`, obj, this, true, authHeader)
                .then((response) => {
                    var objUserData = { ...this.state.userData, ...response }
                    objUserData.api_token = this.state.userData.api_token
                    this.props.userInfo(objUserData);
                    CommonFunctions.storeData(UserDataKeys.User, JSON.stringify(objUserData))
                    this.props.navigation.goBack()
                }).catch((response) => {
                    console.log('====================================');
                    console.log(response);
                    console.log('====================================');
                    ApiHelper.handleErrorAlert(response)
                });
        }
    }

    //Class Methods

    /* Retriving data from local storage and setting user info to  state */
    fetchUserData() {
        // CommonFunctions.retrieveData(UserDataKeys.User)
        // .then((user) => {
        //   this.onSuccess(JSON.parse(user))
        // })
        // .catch((err) => console.log('Call api and fetch user data'))
    }

    /* Setting user info to state */
    onSuccess(user) {
        this.setState({
            firstName: user.firstname ?? '',
            lastName: user.lastname ?? '',
            email: user.email ?? '',
            companyPhoneNumber: user.mobile_email ?? '',
            mobileNumber: user.mobile_phone ?? '',
            skypeId: user.skype ?? '',
            userData: user,
            image: ''
        })
    }

    /* Checking validation and returns true/false */
    isValid() {
        this.setState({ isValidateRunTime: true })
        if (ValidationHelper.isInvalidText(this.state.firstName, 1)) {
            setTimeout(() => this.firstNameRef._root.focus(), 200)
            return false
        } else if (ValidationHelper.isInvalidText(this.state.lastName, 1)) {
            setTimeout(() => this.lastNameRef._root.focus(), 200)
            return false
        }
        return true
    }

    /* Rendering footer view */
    renderFooter() {
        return (
            <View style={styles.flatListPadding} />
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
                        showTitle='Edit Profile'
                        rightImage={Images.done}
                        hideRightButton={false}
                        rightButton={() => {
                            this.btnProfilePressed()
                        }}
                    />
                </SafeAreaView>
                <View style={styles.contentContainer} >
                    <ScrollView keyboardShouldPersistTaps='handled'>
                        <SafeAreaView style={styles.mainContainer}>
                            <View style={[styles.mainContainer, { paddingTop: 30, paddingBottom: 30 }]}>
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
                                            returnKeyType={"next"}
                                            onFocus={value => {
                                                this.setState({ currentEditingField: 'lastName' })
                                            }}
                                            onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                            ref={input => {
                                                this.lastNameRef = input;
                                            }}
                                            onSubmitEditing={() => {
                                                this.companyPhoneNumberRef._root.focus();
                                            }}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <Label style={[styles.inputTitle, styles.placeholderColor]}>Company Phone Number</Label>
                                    {/* <Label style={[styles.inputTitle, (ValidationHelper.isInvalidText(this.state.companyPhoneNumber, 1) && this.state.isValidateRunTime) ? styles.textErrorColor : styles.placeholderColor]}>Company Phone Number</Label> */}
                                    <View style={[styles.inputContainer, this.state.currentEditingField == 'companyPhoneNumber' ? styles.inputActive : styles.inputInactive]}>
                                        <Input
                                            style={styles.input}
                                            placeholder='+11234567890'
                                            placeholderTextColor={Colors.placeholder}
                                            selectionColor={Colors.mainPrimary}
                                            value={this.state.companyPhoneNumber}
                                            onChangeText={value => this.setState({ companyPhoneNumber: value })}
                                            blurOnSubmit={false}
                                            keyboardAppearance='dark'
                                            returnKeyType={"next"}
                                            keyboardType={'number-pad'}
                                            onFocus={value => {
                                                this.setState({ currentEditingField: 'companyPhoneNumber' })
                                            }}
                                            onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                            ref={input => {
                                                this.companyPhoneNumberRef = input;
                                            }}
                                            onSubmitEditing={() => {
                                                this.mobileNumberRef._root.focus();
                                            }}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <Label style={[styles.inputTitle, styles.placeholderColor]}>Mobile Number</Label>
                                    {/* <Label style={[styles.inputTitle, (ValidationHelper.isInvalidText(this.state.mobileNumber, 1) && this.state.isValidateRunTime) ? styles.textErrorColor : styles.placeholderColor]}>Mobile Number</Label> */}
                                    <View style={[styles.inputContainer, this.state.currentEditingField == 'mobileNumber' ? styles.inputActive : styles.inputInactive]}>
                                        <Input
                                            style={styles.input}
                                            placeholder='+11234567890'
                                            placeholderTextColor={Colors.placeholder}
                                            selectionColor={Colors.mainPrimary}
                                            value={this.state.mobileNumber}
                                            onChangeText={value => this.setState({ mobileNumber: value })}
                                            blurOnSubmit={false}
                                            keyboardAppearance='dark'
                                            returnKeyType={"next"}
                                            keyboardType={'number-pad'}
                                            onFocus={value => {
                                                this.setState({ currentEditingField: 'mobileNumber' })
                                            }}
                                            onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                            ref={input => {
                                                this.mobileNumberRef = input;
                                            }}
                                            onSubmitEditing={() => {
                                                this.skypeIdRef._root.focus();
                                            }}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <Label style={[styles.inputTitle, styles.placeholderColor]}>Skype</Label>
                                    <View style={[styles.inputContainer, this.state.currentEditingField == 'skypeId' ? styles.inputActive : styles.inputInactive]}>
                                        <Input
                                            style={styles.input}
                                            placeholder='Skype Id'
                                            placeholderTextColor={Colors.placeholder}
                                            autoCapitalize='words'
                                            selectionColor={Colors.mainPrimary}
                                            value={this.state.skypeId}
                                            onChangeText={value => this.setState({ skypeId: value })}
                                            blurOnSubmit={false}
                                            keyboardAppearance='dark'
                                            returnKeyType={"go"}
                                            onFocus={value => {
                                                this.setState({ currentEditingField: 'skypeId' })
                                            }}
                                            onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                            ref={input => {
                                                this.skypeIdRef = input;
                                            }}
                                            onSubmitEditing={() => {
                                                this.btnProfilePressed()
                                            }}
                                        />
                                    </View>
                                </View>
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
    const { org } = state.org
    const { authToken } = state.authToken
    return { org, authToken }
};

/* Connecting to redux store and exporting class */
export default connect(mapStateToProps, { userInfo })(EditProfile);