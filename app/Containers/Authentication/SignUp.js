/* Imports */
import React, { Component } from 'react'
import { Image, View, Keyboard, TouchableOpacity, StatusBar, SafeAreaView, Platform } from 'react-native'
import { Container, Content, Button, Input, Text, Label, ActionSheet, Toast } from 'native-base';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import ImagePicker from 'react-native-image-crop-picker';
import { StackActions, NavigationActions } from 'react-navigation';
import { PreviousNextView } from 'react-native-keyboard-manager';
import { Buffer } from 'buffer'

import styles from './Styles/SignUpStyles'
import { Images, Colors, Metrics } from '../../Themes'
import { userInfo, org, authToken, configInfo } from '../../Redux/Actions';
import ValidationHelper from '../../Components/ValidationHelper';
import CommonFunctions from '../../Components/CommonFunctions';
import { NavigationBar } from '../../Navigation/NavigationBar';
import Loader from '../../Components/Loader';
import { UserDataKeys } from '../../Components/Constants';
import ApiHelper from '../../Components/ApiHelper';
import OrgOptions from '../../Components/OrgOptions';
import NotificationManager from '../../Components/NotificationManager';
import { notifiactionTokenManager } from '../../Components/NotifiactionTokenManager'

class SignUp extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            imageUrl: '',
            imageData: null,
            companyName: '',
            username: '',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            howdyouHearAboutUs: '',
            isValidateRunTime: false,
            isShowPasswordAsText: false,
            isShowConfirmPasswordAsText: false,
            isIAgreeToTheTermsOfUse: false,
            isShowAnimationTerms: false,
            orgDataSource: [],
            selectedOrg: {},
            showOrgPopup: false,
        };
    }

    componentDidMount() {
        this.setState({
            loading: false,
            imageUrl: '',
            imageData: null,
            companyName: '',
            username: '',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            howdyouHearAboutUs: '',
            isValidateRunTime: false,
            isShowPasswordAsText: false,
            isShowConfirmPasswordAsText: false,
            isIAgreeToTheTermsOfUse: false,
            currentEditingField: null,
            isShowAnimationTerms: false,
            orgDataSource: [],
            selectedOrg: {},
            showOrgPopup: false,
        });
    }

    componentWillUnmount() {
        Keyboard.dismiss();
    }

    //Actions

    /* Presenting image to change profile picture */
    changeProfilePicture() {
        Keyboard.dismiss();
        ActionSheet.show({
            title: 'Select',
            options: ["Take From Camera", "Choose From Library", "Cancel"],
            cancelButtonIndex: 2,
        },
            buttonIndex => {
                if (buttonIndex === 0) {
                    ImagePicker.openCamera({
                        cropping: true,
                        compressImageQuality: 0.7,
                    }).then(image => {
                        console.log(image);
                        this.setState({ imageUrl: image.path, imageData: image })
                    });
                } else if (buttonIndex === 1) {
                    ImagePicker.openPicker({
                        cropping: true,
                        compressImageQuality: 0.7,
                    }).then(image => {
                        console.log(image);
                        this.setState({ imageUrl: image.path, imageData: image })
                    });
                }
            }
        )
    }

    /* Show/Hide secure password as plain text */
    btnShowHidePasswordPressed() {
        this.setState({ isShowPasswordAsText: !this.state.isShowPasswordAsText })
    }

    /* Show/Hide secure confirm password as plain text */
    btnShowHideConfirmPasswordPressed() {
        this.setState({ isShowConfirmPasswordAsText: !this.state.isShowConfirmPasswordAsText })
    }

    /* I Agree to the terms of use & privacy policy */
    btnIAgreeIconPressed() {
        this.setState({ isIAgreeToTheTermsOfUse: !this.state.isIAgreeToTheTermsOfUse })
    }

    /* Navigating to web view screen to display trems and conditions */
    btnTermsAndConditionsPressed() {
        Keyboard.dismiss();
        const data = { title: 'Terms of Use & Privacy Policy' }
        this.props.navigation.push('WebViewInfo', data);
    }

    /* Validating information and calling sign in api */
    btnSignUpPressed(isForceSignUp = false) {
        /* Checking validation if it's valid calling API*/
        if (this.isValid()) {
            Keyboard.dismiss();

            var obj = {
                name: this.state.companyName,
                url: this.state.username,
                firstname: this.state.firstName,
                lastname: this.state.lastName,
                email: this.state.email,
                password: this.state.password,
                password_confirm: this.state.password,
                how: this.state.howdyouHearAboutUs,
                // device_token: this.props.deviceToken ?? ''
            }
            if (isForceSignUp) {
                obj.is_force_registration = isForceSignUp
            }

            ApiHelper.postWithParam(ApiHelper.Apis.SignUp, obj, this)
                .then((response) => {

                    this.setState({ apiToken: response })
                    this.props.authToken(response.api_token);
                    CommonFunctions.storeData(UserDataKeys.AuthToken, JSON.stringify(response))
                    // this.fetchOrganizations(response.api_token)
                    var arrOrgs = []
                    response.organizations.forEach(org => {
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
                        this.setState({ orgDataSource: arrOrgs, showOrgPopup: true, loading: false })
                    } else {
                        this.setOrgAndNavigate(response.organizations[0])
                    }
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
                    } else if (response.status == 409) {
                        setTimeout(() => {
                            ActionSheet.show({
                                title: 'This email is already in use.\nWould you like to',
                                options: ["Login", "Create New Org", "Cancel"],
                                cancelButtonIndex: 2,
                            },
                                buttonIndex => {
                                    if (buttonIndex === 0) {
                                        setTimeout(() => this.props.navigation.goBack(), 400)
                                    } else if (buttonIndex === 1) {
                                        this.btnSignUpPressed(true)
                                    }
                                }
                            )
                        }, 700)
                    } else {
                        ApiHelper.handleErrorAlert(response)
                    }
                });
        }
    }

    /* Navigating to create new account screen */
    btnSignInPressed() {
        Keyboard.dismiss();
        this.props.navigation.goBack()
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
            objUser.api_token = user.api_token
            this.props.userInfo(objUser);
            CommonFunctions.storeData(UserDataKeys.User, JSON.stringify(objUser))

            CommonFunctions.retrieveData(UserDataKeys.DeviceToken)
                .then((response) => {
                    console.log('Saved Token: -- ====================================', response);
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
        if (ValidationHelper.isInvalidText(this.state.companyName, 3)) {
            setTimeout(() => this.companyNameRef._root.focus(), 200)
            return false
        } else if (ValidationHelper.isInvalidEmail(this.state.email, false)) {
            setTimeout(() => this.emailRef._root.focus(), 200)
            return false
        } else if (ValidationHelper.isInvalidDomainName(this.state.username, false)) {
            setTimeout(() => this.usernameRef._root.focus(), 200)
            return false
        } else if (ValidationHelper.isInvalidText(this.state.firstName, 1)) {
            setTimeout(() => this.firstNameRef._root.focus(), 200)
            return false
        } else if (ValidationHelper.isInvalidText(this.state.lastName, 1)) {
            setTimeout(() => this.lastNameRef._root.focus(), 200)
            return false
        } else if (ValidationHelper.isInvalidPassword(this.state.password, false)) {
            setTimeout(() => this.passwordRef._root.focus(), 200)
            return false
        } else if (ValidationHelper.isInvalidConfirmPassword(this.state.password, this.state.confirmPassword, false)) {
            setTimeout(() => this.confirmPasswordRef._root.focus(), 200)
            return false
        } else if (!this.state.isIAgreeToTheTermsOfUse) {
            this.setState({ isShowAnimationTerms: true })
            return false
        }
        return true
    }

    /* Calling api social sign in and setting dashboard stack as root view */
    socialSignIn(data) {
        var params = data
        params.device_token = this.props.deviceToken ?? ''
        // ApiHelper.postWithParam(ApiHelper.Apis.SocialSignIn, params, this)
        //   .then((response) => {
        //     this.props.myInfo(response.data);
        //     CommonFunctions.storeData(UserDataKeys.User, JSON.stringify(response.data))
        //     //Setting hame as root view
        //     const resetAction = StackActions.reset({
        //       index: 0, // <-- currect active route from actions array
        //       actions: [
        //         NavigationActions.navigate({ routeName: 'dashboardStack' }),
        //       ],
        //     });
        //     this.props.navigation.dispatch(resetAction);
        //   })
    }

    /* Calling organizations in api */
    fetchOrganizations(token) {
        let encryptedAuthHeader = new Buffer(`x:${token}`).toString("base64");

        ApiHelper.get(ApiHelper.Apis.Organizations, this, encryptedAuthHeader).then((response) => {
            /* Saving user in redux store and local storage */
            this.setState({ orgDataSource: response, showOrgPopup: true, loading: false })
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
                <SafeAreaView>
                    <NavigationBar
                        navigation={this.props.navigation}
                        showTitle='Sign Up'
                    />
                </SafeAreaView>
                <Loader show={this.state.loading} />
                <Content keyboardShouldPersistTaps='handled'>
                    <Animatable.View animation={'fadeIn'}>
                        <PreviousNextView style={styles.container}>
                            <View>
                                <Label style={[styles.inputTitle, (ValidationHelper.isInvalidText(this.state.companyName, 3) && this.state.isValidateRunTime) ? styles.textErrorColor : styles.placeholderColor]}>Company Name</Label>
                                <View style={[styles.inputContainer, this.state.currentEditingField == 'companyName' ? styles.inputActive : styles.inputInactive]}>
                                    <Image style={styles.inputIcon} source={Images.company} />
                                    <Input
                                        style={styles.input}
                                        placeholder='SherpaDesk'
                                        placeholderTextColor={Colors.placeholder}
                                        autoCapitalize='words'
                                        selectionColor={Colors.mainPrimary}
                                        value={this.state.companyName}
                                        onChangeText={value => {
                                            var url = value.trim().replace(/ /g, '').replace(/[^a-zA-Z0-9-]/g, '')
                                            while (url.charAt(0) === '-') {
                                                url = url.substring(1);
                                            }
                                            this.setState({ companyName: value, username: url.toLowerCase() })
                                        }}
                                        onFocus={value => {
                                            this.setState({ currentEditingField: 'companyName' })
                                        }}
                                        onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                        blurOnSubmit={false}
                                        keyboardAppearance='dark'
                                        returnKeyType={"next"}
                                        ref={input => {
                                            this.companyNameRef = input;
                                        }}
                                        onSubmitEditing={() => {
                                            this.emailRef._root.focus();
                                        }}
                                    />
                                </View>
                            </View>
                            <View>
                                <Label style={[styles.inputTitle, (ValidationHelper.isInvalidEmail(this.state.email, false) && this.state.isValidateRunTime) ? styles.textErrorColor : styles.textColor]}>Email</Label>
                                <View style={[styles.inputContainer, this.state.currentEditingField == 'email' ? styles.inputActive : styles.inputInactive]}>
                                    <Image style={styles.inputIcon} source={Images.email} />
                                    <Input
                                        style={styles.input}
                                        placeholder='Email'
                                        placeholderTextColor={Colors.placeholder}
                                        keyboardType='email-address'
                                        autoCapitalize='none'
                                        selectionColor={Colors.mainPrimary}
                                        value={this.state.email}
                                        onChangeText={value => this.setState({ email: value.trim() })}
                                        blurOnSubmit={false}
                                        keyboardAppearance='dark'
                                        returnKeyType={"next"}
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
                            <View style={styles.urlContainer}>
                                <Label style={[styles.urlInputTitle, (ValidationHelper.isInvalidDomainName(this.state.username, false) && this.state.isValidateRunTime) ? styles.textErrorColor : styles.textColor]}>https://</Label>
                                <View style={[styles.inputContainer, { flex: 1, paddingLeft: Metrics.baseMargin, marginLeft: Metrics.baseMargin, marginRight: Metrics.baseMargin - 2 }, this.state.currentEditingField == 'username' ? styles.inputActive : styles.inputInactive]}>
                                    <Input
                                        // editable={false}
                                        style={styles.input}
                                        placeholder='Add Company'
                                        placeholderTextColor={Colors.placeholder}
                                        autoCapitalize='none'
                                        selectionColor={Colors.mainPrimary}
                                        value={this.state.username}
                                        onChangeText={value => this.setState({ username: value.trim() })}
                                        blurOnSubmit={false}
                                        keyboardAppearance='dark'
                                        returnKeyType={"next"}
                                        onFocus={value => {
                                            this.setState({ currentEditingField: 'username' })
                                        }}
                                        onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                        ref={input => {
                                            this.usernameRef = input;
                                        }}
                                        onSubmitEditing={() => {
                                            this.firstNameRef._root.focus();
                                        }}
                                    />
                                </View>
                                <Label style={[styles.urlInputTitle, (ValidationHelper.isInvalidDomainName(this.state.username, false) && this.state.isValidateRunTime) ? styles.textErrorColor : styles.textColor]}>.sherpadesk.com</Label>
                            </View>
                            <View>
                                <Label style={[styles.inputTitle, (ValidationHelper.isInvalidText(this.state.firstName, 1) && this.state.isValidateRunTime) ? styles.textErrorColor : styles.placeholderColor]}>First Name</Label>
                                <View style={[styles.inputContainer, this.state.currentEditingField == 'firstName' ? styles.inputActive : styles.inputInactive]}>
                                    <Image style={styles.inputIcon} source={Images.user} />
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
                                    <Image style={styles.inputIcon} source={Images.user} />
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
                                            this.passwordRef._root.focus();
                                        }}
                                    />
                                </View>
                            </View>
                            <View>
                                <Label style={[styles.inputTitle, (ValidationHelper.isInvalidPassword(this.state.password, false) && this.state.isValidateRunTime) ? styles.textErrorColor : styles.textColor]}>Password</Label>
                                <View style={[styles.inputContainer, this.state.currentEditingField == 'password' ? styles.inputActive : styles.inputInactive]}>
                                    <Image style={styles.inputIcon} source={Images.lock} />
                                    <Input
                                        style={styles.input}
                                        secureTextEntry={!this.state.isShowPasswordAsText}
                                        placeholder='**********'
                                        placeholderTextColor={Colors.placeholder}
                                        value={this.state.password}
                                        selectionColor={Colors.mainPrimary}
                                        onChangeText={value => this.setState({ password: value })}
                                        blurOnSubmit={false}
                                        keyboardAppearance='dark'
                                        returnKeyType={"next"}
                                        onFocus={value => {
                                            this.setState({ currentEditingField: 'password' })
                                        }}
                                        onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                        ref={input => {
                                            this.passwordRef = input;
                                        }}
                                        onSubmitEditing={() => {
                                            this.confirmPasswordRef._root.focus();
                                        }}
                                    />
                                    <Button transparent onPress={() => { this.btnShowHidePasswordPressed(); }}>
                                        <Image style={styles.inputIcon} source={this.state.isShowPasswordAsText ? Images.openeye : Images.closeeye} />
                                    </Button>
                                </View>
                            </View>
                            <View>
                                <Label style={[styles.inputTitle, (ValidationHelper.isInvalidConfirmPassword(this.state.password, this.state.confirmPassword, false) && this.state.isValidateRunTime) ? styles.textErrorColor : styles.placeholderColor]}>Confirm Password</Label>
                                <View style={[styles.inputContainer, this.state.currentEditingField == 'confirmPassword' ? styles.inputActive : styles.inputInactive]}>
                                    <Image style={styles.inputIcon} source={Images.lock} />
                                    <Input
                                        style={styles.input}
                                        secureTextEntry={!this.state.isShowConfirmPasswordAsText}
                                        placeholder='**********'
                                        placeholderTextColor={Colors.placeholder}
                                        value={this.state.confirmPassword}
                                        selectionColor={Colors.mainPrimary}
                                        onChangeText={value => this.setState({ confirmPassword: value })}
                                        blurOnSubmit={false}
                                        keyboardAppearance='dark'
                                        returnKeyType={"next"}
                                        onFocus={value => {
                                            this.setState({ currentEditingField: 'confirmPassword' })
                                        }}
                                        onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                        ref={input => {
                                            this.confirmPasswordRef = input;
                                        }}
                                        onSubmitEditing={() => {
                                            this.howdyouHearAboutUsRef._root.focus();
                                        }}
                                    />
                                    <Button transparent onPress={() => { this.btnShowHideConfirmPasswordPressed(); }}>
                                        <Image style={styles.inputIcon} source={this.state.isShowConfirmPasswordAsText ? Images.openeye : Images.closeeye} />
                                    </Button>
                                </View>
                            </View>
                            <View>
                                <Label style={styles.inputTitle}>How’d you Hear About Us</Label>
                                <View style={[styles.inputContainer, this.state.currentEditingField == 'howdyouHearAboutUs' ? styles.inputActive : styles.inputInactive]}>
                                    <Image style={styles.inputIcon} source={Images.info} />
                                    <Input
                                        style={styles.input}
                                        placeholder='Search Engine'
                                        placeholderTextColor={Colors.placeholder}
                                        autoCapitalize='words'
                                        selectionColor={Colors.mainPrimary}
                                        value={this.state.howdyouHearAboutUs}
                                        onChangeText={value => this.setState({ howdyouHearAboutUs: value })}
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => { this.btnSignUpPressed(); }}
                                        keyboardAppearance='dark'
                                        returnKeyType={"go"}
                                        onFocus={value => {
                                            this.setState({ currentEditingField: 'howdyouHearAboutUs' })
                                        }}
                                        onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                        ref={input => {
                                            this.howdyouHearAboutUsRef = input;
                                        }}
                                    />
                                </View>
                            </View>
                            <Animatable.View style={styles.termsOfUseContainer} easing={'ease-in-out'} animation={this.state.isShowAnimationTerms ? 'shake' : null} onAnimationEnd={() => this.setState({ isShowAnimationTerms: false })} >
                                <TouchableOpacity style={styles.iAgreeBtnContainer} activeOpacity={0.7} onPress={() => { this.btnIAgreeIconPressed(); }}>
                                    <Image style={styles.tickUntickIcon} source={this.state.isIAgreeToTheTermsOfUse ? Images.tick : Images.nontick} />
                                </TouchableOpacity>
                                <Label style={styles.iHaveAccountTitle}>I Agree to the <Label style={styles.loginTitle} onPress={() => { this.btnTermsAndConditionsPressed(); }} >Terms of Use & Privacy Policy</Label></Label>
                            </Animatable.View>
                            <TouchableOpacity activeOpacity={0.7} style={styles.signUpButtonContainer} onPress={() => { this.btnSignUpPressed(); }}>
                                <Text style={styles.signUpButtonText}>Create Account</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.7} style={styles.loginAccountContainer} activeOpacity={1} underlayColor={Colors.clear} onPress={() => { this.btnSignInPressed(); }}>
                                <Label style={styles.iHaveAccountTitle}>Already have an account? <Label style={styles.loginTitle}>Login</Label></Label>
                            </TouchableOpacity>
                        </PreviousNextView>
                    </Animatable.View>
                </Content>
                {this.renderDropDownOptions()}
            </Container >
        )
    }
}

/* Subscribing to redux store for updates */
const mapStateToProps = (state) => {
    const { authToken } = state.authToken
    return { authToken }
};

/* Connecting to redux store and exporting class */
export default connect(mapStateToProps, { userInfo, org, authToken, configInfo })(SignUp);