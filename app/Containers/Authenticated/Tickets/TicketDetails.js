/* Imports */
import React, { Component } from 'react'
import { Image, View, TouchableOpacity, Platform, StatusBar, SafeAreaView, FlatList, Keyboard, Linking, Dimensions, KeyboardAvoidingView, Share } from 'react-native'
import { Container, Label, CardItem, Toast, Input, Text, ActionSheet, Textarea } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import Moment from 'moment';
import KeyboardManager from 'react-native-keyboard-manager';
import ImagePicker from 'react-native-image-crop-picker';
import ImageView from "react-native-image-viewing";
import FastImage from 'react-native-fast-image'
import DatePickerView from '../../../Components/DatePickerView';

// import parser from 'fast-xml-parser';
import { parseString } from 'react-native-xml2js';
import { UserDataKeys, DateFormat } from '../../../Components/Constants';
import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Images, Colors, Metrics } from '../../../Themes';
import LinearGradient from 'react-native-linear-gradient';
import CommonFunctions from '../../../Components/CommonFunctions';
import ApiHelper from '../../../Components/ApiHelper';
import Loader from '../../../Components/Loader';
import LoaderBar from '../../../Components/LoaderBar';
import TicketFiles from './TicketFiles';
import TicketNotes from './TicketNotes';
import Selection from '../Selection';
import ToDoTemplates from './ToDoTemplates';
import NextStep from './NextStep';
import TicketEvents from './TicketEvents';
import TicketAssets from './TicketAssets';
import AccountExpenses from '../Accounts/AccountExpenses';
import AccountTimes from '../Accounts/AccountTimes';
import TicketToDos from './TicketToDos';
import AccountSelectionWithLoadMore from '../AccountSelectionWithLoadMore';

// Styless
import styles from './Styles/TicketDetailsStyles'
import { ScrollView } from 'react-native-gesture-handler';

/* Global Variables */
const X_WIDTH = 375; const X_HEIGHT = 812; const PAD_WIDTH = 768; const PAD_HEIGHT = 1024;
const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');

const isIPhoneX = (() => {
    if (Platform.OS === 'web') return false;
    return (Platform.OS === 'ios' && ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) || (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT)));
})();

const keyboardVerticalOffset = Platform.OS === 'ios' ? isIPhoneX ? 0 : 0 : 0;
const behavior = Platform.OS === 'ios' ? 'padding' : null;

class TicketDetails extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            loadingBar: false,
            ticket: {},
            dataSourceTabs: [],
            selectedTab: '',
            ticketTitle: 'Ticket',
            ticketsTitle: 'Tickets',
            usersTitle: 'Users',
            userTitle: 'User',
            endUsersTitle: 'End Users',
            endUserTitle: 'End User',
            techniciansTitle: 'Technicians',
            techTitle: 'Tech',
            techsTitle: 'Techs',
            accountsTitle: 'Accounts',
            accountTitle: 'Account',
            acctTitle: 'Acct',
            locationsTitle: 'Locations',
            locationTitle: 'Location',
            locTitle: 'Loc',
            isInfoHidden: false,
            isInfoHiddens: false,
            isInfoExpanded: true,
            ticketRes: {},
            accountSelected: null,
            userSelected: null,
            selectedUsersDataSource: [],
            locationSelected: null,
            projectSelected: null,
            classSelected: null,
            creationCategorySelected: null,
            techSelected: null,
            selectedTechsDataSource: [],
            toDoTemplatesSelected: null,
            toDoTemplatesSelectedDataSource: [],
            showAccountPopup: false,
            accountDataSource: [],
            showUsersPopup: false,
            userDataSource: [],
            showLocationPopup: false,
            locationDataSource: [],
            showProjectPopup: false,
            projectDataSource: [],
            showClassPopup: false,
            classDataSource: [],
            showCreationCategoryPopup: false,
            creationCategoryDataSource: false,
            showTechPopup: false,
            techDataSource: [],
            showToDoTemplatesPopup: false,
            toDoTemplatesDataSource: [],
            dataSourceLogs: [],
            isTechsOnly: false,
            isWaitingOn: false,
            message: '',
            fileSource: null,
            visible: false,
            showNextStepPopup: false,
            arrOptions: [],
            userProfile: {},
            emailAddress: '',
            customfieldsDataSource: [],
            showSignleSelectionPopup: false,
            signleSelectionDataSource: [],
            showDatePicker: false,
            showMultipleSelectionPopup: false,
            multipleSelectionDataSource: [],
            selectedItem: null,
            arrCustomFileds: [],
        };
        _listViewOffset = 0
    }

    componentDidMount() {
        this.setState({
            loading: false,
            loadingBar: false,
            ticket: {},
            dataSourceTabs: [],
            selectedTab: '',
            // dataSourceTabs: ['Reply', 'Logs', 'Info', 'Assign', 'Notes', 'Files', 'ToDos', 'Events',  'Options'],
            // selectedTab: 'Logs',
            ticketTitle: 'Ticket',
            ticketsTitle: 'Tickets',
            usersTitle: 'Users',
            userTitle: 'User',
            endUsersTitle: 'End Users',
            endUserTitle: 'End User',
            techniciansTitle: 'Technicians',
            techTitle: 'Tech',
            techsTitle: 'Techs',
            accountsTitle: 'Accounts',
            accountTitle: 'Account',
            acctTitle: 'Acct',
            locationsTitle: 'Locations',
            locationTitle: 'Location',
            locTitle: 'Loc',
            isInfoHidden: false,
            isInfoHiddens: false,
            isInfoExpanded: false,
            ticketRes: {},
            accountSelected: null,
            userSelected: null,
            selectedUsersDataSource: [],
            locationSelected: null,
            projectSelected: null,
            classSelected: null,
            creationCategorySelected: null,
            techSelected: null,
            selectedTechsDataSource: [],
            toDoTemplatesSelected: null,
            toDoTemplatesSelectedDataSource: [],
            showAccountPopup: false,
            accountDataSource: [],
            showUsersPopup: false,
            userDataSource: [],
            showLocationPopup: false,
            locationDataSource: [],
            showProjectPopup: false,
            projectDataSource: [],
            showClassPopup: false,
            classDataSource: [],
            showCreationCategoryPopup: false,
            creationCategoryDataSource: false,
            showTechPopup: false,
            techDataSource: [],
            showToDoTemplatesPopup: false,
            toDoTemplatesDataSource: [],
            dataSourceLogs: ['1', '2'],
            isTechsOnly: false,
            isWaitingOn: false,
            message: '',
            fileSource: null,   
            visible: false,
            showNextStepPopup: false,
            arrOptions: [],
            userProfile: {},
            emailAddress: '',
            customfieldsDataSource: [],
            showSignleSelectionPopup: false,
            signleSelectionDataSource: [],
            showDatePicker: false,
            showMultipleSelectionPopup: false,
            multipleSelectionDataSource: [],
            selectedItem: null,
            arrCustomFileds: [],
        })

        if (Platform.OS === 'ios') {
            // KeyboardManager.setEnable(false);
            KeyboardManager.setShouldShowToolbarPlaceholder(false);
            KeyboardManager.setEnableAutoToolbar(false);
            KeyboardManager.setKeyboardDistanceFromTextField(56)
        }

        if (this.props.navigation.state.params !== undefined) {
            if (this.props.navigation.state.params.ticket !== undefined) {
                this.setState({ ticket: this.props.navigation.state.params.ticket })
                setTimeout(() => {
                    this.viewWillAppear()
                }, 100)
            } else {
                console.log('Notification data in ticket detail screen ====================================');
                console.log(this.props.navigation.state.params.notificationData);
                console.log('====================================');
                var ticket = this.props.navigation.state.params.notificationData
                ticket.key = this.props.navigation.state.params.notificationData.id
                this.setState({ ticket: ticket })
                setTimeout(() => {
                    this.viewWillAppear()
                }, 100)
            }
        }

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
                var accountsTitle = 'Accounts'
                var accountTitle = 'Account'
                var acctTitle = 'Acct'
                var locationsTitle = 'Locations'
                var locationTitle = 'Location'
                var locTitle = 'Loc'
                var techniciansTitle = 'Technicians'

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
                    accountsTitle = config.names.account.p ?? 'Accounts'
                    accountTitle = config.names.account.s ?? 'Account'
                    acctTitle = config.names.account.a ?? 'Acct'
                    locationsTitle = config.names.location.p ?? 'Locations'
                    locationTitle = config.names.location.s ?? 'Location'
                    locTitle = config.names.location.a ?? 'Loc'
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
                    accountsTitle,
                    accountTitle,
                    acctTitle,
                    locationsTitle,
                    locationTitle,
                    locTitle,
                })
                this.viewWillAppear()
                // Call Apis
            })
            .catch((err) => {
                console.log('Error====================================', err);
            })

        // this.viewWillAppear()
        this.subs = [
            this.props.navigation.addListener('didFocus', this.viewWillAppear)
        ]
    }

    viewWillAppear = () => {

        if (this.props.navigation.state.params !== undefined) {
            if (this.props.navigation.state.params.techSelected !== undefined) {
                this.setState({ techSelected: this.props.navigation.state.params.techSelected })
            }
            if (this.props.navigation.state.params.userSelected !== undefined) {
                this.setState({ userSelected: this.props.navigation.state.params.userSelected })
            }
        }
        this.fetchTicketDetails()
    }

    componentWillUnmount() {
        Keyboard.dismiss();
        if (this.sub) {
            this.subs.forEach((sub) => {
                sub.remove();
            });
        }
        if (Platform.OS === 'ios') {
            // KeyboardManager.setEnable(true);
            KeyboardManager.setShouldShowToolbarPlaceholder(true);
            KeyboardManager.setEnableAutoToolbar(true);
            KeyboardManager.setKeyboardDistanceFromTextField(10)
        }
    }

    //Actions

    /* Handling hide show info view  */
    handleScroll(event) {
        /*
        if (Platform.OS == 'ios') {
        // console.log('====================================');
        // console.log(event.nativeEvent);
        // console.log('====================================');
        // console.log('Height', event.nativeEvent.layoutMeasurement.height);
        // console.log('Scroll Content', event.nativeEvent.contentSize.height);
        // console.log('Offset Y', event.nativeEvent.contentOffset.y);
        // console.log('====================================');
        // console.log('====================================');
        const currentOffset = event.nativeEvent.contentOffset.y
        const direction = (currentOffset > this._listViewOffset)
            ? 'down'
            : 'up'
        this._listViewOffset = currentOffset

        if (event.nativeEvent.contentOffset.y > 51) {
            this.setState({ isInfoHidden: true });
        } else {
            this.setState({ isInfoHidden: false, isInfoHiddens: false });
        }
        }*/
    }

    /* Handling hide show info view  */
    handleScrollAndroid(event) {
        /*
        if (Platform.OS == 'android') {
        // console.log('====================================');
        // console.log(event.nativeEvent);
        // console.log('====================================');
        // console.log('Height', event.nativeEvent.layoutMeasurement.height);
        // console.log('Scroll Content', event.nativeEvent.contentSize.height);
        // console.log('Offset Y', event.nativeEvent.contentOffset.y);
        // console.log('====================================');
        // console.log('====================================');
        const currentOffset = event.nativeEvent.contentOffset.y
        const direction = (currentOffset > this._listViewOffset)
            ? 'down'
            : 'up'
        this._listViewOffset = currentOffset

        if (event.nativeEvent.contentOffset.y > 51) {
            this.setState({ isInfoHidden: true });
        } else {
            this.setState({ isInfoHidden: false, isInfoHiddens: false });
        }
    }*/
    }

    /* Calling api to save new user response */
    onSendBtnPress() {
        let obj = {
            'action': 'response',
            'note_text': this.state.message.trim(),
            'files': this.state.fileSource ? [this.state.fileSource.filename] : [],
            'is_waiting_on_response': this.state.isWaitingOn,
            'is_tech_only': this.state.isTechsOnly
        }

        let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))

        ApiHelper.postWithParam(ApiHelper.Apis.Tickets + `/${this.state.ticketRes.id}`, obj, this, true, authHeader)
            .then((response) => {
                Toast.show({
                    text: `Response has been added successfully.`,
                    position: 'top',
                    duration: 3000,
                    type: 'success',
                    style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
                })
                var obj = this.state.ticketRes
                obj.ticketlogs = response
                if (this.state.fileSource) {
                    setTimeout(() => {
                        this.fetchTicketDetails()
                    }, 350)
                } else {
                    setTimeout(() => {
                        // this.flatListLogsRef.scrollToEnd({ animated: true })
                        this.flatListLogsRef.scrollToOffset({ offset: 0, animated: true })
                    }, 150)
                }
                this.setState({ message: '', ticketRes: obj, fileSource: null })
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

    /* Validating information and calling update api */
    btnUpdateTicketPressed() {

        if (this.isValid()) {
            /* Checking validation if it's valid calling API*/
            //<field id="7762"><caption>DA CP</caption><value>Op2</value></field>
            var strXML = '<root>'
            this.state.arrCustomFileds.forEach(element => {
                strXML += `<field id="${element.id}"><caption>${element.caption}</caption><value>${element.value}</value></field>`
            });
            strXML += `</root>`
            console.log('====================================');
            console.log(strXML);
            console.log('====================================');
            // let xml = new Builder({ 'xmldec': {}, 'xmlns': true, attrkey: 'filed', explicitArray: true, mergeAttrs: true }).buildObject(arrTemp)
            // console.log('xml====================================', xml.replace('<?xml version="1.0"?>', '').replace('\n', ''));

            // return
            Keyboard.dismiss();

            var obj = {
                'class_id': 0,
                'account_id': -1,
                'location_id': 0,
                'project_id': 0,
                'user_id': this.state.ticketRes.user_id ? this.state.ticketRes.user_id : 0,
                'tech_id': this.state.ticketRes.tech_id ? this.state.ticketRes.tech_id : 0,
                'default_contract_id': this.state.ticketRes.default_contract_id ? this.state.ticketRes.default_contract_id : 0,
                'priority_id': this.state.ticketRes.priority_id ? this.state.ticketRes.priority_id : 0,
                'level_id': this.state.ticketRes.level_id ? this.state.ticketRes.level_id : 0,
                'customfields_xml': strXML,
                'default_contract_name': this.state.ticketRes.default_contract_name ? this.state.ticketRes.default_contract_name : '',
                'creation_category_id': 0,
                'creation_category_name': '',
                'submission_category': this.state.ticketRes.submission_category ? this.state.ticketRes.submission_category : '',
            }

            if (this.state.classSelected && this.state.classSelected.id != null && this.state.classSelected.id != undefined) {
                obj.class_id = this.state.classSelected.id
            }

            if (this.state.accountSelected && this.state.accountSelected.id != null && this.state.accountSelected.id != undefined) {
                obj.account_id = this.state.accountSelected.id
            }

            if (this.state.locationSelected && this.state.locationSelected.id != null && this.state.locationSelected.id != undefined) {
                obj.location_id = this.state.locationSelected.id
            }

            var arrUsers = []
            this.state.selectedUsersDataSource.forEach(element => {
                if (element.id) {
                    arrUsers.push(element.id)
                }
            });
            if (arrUsers.length > 0) {
                obj.user_id = arrUsers.join(', ')
            }

            var arrTechs = []
            this.state.selectedTechsDataSource.forEach(element => {
                if (element.id) {
                    arrTechs.push(element.id)
                }
            });
            if (arrTechs.length > 0) {
                obj.tech_id = arrTechs.join(', ')
            }

            if (this.state.projectSelected && this.state.projectSelected.id != null && this.state.projectSelected.id != undefined) {
                obj.project_id = this.state.projectSelected.id
            }

            if (this.state.creationCategorySelected && this.state.creationCategorySelected.id != null && this.state.creationCategorySelected.id != undefined) {
                obj.creation_category_id = this.state.creationCategorySelected.id
                obj.creation_category_name = this.state.creationCategorySelected.name
            }

            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))

            ApiHelper.putWithParam(ApiHelper.Apis.Tickets + `/${this.state.ticketRes.key}`, obj, this, true, authHeader)
                .then((response) => {
                    Toast.show({
                        text: `${this.state.ticketTitle} has been updated successfully.`,
                        position: 'top',
                        duration: 3000,
                        type: 'success',
                        style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
                    })
                    this.setState({ selectedTechsDataSource: [], selectedUsersDataSource: [] })
                    this.fetchTicketDetails(this.state.selectedTab)
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

    //Class Methods
    /* Calling api to fetch profile info */
    fetchUserProfile() {
        let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
        ApiHelper.getWithParam(ApiHelper.Apis.Profile + `/${this.state.ticketRes.user_id}`, {}, this, false, authHeader).then((response) => {
            this.setState({ userProfile: response })
        })
            .catch((response) => {
                ApiHelper.handleErrorAlert(response)
            })
    }

    /* Calling api to fetch tickets */
    fetchTicketDetails(tab) {
        return new Promise(resolve => {
            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
            ApiHelper.getWithParam(ApiHelper.Apis.Tickets + `/${this.state.ticket.key}`, {c: 1}, this, true, authHeader).then((response) => {
                this.fetchCustomfields(response.class_id)
                console.log('====================================');
                console.log(response.customfields_xml);
                parseString(response.customfields_xml, { explicitArray: false, mergeAttrs: true }, (err, result) => {
                    console.log('err====================================', err);
                    console.log('result====================================', result);
                    if (result) {
                        let arrCustomFileds = result.root && result.root.field ? result.root && result.root.field : []
                        console.log(arrCustomFileds.length);
                        console.log(arrCustomFileds);
                        this.setState({ arrCustomFileds: arrCustomFileds.length == undefined ? [arrCustomFileds] : arrCustomFileds })
                        console.log('====================================');
                    }

                    //    let nw = new xml2js.Parser()

                    // let xml = new Builder({ 'xmldec': {} }).buildObject(result)
                    // console.log('xml====================================', xml.replace('<?xml version="1.0"?>', '').replace('\n', ''));
                });

                CommonFunctions.retrieveData(UserDataKeys.Org)
                    .then((org) => {
                        let objOrg = JSON.parse(org)
                        if (objOrg && objOrg.instances && objOrg.instances.length > 0) {
                            let email = `r.${objOrg.key}.${objOrg.instances[0].key}.${response.key}${'@app.sherpadesk.com'}`
                            this.setState({ emailAddress: email })
                        }
                    })

                var arrTemp = []
                var arrOps = ['Add Event', 'Add Time', 'Add Product', `Change ${this.state.endUserTitle}`, `Transfer ${this.state.ticketTitle}`, `Pickup ${this.state.ticketTitle}`, `${response.status == 'Closed' ? 'ReOpen' : 'Close'} ${this.state.ticketTitle}`]
                arrOps.forEach(element => {
                    if (element == `Add Event`) {
                        if (this.props.configInfo && this.props.configInfo.user && this.props.configInfo.user.is_techoradmin && this.props.configInfo.is_events) {
                            arrTemp.push(element)
                        }
                    } else if (element == `Add Time`) {
                        if (this.props.configInfo && this.props.configInfo.user.is_techoradmin && this.props.configInfo.is_time_tracking) {
                            arrTemp.push(element)
                        }
                    } else if (element == `Add Product`) {
                        if (this.props.configInfo && this.props.configInfo.user.is_techoradmin && this.props.configInfo.is_expenses) {
                            arrTemp.push(element)
                        }
                    } else if (element == `Pickup ${this.state.ticketTitle}`) {
                        let usrId = this.props.user && this.props.user.id ? this.props.user.id : this.props.user.user_id
                        if (this.props.configInfo && this.props.configInfo.user.is_techoradmin && response.tech_id != usrId) {
                            arrTemp.push(element)
                        }
                    } else if (element == `Close ${this.state.ticketTitle}`) {
                        if (response.status != 'Closed') {
                            arrTemp.push(element)
                        }
                    } else if (element == `ReOpen ${this.state.ticketTitle}`) {
                        if (response.status == 'Closed') {
                            arrTemp.push(element)
                        }
                    } else {
                        arrTemp.push(element)
                    }
                });
                var arrPermittedTabs = []
                var dataTabs = ['Reply', 'Logs', 'Assign', 'Time', 'Expenses', 'Notes', 'Files', 'ToDos', 'Events', 'Assets']; //'Info', 
                dataTabs.forEach(element => {
                    if (element == `Events`) {
                        if (this.props.configInfo && this.props.configInfo.user && this.props.configInfo.user.is_techoradmin && this.props.configInfo.is_events) {
                            arrPermittedTabs.push(element)
                        }
                    } else if (element == `Time`) {
                        if (this.props.configInfo && this.props.configInfo.user.is_techoradmin && this.props.configInfo.is_time_tracking) {
                            arrPermittedTabs.push(element)
                        }
                    } else if (element == `Expenses`) {
                        if (this.props.configInfo && this.props.configInfo.user.is_techoradmin && this.props.configInfo.is_expenses) {
                            arrPermittedTabs.push(element)
                        }
                    } else if (element == `ToDos`) {
                        if (this.props.configInfo && this.props.configInfo.user.is_techoradmin && this.props.configInfo.is_todos) {
                            arrPermittedTabs.push(element)
                        }
                    } else if (element == `Assets`) {
                        if (this.props.configInfo && this.props.configInfo.user.is_techoradmin && this.props.configInfo.is_asset_tracking) {
                            arrPermittedTabs.push(element)
                        }
                    } else if (element == `Assign`) {
                        if (this.props.configInfo && this.props.configInfo.user.is_techoradmin) {
                            arrPermittedTabs.push(element)
                        }
                    } else if (element == `Logs`) {
                        if (this.props.configInfo && this.props.configInfo.user.is_techoradmin) {
                            arrPermittedTabs.push(element)
                        }
                    } else {
                        arrPermittedTabs.push(element)
                    }
                });
                this.setState({
                    ticketRes: response,
                    dataSourceTabs: arrPermittedTabs, 
                    selectedTab: ((this.state.selectedTab != '' && (tab == undefined)) ? this.state.selectedTab : ((tab && tab != '') ? tab : 'Reply')),
                    arrOptions: arrTemp,
                    accountSelected: {
                        id: response.account_id ? response.account_id : undefined,
                        name: response.account_name ? response.account_name : 'Default',
                        value_title: response.account_name,
                    },
                    locationSelected: {
                        id: response.location_id ? response.location_id : undefined,
                        name: response.location_name ? response.location_name : 'Default',
                        value_title: response.location_name,
                    },
                    projectSelected: {
                        id: response.project_id ? response.project_id : undefined,
                        name: response.project_name ? response.project_name : 'Default',
                        value_title: response.project_name,
                    },
                    classSelected: {
                        id: response.class_id ? response.class_id : undefined,
                        name: response.class_name ? response.class_name : 'Default',
                        value_title: response.class_name,
                    },
                    techSelected: {
                        id: response.tech_id ? response.tech_id : undefined,
                        firstname: response.tech_firstname ? response.tech_firstname : 'Default',
                        lastname: response.tech_lastname ? response.tech_lastname : '',
                        email: response.tech_email,
                        value_title: `${response.tech_firstname} ${response.tech_lastname} (${response.user_email})`,
                    },
                    userSelected: {
                        id: response.user_id ? response.user_id : undefined,
                        firstname: response.user_firstname ? response.user_firstname : 'Default',
                        lastname: response.user_lastname ? response.user_lastname : '',
                        email: response.user_email,
                        value_title: `${response.user_firstname} ${response.user_lastname} (${response.user_email})`,
                    },
                    creationCategorySelected: {
                        id: response.creation_category_id ? response.creation_category_id : undefined,
                        name: response.creation_category_name ? response.creation_category_name : 'Default',
                        value_title: response.creation_category_name,
                    },
                })
                resolve(true)
                // setTimeout(() => {
                if (this.flatListLogsRef) {
                    if (this.state.selectedTab == 'Reply') {
                        // this.flatListLogsRef.scrollToEnd({ animated: true })
                        this.flatListLogsRef.scrollToOffset({ animated: true, offset: 0 })
                    } else if (this.state.selectedTab == 'Logs') {
                        this.flatListLogsRef.scrollToOffset({ animated: true, offset: 0 })
                    }
                }
                // }, 100)
                this.fetchUserProfile()
                Keyboard.dismiss();
                if (this.sub) {
                    this.subs.forEach((sub) => {
                        sub.remove();
                    });
                }
            })
                .catch((response) => {
                    ApiHelper.handleErrorAlert(response)
                })
        });
    }

    /* Calling api to fetch custom fields based on selected class */
    fetchCustomfields(class_id, isShowLoader = false) {
        if (class_id) {
            this.setState({ customfieldsDataSource: [] })
            var objData = { class_id: class_id }
            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
            ApiHelper.getWithParam(ApiHelper.Apis.CustomFields, objData, this, isShowLoader, authHeader).then((response) => {
                this.setState({ customfieldsDataSource: response })
            })
                .catch((response) => {
                    console.log('Error ====================================');
                    console.log(response);
                    console.log('====================================');
                })
        }
    }

    /* Calling api to fetch accounts and display selection popup */
    fetchAccounts(isShowPopup = false) {
        this.setState({ showAccountPopup: true })
        /*
        if (this.state.accountDataSource.length > 0 && isShowPopup) {
            this.setState({ showAccountPopup: true })
        } else {
            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
            let objData = { is_with_statistics: false }
            ApiHelper.getWithParam(ApiHelper.Apis.Accounts, objData, this, isShowPopup, authHeader).then((response) => {
                var arrAccounts = []
                for (const key in response) {
                    if (Object.hasOwnProperty.call(response, key)) {
                        var account = response[key];
                        account.value_title = account.name
                        arrAccounts.push(account)
                    }
                }
                this.setState({ accountDataSource: arrAccounts })
                if (isShowPopup) {
                    this.setState({ showAccountPopup: true })
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
        }*/
    }

    /* Calling api to fetch users and display selection popup */
    fetchUsers(isShowPopup = false) {
        if (this.state.userDataSource.length > 0 && isShowPopup) {
            this.setState({ showUsersPopup: true })
        } else {
            // this.props.navigation.push('SearchUsers', { screen: 'AddEditTicket' });
            // return
            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
            var objData = {}
            // if (this.state.accountSelected && this.state.accountSelected.id != null && this.state.accountSelected.id != undefined) {
            //     objData.account = this.state.accountSelected.id
            // }
            ApiHelper.getWithParam(ApiHelper.Apis.Users, objData, this, true, authHeader).then((response) => {
                var arrAccounts = []
                for (const key in response) {
                    if (Object.hasOwnProperty.call(response, key)) {
                        var obj = response[key];
                        obj.value_title = obj.firstname + ' ' + obj.lastname + ` (${obj.email})`
                        arrAccounts.push(obj)
                    }
                }
                this.setState({ userDataSource: arrAccounts })
                if (isShowPopup) {
                    this.setState({ showUsersPopup: true })
                }
            })
                .catch((response) => {
                    ApiHelper.handleErrorAlert(response)
                })
        }
    }

    /* Calling api to fetch projects and display selection popup */
    fetchProjects(isShowPopup = false) {
        let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
        var id = 0
        if (this.state.accountSelected && this.state.accountSelected.id != null && this.state.accountSelected.id != undefined) {
            id = this.state.accountSelected.id
        }
        let objData = { is_with_statistics: false, account: id }
        ApiHelper.getWithParam(ApiHelper.Apis.Projects, objData, this, true, authHeader).then((response) => {
            var arrProjects = []
            arrProjects.push({ value_title: 'Default', name: 'Default' })
            for (const key in response) {
                if (Object.hasOwnProperty.call(response, key)) {
                    var obj = response[key];
                    obj.value_title = obj.name
                    arrProjects.push(obj)
                }
            }
            this.setState({ projectDataSource: arrProjects })
            if (isShowPopup) {
                this.setState({ showProjectPopup: true })
            }
        })
            .catch((response) => {
                ApiHelper.handleErrorAlert(response)
            })
    }

    /* Calling api to fetch locations and display selection popup */
    fetchLocations(isShowPopup = false) {
        let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
        var objData = { is_tree: true }
        // var objData = {  }
        if (this.state.accountSelected && this.state.accountSelected.id != null && this.state.accountSelected.id != undefined) {
            objData.account = this.state.accountSelected.id
        }
        ApiHelper.getWithParam(ApiHelper.Apis.Locations, objData, this, true, authHeader).then((response) => {
            var arrTemp = []
            arrTemp.push({ value_title: 'Default', name: 'Default' })
            for (const key in response) {
                if (Object.hasOwnProperty.call(response, key)) {
                    var obj = response[key];
                    obj.value_title = obj.name
                    arrTemp.push(obj)
                }
            }
            this.setState({ locationDataSource: arrTemp })
            if (isShowPopup) {
                this.setState({ showLocationPopup: true })
            }
        })
            .catch((response) => {
                ApiHelper.handleErrorAlert(response)
            })
    }

    /* Calling api to fetch categories and display selection popup */
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

    /* Calling api to fetch classes and display selection popup */
    fetchClasses(isShowPopup = false) {
        if (this.state.classDataSource.length > 0 && isShowPopup) {
            this.setState({ showClassPopup: true })
        } else {
            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
            ApiHelper.getWithParam(ApiHelper.Apis.Classes, {}, this, true, authHeader).then((response) => {
                var arrTemp = []
                arrTemp.push({ value_title: 'Default', name: 'Default' })
                for (const key in response) {
                    if (Object.hasOwnProperty.call(response, key)) {
                        var obj = response[key];
                        obj.value_title = obj.name
                        arrTemp.push(obj)
                    }
                }
                this.setState({ classDataSource: arrTemp })
                if (isShowPopup) {
                    this.setState({ showClassPopup: true })
                }
            })
                .catch((response) => {
                    ApiHelper.handleErrorAlert(response)
                })
        }
    }

    /* Calling api to fetch technicians and display selection popup */
    fetchTechnicians(isShowPopup = false) {
        // this.props.navigation.push('SearchTechnicians', { screen: 'AddEditTicket' });
        // return
        if (this.state.techDataSource.length > 0 && isShowPopup) {
            this.setState({ showTechPopup: true })
        } else {
            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
            var objData = { }
            if (this.props.configInfo && this.props.configInfo.is_account_manager)
            {
             if (this.state.accountSelected && this.state.accountSelected.id != null && this.state.accountSelected.id != undefined) {
                 objData.accountId = this.state.accountSelected.id
             }
            }
            ApiHelper.getWithParam(ApiHelper.Apis.Technicians, objData, this, true, authHeader).then((response) => {
                var arrTemp = []
                arrTemp.push({ value_title: 'Default', name: 'Default' })
                for (const key in response) {
                    if (Object.hasOwnProperty.call(response, key)) {
                        var obj = response[key];
                        obj.value_title = (obj.type == 'contractor' ? 'Contractor: ' : '') + obj.firstname + ' ' + obj.lastname + (obj.type == 'queue' ? '' : ` (${obj.email})`)
                        arrTemp.push(obj)
                    }
                }
                this.setState({ techDataSource: arrTemp })
                if (isShowPopup) {
                    this.setState({ showTechPopup: true })
                }
            })
                .catch((response) => {
                    ApiHelper.handleErrorAlert(response)
                })
        }
    }

    /* Calling api to fetch todos templates and display selection popup */
    fetchToDoTemplates(isShowPopup = false) {
        if (this.state.toDoTemplatesDataSource.length > 0 && isShowPopup) {
            this.setState({ showToDoTemplatesPopup: true })
        } else {
            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
            ApiHelper.getWithParam(ApiHelper.Apis.ToDoTemplates, {}, this, true, authHeader).then((response) => {
                var arrTemp = []
                // arrTemp.push({ value_title: 'Default', name: 'Default' })
                for (const key in response) {
                    if (Object.hasOwnProperty.call(response, key)) {
                        var obj = response[key];
                        obj.value_title = obj.name
                        arrTemp.push(obj)
                    }
                }
                this.setState({ toDoTemplatesDataSource: arrTemp })
                if (isShowPopup) {
                    this.setState({ showToDoTemplatesPopup: true })
                }
            })
                .catch((response) => {
                    ApiHelper.handleErrorAlert(response)
                })
        }
    }

    /* Calling api to update ticket next step */
    saveNextStep(subject, step) {
        let obj = {
            'action': 'subject',
            'subject': subject,
            'next_step': step,
        }

        let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))

        ApiHelper.postWithParam(ApiHelper.Apis.Tickets + `/${this.state.ticketRes.key}`, obj, this, true, authHeader)
            .then((response) => {
                Toast.show({
                    text: `Subject has been updated successfully.`,
                    position: 'top',
                    duration: 3000,
                    type: 'success',
                    style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
                })
                var obj = this.state.ticketRes
                obj.subject = subject
                obj.next_step = step
                obj.next_step_date = Moment().utc().format(DateFormat.YYYYMMDDTHHMMSS)
                this.setState({ ticketRes: obj })
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

    /* Calling api to upload file */
    uploadFile() {
        let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
        let obj = { ticket: this.state.ticketRes.key }
        ApiHelper.postImageWithParam(ApiHelper.Apis.Files, [this.state.fileSource], obj, this, authHeader, true, 'uploads[')
            .then((response) => {
                this.onSendBtnPress()
            }).catch((response) => {
                // this.onSendBtnPress()
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

    /* Checking validation and returns true/false */
    isValid() {
        var isValid = true
        this.state.customfieldsDataSource.forEach(element => {
            if (element.required && (this.customFiledAnswer(element) == '' || this.customFiledAnswer(element) == 'null')) {
                isValid = false
                Toast.show({
                    text: `Please fill the required field ${element.name}`,
                    position: 'top',
                    duration: 3000,
                    type: 'danger',
                    style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
                })
                return false
            }
        });
        return isValid
    }

    /* Calling api to pickup ticket */
    pickupTicket() {
        let obj = {
            'action': 'pickup',
            'note_text': '',
        }

        let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))

        ApiHelper.putWithParam(ApiHelper.Apis.Tickets + `/${this.state.ticketRes.key}`, obj, this, true, authHeader)
            .then((response) => {
                Toast.show({
                    text: `${this.state.ticketTitle} pickup was successfully.`,
                    position: 'top',
                    duration: 3000,
                    type: 'success',
                    style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
                })
                setTimeout(() => {
                    this.fetchTicketDetails()
                }, 100)
                // this.setState({ ticketRes: response })
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

    /* Calling api to reopen ticket */
    reopenTicket() {
        // CommonFunctions.presentAlertWithAction(Messages.AskReopen + ` #${row.item.number}?`, Messages.ReOpen)
        //     .then((respose) => {
        let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
        let objData = { status: 'open', note_text: '' }
        ApiHelper.putWithParam(ApiHelper.Apis.Tickets + `/${this.state.ticketRes.key}`, objData, this, true, authHeader).then((response) => {
            this.fetchTicketDetails()
            //   this.setState({ ticketRef: response })
            Toast.show({
                text: `${this.state.ticketTitle} has been reopened #${this.state.ticketRes.number}`,
                position: 'top',
                duration: 3000,
                type: 'success',
                style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
            })
        })
            .catch((response) => {
                ApiHelper.handleErrorAlert(response)
            })
        // })
    }

    /* Presenting image to change profile picture */
    changeFilePicture() {
        Keyboard.dismiss();
        ActionSheet.show({
            title: 'Select',
            options: ["Take From Camera", "Choose From Library", "Cancel"],
            cancelButtonIndex: 2,
        },
            buttonIndex => {
                if (buttonIndex === 0) {
                    ImagePicker.openCamera({
                        // cropping: true,
                        compressImageQuality: 0.7,
                    }).then(image => {
                        console.log(image);
                        var newImgSrc = image
                        if (image.filename && image.filename != null && image.filename != '') {
                            newImgSrc.filename = image.filename
                        } else {
                            let imgUrl = newImgSrc.sourceURL && newImgSrc.sourceURL != null && newImgSrc.sourceURL != '' ? newImgSrc.sourceURL : newImgSrc.path
                            let strName = imgUrl.substring(imgUrl.lastIndexOf('/') + 1)
                            console.log('Name', strName);
                            newImgSrc.filename = strName && strName != '' ? strName : (Moment().unix().toString() + '.jpg')
                        }
                        this.setState({ imageUrl: image.path, fileSource: newImgSrc })
                    });
                } else if (buttonIndex === 1) {
                    ImagePicker.openPicker({
                        // cropping: true,
                        compressImageQuality: 0.7,
                    }).then(image => {
                        console.log(image);
                        var newImgSrc = image
                        if (image.filename && image.filename != null && image.filename != '') {
                            newImgSrc.filename = image.filename
                        } else {
                            let imgUrl = newImgSrc.sourceURL && newImgSrc.sourceURL != null && newImgSrc.sourceURL != '' ? newImgSrc.sourceURL : newImgSrc.path
                            let strName = imgUrl.substring(imgUrl.lastIndexOf('/') + 1)
                            console.log('Name', strName);
                            newImgSrc.filename = strName && strName != '' ? strName : (Moment().unix().toString() + '.jpg')
                        }
                        console.log('Updated', newImgSrc);
                        this.setState({ imageUrl: image.path, fileSource: newImgSrc })
                    });
                }
            }
        )
    }

    /* Presenting ticket options action sheet */
    showOptions() {
        var arrOtherOptions = []
        if (this.state.userProfile && this.state.userProfile.mobile_phone && this.state.userProfile.mobile_phone != '') {
            arrOtherOptions = ["Call Now", "Cancel"]
        } else {
            arrOtherOptions = ["Cancel"]
        }
        let arrFinalOptions = this.state.arrOptions.concat(arrOtherOptions)
        ActionSheet.show({
            // title: 'Options',
            options: arrFinalOptions,
            cancelButtonIndex: arrFinalOptions.length - 1,
        },
            buttonIndex => {
                setTimeout(() => {
                    switch (arrFinalOptions[buttonIndex]) {
                        case 'Add Event':
                            this.props.navigation.push('AddEditEvent', { ticket: this.state.ticketRes });
                            break;
                        case 'Add Time':
                            this.props.navigation.push('AddTime', { ticket: this.state.ticketRes });
                            break;
                        case 'Add Product':
                            this.props.navigation.push('AddEditExpense', { ticket: this.state.ticketRes });
                            break;
                        case `Change ${this.state.endUserTitle}`:
                            this.props.navigation.push('ChangeEndUser', { ticket: this.state.ticketRes });
                            break;
                        case `Transfer ${this.state.ticketTitle}`:
                            this.props.navigation.push('TransferTicket', { ticket: this.state.ticketRes });
                            break;
                        case `Pickup ${this.state.ticketTitle}`:
                            this.pickupTicket()
                            break;
                        case `Close ${this.state.ticketTitle}`:
                            this.props.navigation.push('CloseTicket', { ticket: this.state.ticketRes });
                            break;
                        case `ReOpen ${this.state.ticketTitle}`:
                            this.reopenTicket()
                            break;
                        case 'Call Now':
                            let phoneNumber = this.state.userProfile.mobile_phone;
                            if (Platform.OS === 'android') {
                                phoneNumber = `tel:${this.state.userProfile.mobile_phone}`;
                            } else {
                                phoneNumber = `telprompt:${this.state.userProfile.mobile_phone}`;
                            }
                            Linking.canOpenURL(phoneNumber).then(supported => {
                                if (supported) {
                                    Linking.openURL(phoneNumber);
                                } else {
                                    console.log("Don't know how to open URI: " + phoneNumber);
                                }
                            });
                            break;
                        default:
                            break;
                    }
                }, 100)
            }
        )
    }

    /* Setting selected date to state */
    dateDidChange(date, option) {
        if (option == 'date') {
            var arrItems = this.state.arrCustomFileds
            var isExists = false
            for (let index = 0; index < arrItems.length; index++) {
                const element = arrItems[index];
                if (this.state.selectedItem && this.state.selectedItem.id == element.id) {
                    isExists = true
                    arrItems[index].value = Moment(date).format(DateFormat.YYYYMMDDTHHMMSS)
                }
            }
            if (!isExists) {
                arrItems.push({
                    id: this.state.selectedItem.id,
                    caption: this.state.selectedItem.name,
                    value: Moment(date).format(DateFormat.YYYYMMDDTHHMMSS)
                })
            }
            this.setState({ arrCustomFileds: arrItems, showDatePicker: Platform.OS === 'android' ? false : true })
        }
    }

    /* Hidding(Dismissing) popup screen */
    dismissPopup(option) {
        this.setState({
            showAccountPopup: false,
            showUsersPopup: false,
            showLocationPopup: false,
            showProjectPopup: false,
            showClassPopup: false,
            showCreationCategoryPopup: false,
            showTechPopup: false,
            showToDoTemplatesPopup: false,
            showNextStepPopup: false,
            showSignleSelectionPopup: false,
            showDatePicker: false,
            showMultipleSelectionPopup: false,
        })
    }

    /* Setting state on drop down selection change */
    selectionDidChange(dropDownName, selected, selectedData) {
        if (dropDownName === 'Account') {
            this.setState({
                accountName: selected,
                accountSelected: selectedData,
                userSelected: null,
                locationSelected: null,
                projectSelected: null,
            });
        } else if (dropDownName === 'Users') {
            this.setState({
                selectedUsersDataSource: selectedData
            });
        } else if (dropDownName === 'Locations') {
            this.setState({
                locationSelected: selectedData,
                projectSelected: null,
            });
        } else if (dropDownName === 'Projects') {
            this.setState({
                projectSelected: selectedData,
            });
        } else if (dropDownName === 'Class') {
            this.setState({
                classSelected: selectedData,
            });
            this.fetchCustomfields(selectedData.id, true)
        } else if (dropDownName === 'CreationCategory') {
            this.setState({
                creationCategorySelected: selectedData,
            });
        } else if (dropDownName === 'Tech') {
            this.setState({
                selectedTechsDataSource: selectedData,
            });
        } else if (dropDownName === 'ToDoTemplates') {
            this.setState({ toDoTemplatesSelected: selectedData });
        } else if (dropDownName === 'NextStep') {
            this.saveNextStep(selected, selectedData)
        } else if (dropDownName === 'SignleSelection') {
            console.log('====================================');
            console.log(selectedData);
            console.log('====================================');
            var arrItems = this.state.arrCustomFileds
            var isExists = false
            for (let index = 0; index < arrItems.length; index++) {
                const element = arrItems[index];
                if (this.state.selectedItem.id == element.id) {
                    isExists = true
                    arrItems[index].value = selectedData.value_title
                }
            }
            if (!isExists) {
                arrItems.push({
                    id: this.state.selectedItem.id,
                    caption: this.state.selectedItem.name,
                    value: selectedData.value_title
                })
            }
            this.setState({ arrCustomFileds: arrItems })
        } else if (dropDownName === 'MultipleSelection') {
            console.log('====================================');
            console.log(selectedData);
            console.log('====================================');
            var arrSelected = []
            selectedData.forEach(element => {
                arrSelected.push(element.value_title)
            });

            var arrItems = this.state.arrCustomFileds
            var isExists = false
            for (let index = 0; index < arrItems.length; index++) {
                const element = arrItems[index];
                if (this.state.selectedItem.id == element.id) {
                    isExists = true
                    arrItems[index].value = arrSelected.join(', ')
                }
            }
            if (!isExists) {
                arrItems.push({
                    id: this.state.selectedItem.id,
                    caption: this.state.selectedItem.name,
                    value: arrSelected.join(', ')
                })
            }
            console.log('====================================');
            console.log(arrItems);
            console.log('====================================');
            this.setState({ arrCustomFileds: arrItems })
        }
        this.dismissPopup();
    }

    /* Returns selected options */
    customMultipleSelectionSelectedOption(itemValues) {
        var arrTemp = itemValues.split('\n')
        if (arrTemp.length == 1 && arrTemp[0].includes(',')) {
            arrTemp = itemValues.split(',')
        }

        var arrValues = []
        for (let index = 0; index < arrTemp.length; index++) {
            const element = arrTemp[index];
            if (element.trim() != '') {
                var obj = {}
                obj.id = index
                obj.field_id = this.state.selectedItem.id
                obj.value_title = element.trim();
                arrValues.push(obj)
            }
        }
        console.log('====================================');
        console.log(arrValues);
        console.log('====================================', this.state.multipleSelectionDataSource);
        return arrValues
    }

    /* Rendering popup screen */
    renderDropDownOptions() {
        if (this.state.showAccountPopup) {
            return (
                <AccountSelectionWithLoadMore dataSource={this.state.accountDataSource} dismissPopup={() => this.dismissPopup()} selected={this.state.accountName} selectedData={this.state.accountSelected} selectionDidChange={(selected, selectedData) => { this.selectionDidChange('Account', selected, selectedData); }} />
            )
        } else if (this.state.showUsersPopup) {
            return (
                <ToDoTemplates dataSource={this.state.userDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.selectedUsersDataSource} selectionDidChange={(selected, data) => { this.selectionDidChange('Users', selected, data); }} />
                // <Selection dataSource={this.state.userDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.techSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Users', selected, data); }} />
            )
        } else if (this.state.showLocationPopup) {
            return (
                <Selection dataSource={this.state.locationDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.locationSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Locations', selected, data); }} />
            )
        } else if (this.state.showProjectPopup) {
            return (
                <Selection dataSource={this.state.projectDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.projectSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Projects', selected, data); }} />
            )
        } else if (this.state.showClassPopup) {
            return (
                <Selection dataSource={this.state.classDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.classSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Class', selected, data); }} />
            )
        } else if (this.state.showTechPopup) {
            return (
                <ToDoTemplates dataSource={this.state.techDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.selectedTechsDataSource} selectionDidChange={(selected, data) => { this.selectionDidChange('Tech', selected, data); }} />
                // <Selection dataSource={this.state.techDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.techSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Tech', selected, data); }} />
            )
        } else if (this.state.showCreationCategoryPopup) {
            return (
                <Selection dataSource={this.state.creationCategoryDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.creationCategorySelected} selectionDidChange={(selected, data) => { this.selectionDidChange('CreationCategory', selected, data); }} />
            )
        } else if (this.state.showToDoTemplatesPopup) {
            return (
                <ToDoTemplates dataSource={this.state.toDoTemplatesDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.toDoTemplatesSelectedDataSource} selectionDidChange={(selected, data) => { this.selectionDidChange('ToDoTemplates', selected, data); }} />
                // <Selection dataSource={this.state.toDoTemplatesDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.toDoTemplatesSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('ToDoTemplates', selected, data); }} />
            )
        } else if (this.state.showNextStepPopup) {
            return (
                <NextStep isShowAsModal={true} subject={this.state.ticketRes.subject} step={this.state.ticketRes.next_step} canDismiss={true} dismissPopup={() => this.dismissPopup()} selectionDidChange={(selected, data) => { this.selectionDidChange('NextStep', selected, data); }} />
            )
        } else if (this.state.showSignleSelectionPopup) {
            return (
                <Selection dataSource={this.state.signleSelectionDataSource} selectedData={{ value_title: this.customFiledAnswer(this.state.selectedItem) }} dismissPopup={() => this.dismissPopup()} selectionDidChange={(selected, data) => { this.selectionDidChange('SignleSelection', selected, data); }} />
            )
        } else if (this.state.showDatePicker) {
            console.log('====================================');
            console.log(this.customFiledAnswer(this.state.selectedItem));
            console.log('====================================');
            return (
                <DatePickerView mode='date' minDate={null} maxDate={null} dismissPopup={() => this.dismissPopup()} selectedDate={(this.customFiledAnswer(this.state.selectedItem) != 'null' && this.customFiledAnswer(this.state.selectedItem) != '') ? Moment(this.customFiledAnswer(this.state.selectedItem)) : null} dateDidChange={(date) => { this.dateDidChange(date, 'date'); }} />
            )
        } else if (this.state.showMultipleSelectionPopup) {
            return (
                <ToDoTemplates dataSource={this.state.multipleSelectionDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.customMultipleSelectionSelectedOption(this.customFiledAnswer(this.state.selectedItem))} selectionDidChange={(selected, data) => { this.selectionDidChange('MultipleSelection', selected, data); }} />
            )
        } else {
            return null
        }
    }

    /* Returns selected templates */
    selectedToDoTemplates() {
        var arrToDoTemplates = []
        this.state.toDoTemplatesSelectedDataSource.forEach(element => {
            if (element.name) {
                arrToDoTemplates.push(element.name)
            }
        });
        if (arrToDoTemplates.length > 0) {
            return arrToDoTemplates.join(', ')
        } else {
            return ''
        }
    }

    /* Returns file url */
    urlOfFile(row) {
        if (this.state.ticketRes && (row.item.note.includes('Following file was ') || row.item.note.includes('Following files were '))) {
            // let arr = row.item.note.split(': ')
            var url = ''
            let arrFiles = (this.state.ticketRes.attachments && this.state.ticketRes.attachments.length > 0) ? this.state.ticketRes.attachments : []
            arrFiles.forEach(element => {
                //console.log("1bla-", element.name.slice(0, -3))
                if (!element.is_deleted && row.item.note.includes(element.name.slice(0, -3))) {
                    url = element.url
                    return
                }
            });
            //console.log("UUUUUUUUUUUUUUUU", url)
            return url
        } else {
            //console.log("NOOOOOOOOOOOOOO", url)
            return ''
        }
    }

    /* Returns true if it's image */
    checkIsImageURL(url) {
        if (typeof url !== 'string') return false;
        return (url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi) != null);
    }

    /* Returns true if it's pdf */
    checkIsPdfURL(url) {
        if (typeof url !== 'string') return false;
        return (url.match(/^http[^\?]*.(pdf)(\?(.*))?$/gmi) != null);
    }

    /* Renderig row */
    renderLog(row) {
        var preTextOfResponse = ''
        if (row.item.is_tech_only && row.item.is_waiting) {
            preTextOfResponse = `${this.state.techsTitle} only and waiting on response`
        } else if (row.item.is_tech_only) {
            preTextOfResponse = `${this.state.techsTitle} only response`
        } else if (row.item.is_waiting) {
            preTextOfResponse = `Waiting on response`
        } else {
            // preTextOfResponse = row.item.log_type
        }

        return (
            <Animatable.View>
                <CardItem style={styles.rowLogContainer}>
                    <View style={{ flexDirection: 'row' }}>
                        {row.item.user_firstname && row.item.user_firstname != '' ?
                            <Label style={styles.userNameText}>{row.item.user_firstname + ' ' + row.item.user_lastname}</Label>
                            : null}
                        <Label style={[styles.decriptionText, { marginLeft: Metrics.baseMargin }]}>{Moment(CommonFunctions.utcToLocalTimeZone(row.item.record_date, DateFormat.DDMMMYYYYHMMA)).fromNow()}</Label>
                    </View>
                    {preTextOfResponse != '' ? <Label style={styles.decriptionTextGreen}>{preTextOfResponse}</Label> : null}
                    {this.urlOfFile(row) != '' ?
                        <TouchableOpacity activeOpacity={0.8} style={{ height: 200, width: '100%', marginBottom: Metrics.baseMargin }} onPress={() => {
                            if (this.checkIsImageURL(this.urlOfFile(row))) {
                                this.setState({
                                    visible: true,
                                    images: [{ uri: this.urlOfFile(row) }]
                                })
                            } else if (this.checkIsPdfURL(this.urlOfFile(row))) {
                                const data = { pdf: this.urlOfFile(row) }
                                this.props.navigation.push('PdfViewer', data);
                            }
                        }}>
                            <FastImage style={{ flex: 1, resizeMode: 'cover' }} source={{ uri: this.urlOfFile(row) }} />
                        </TouchableOpacity>
                        : null}
                    <Label selectable key={Math.random()} style={styles.decriptionText}>{row.item.plain_note}</Label>
                    <Label style={[styles.decriptionText, { alignSelf: 'flex-end' }]}>{CommonFunctions.utcToLocalTimeZone(row.item.record_date, DateFormat.DDMMMYYYYHMMA)}</Label>
                </CardItem>
            </Animatable.View>
        )
    }

    /* Filter and returns logs array */
    filterLogs = () => {
        var arrLoop = this.state.ticketRes.ticketlogs && this.state.ticketRes.ticketlogs.length > 0 ? this.state.ticketRes.ticketlogs : []
        if (this.state.selectedTab == 'Reply') {
            var arrReply = []
            arrLoop.forEach(reply => {
                if (reply.log_type == 'Waiting on Response' || reply.log_type == 'Response' || reply.log_type == 'Initial Post') {
                    arrReply.push(reply)
                }
            });
            return arrReply//.reverse()
        } else {
            var arrLogs = []
            arrLoop.forEach(log => {
                if (log.log_type !== 'Waiting on Response' && log.log_type !== 'Response' && log.log_type !== 'Initial Post') {
                    arrLogs.push(log)
                }
            });
            return arrLogs
        }
    }

    /* Rendering email footer with action */
    renderEmailFooter() {
        if (this.state.ticketRes, this.state.emailAddress != '') {
            return (
                <TouchableOpacity style={styles.emailButtonContainer} onPress={() => {
                    Linking.canOpenURL('mailto:' + this.state.emailAddress).then(supported => {
                        if (supported) {
                            Linking.openURL('mailto:' + this.state.emailAddress);
                        } else {
                            console.log("Don't know how to open URI: " + this.state.emailAddress);
                        }
                    });
                }}>
                    <Label style={styles.emailText}>{'Email Address: ' + this.state.emailAddress}</Label>
                </TouchableOpacity>
            )
        } else {
            return <View />
        }
    }

    /* Rendering logs view */
    renderLogsContainer() {
        return (
            <KeyboardAvoidingView style={styles.mainContainer} keyboardVerticalOffset={keyboardVerticalOffset} behavior={behavior}>
                <FlatList
                    ref={(ref) => { this.flatListLogsRef = ref; }}
                    contentContainerStyle={{ paddingTop: Metrics.baseMargin, paddingBottom: Metrics.doubleBaseMargin, }}
                    data={this.filterLogs()}
                    renderItem={(row) => this.renderLog(row)}
                    keyExtractor={(item, index) => index.toString()}
                    // scrollEventThrottle={16} 
                    onScrollEndDrag={(e) => this.handleScroll(e)}
                    onMomentumScrollBegin={(e) => this.handleScrollAndroid(e)}
                    onMomentumScrollEnd={(e) => this.handleScrollAndroid(e)}
                    ListFooterComponent={this.renderEmailFooter()}
                />

            </KeyboardAvoidingView>
        )
    }

    /* Render asign row */
    renderAsign(item) {
        return (
            <Animatable.View style={styles.rowAsignContainer}>
                <View style={styles.asignContainer}>
                    <Label style={styles.asignNameText}>{item.user_fullname}</Label>
                    <Label style={styles.primaryText}>{item.is_primary ? 'Primary' : ''}</Label>
                </View>
                <Label style={styles.asignDateText}>{CommonFunctions.utcToLocalTimeZone(item.start_date, DateFormat.DDMMMYYYYHMMA)}</Label>
            </Animatable.View>
        )
    }

    /* Returns names string */
    nameList(arr) {
        var names = ''
        arr.forEach(element => {
            names += `${names != '' ? ', ' : ''}${element.firstname}`
        });
        return names
    }

    /* Redering asign container */
    renderAsignContainer() {
        return (
            <ScrollView
                scrollEventThrottle={16}
                onScrollEndDrag={this.handleScroll.bind(this)}
                onMomentumScrollBegin={(e) => this.handleScrollAndroid(e)}
                onMomentumScrollEnd={(e) => this.handleScrollAndroid(e)}
                keyboardShouldPersistTaps='handled'
                showsVerticalScrollIndicator={false}>
                <SafeAreaView style={styles.mainContainer}>
                    <View style={[styles.mainContainer, { paddingTop: 30, paddingBottom: 30 }]}>
                        <View>
                            <Label style={[styles.inputTitle, { marginTop: 15 }, styles.placeholderColor]}>{`Alt ${this.state.techniciansTitle}`}</Label>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={[styles.inputContainer, { marginBottom: 15 }, this.state.currentEditingField == 'tech' ? styles.inputActive : styles.inputInactive]}
                                onPress={() => {
                                    if (!this.state.isDisableFields) {
                                        this.fetchTechnicians(true)
                                    }
                                }}>
                                <Input
                                    pointerEvents={'none'}
                                    editable={false}
                                    style={[styles.input, this.state.isDisableFields ? { color: Colors.textGray } : {}]}
                                    placeholder={`Select Alt ${this.state.techniciansTitle}`}
                                    placeholderTextColor={Colors.placeholder}
                                    autoCapitalize='words'
                                    selectionColor={Colors.mainPrimary}
                                    value={this.nameList(this.state.selectedTechsDataSource)}
                                    blurOnSubmit={false}
                                    keyboardAppearance='dark'
                                    returnKeyType={"next"}
                                    onFocus={value => {
                                        this.setState({ currentEditingField: 'tech' })
                                    }}
                                    onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                    ref={input => {
                                        this.techRef = input;
                                    }}
                                    onSubmitEditing={() => {
                                        this.endUsersRef._root.focus();
                                    }}
                                />
                                <Image style={styles.rightIcon} source={Images.downarrow} />
                            </TouchableOpacity>
                        </View>
                        {this.state.ticketRes && this.state.ticketRes.technicians && this.state.ticketRes.technicians.map((item, index) => {
                            return (this.renderAsign(item))
                        })}
                        <View>
                            <Label style={[styles.inputTitle, { marginTop: 15 }, styles.placeholderColor]}>{`Alt ${this.state.endUsersTitle}`}</Label>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={[styles.inputContainer, { marginBottom: 15 }, this.state.currentEditingField == 'endUsers' ? styles.inputActive : styles.inputInactive]}
                                onPress={() => {
                                    if (!this.state.isDisableFields) {
                                        this.fetchUsers(true)
                                    }
                                }}>
                                <Input
                                    pointerEvents={'none'}
                                    editable={false}
                                    style={[styles.input, this.state.isDisableFields ? { color: Colors.textGray } : {}]}
                                    placeholder={`Select Alt ${this.state.endUsersTitle}`}
                                    placeholderTextColor={Colors.placeholder}
                                    autoCapitalize='words'
                                    selectionColor={Colors.mainPrimary}
                                    value={this.nameList(this.state.selectedUsersDataSource)}
                                    // value={`Select Alt ${this.state.endUsersTitle}`}
                                    onChangeText={value => this.setState({ accountType: value })}
                                    blurOnSubmit={false}
                                    keyboardAppearance='dark'
                                    returnKeyType={"next"}
                                    onFocus={value => {
                                        this.setState({ currentEditingField: 'endUsers' })
                                    }}
                                    onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                    ref={input => {
                                        this.endUsersRef = input;
                                    }}
                                    onSubmitEditing={() => {
                                        // this.ticketRef._root.focus();
                                    }}
                                />
                                <Image style={styles.rightIcon} source={Images.downarrow} />
                            </TouchableOpacity>
                        </View>
                        {this.state.ticketRes && this.state.ticketRes.users && this.state.ticketRes.users.map((item, index) => {
                            return (this.renderAsign(item))
                        })}
                        <TouchableOpacity activeOpacity={0.7} style={styles.buttonContainer} onPress={() => {
                            this.btnUpdateTicketPressed()
                        }}>
                            <Text style={styles.buttonText}>{`Update`}</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </ScrollView>
        )
    }

    /* Rendering selected tab */
    renderTabContent() {
        switch (this.state.selectedTab) {
            case 'Reply':
                return this.renderLogsContainer()
                break;
            case 'Logs':
                return this.renderLogsContainer()
                break;
            case 'Assign':
                return this.renderAsignContainer()
                break;
            case 'Time':
                return (<AccountTimes mainState={this} ticket={this.state.ticketRes} />)
                break;
            case 'Expenses':
                return (<AccountExpenses mainState={this} ticket={this.state.ticketRes} />)
                break;
            case 'Notes':
                return (<TicketNotes mainState={this} ticket={this.state.ticketRes} />)
                break;
            case 'Files':
                return (<TicketFiles mainState={this} ticket={this.state.ticketRes} refrashData={!this.state.loading || !this.state.loadingBar} />)
                break;
            case 'ToDos':
                return (<TicketToDos mainState={this} ticket={this.state.ticketRes} />) 
                break;
            case 'Events':
                return (
                    <TicketEvents mainState={this} ticket={this.state.ticketRes} />
                )
                break;
            case 'Assets':
                return (
                    <TicketAssets mainState={this} ticket={this.state.ticketRes} />
                )
                break;
            default:
                return (this.state.loading ?
                    <Animatable.View animation={'fadeIn'} style={styles.noDataContainer}>
                        <Label style={styles.noDataTitleStyle}>
                            {`${this.state.ticketTitle} details will appear here.`}
                        </Label>
                    </Animatable.View> : <View />)
                break;
        }

    }

    /* Rendering row */
    renderTabRow(row) {
        return (
            <Animatable.View useNativeDriver={true} animation={row.item == this.state.selectedTab ? 'zoomIn' : null}>
                <TouchableOpacity
                    style={[styles.rowTabContainer, row.item == this.state.selectedTab ? styles.selectedTab : {}]}
                    onPress={() => {
                        if (!this.state.loading) {
                            Keyboard.dismiss();
                            if (this.sub) {
                                this.subs.forEach((sub) => {
                                    sub.remove();
                                });
                            }
                            // if (!this.props.loading) {
                            this.setState({ selectedTab: row.item })
                            this.flatListTabRef.scrollToIndex({ animated: true, index: row.index, viewPosition: 0.5 })
                            // this.viewWillAppear()
                            // }
                            if (row.item == 'Reply' || row.item == 'Logs') {
                                setTimeout(() => {
                                    if (this.state.selectedTab == 'Reply') {
                                        // this.flatListLogsRef.scrollToEnd({ animated: true })
                                        this.flatListLogsRef.scrollToOffset({ animated: true, offset: 0 })
                                    } else {
                                        this.flatListLogsRef.scrollToOffset({ animated: true, offset: 0 })
                                    }
                                }, 100)
                            }
                        }
                    }}>
                    <Label style={[styles.tabTitle, row.item == this.state.selectedTab ? styles.tabSelectedTitle : {}]}>{row.item}</Label>
                </TouchableOpacity>
            </Animatable.View>
        )
    }

    /* Returns selected custom field answer */
    customFiledAnswer(item) {
        var strAns = ''
        if (this.state.arrCustomFileds && this.state.arrCustomFileds.length > 0) {
            this.state.arrCustomFileds.forEach(element => {
                if (item.id == element.id) {
                    strAns = (element.value && element.value != 'null' && element.value != '') ? element.value : (item.value && item.value != 'null' ? item.value : '')
                }
            });
        } else {
            strAns = (item.value && item.value != 'null' ? item.value : '')
        }
        return strAns
    }

    /* Rendering custom field row */
    renderCustomFiled(item, indx) {
        switch (item.type_id) {
            case 1: //TextBox
                return (
                    <View>
                        <Label style={[styles.inputTitle, { marginTop: 15 }, styles.placeholderColor]}>{item.name}</Label>
                        <View style={[styles.inputContainer, { marginBottom: 15 }, this.state.currentEditingField == `${item.id}` ? styles.inputActive : styles.inputInactive]} >
                            <Input
                                disabled={item.is_disable_user_editing}
                                style={[styles.input, this.state.isDisableFields ? { color: Colors.textGray } : {}]}
                                placeholder={item.name}
                                placeholderTextColor={Colors.placeholder}
                                autoCapitalize='words'
                                selectionColor={Colors.mainPrimary}
                                value={this.customFiledAnswer(item)}
                                onChangeText={(value) => {
                                    if (!item.is_disable_user_editing) {
                                        var arrTemp = this.state.arrCustomFileds && this.state.arrCustomFileds.length > 0 ? this.state.arrCustomFileds : []
                                        var isExists = false
                                        arrTemp.forEach(element => {
                                            if (item.id == element.id) {
                                                isExists = true
                                                element.value = value
                                            }
                                        });
                                        if (!isExists) {
                                            let obj = {
                                                id: item.id,
                                                caption: item.name,
                                                value: value
                                            }
                                            arrTemp.push(obj)
                                        }
                                        this.setState({ arrCustomFileds: arrTemp })
                                    }
                                }}
                                blurOnSubmit={false}
                                keyboardAppearance='dark'
                                // returnKeyType={"next"}
                                onFocus={value => {
                                    this.setState({ currentEditingField: `${item.id}` })
                                }}
                                onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                ref={input => {
                                    // this.resRef = input;
                                }}
                                onSubmitEditing={() => {
                                    // this.ticketRef._root.focus();
                                }}
                            />
                        </View>
                    </View>
                )
                break;
            case 2: //TextArea
                return (
                    <View>
                        <Label style={[styles.inputTitle, { marginTop: 15 }, styles.placeholderColor]}>{item.name}</Label>
                        <View style={[styles.inputContainer, { marginBottom: 15 }, { height: 150, paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10 }, this.state.currentEditingField == `${item.id}` ? styles.inputActive : styles.inputInactive]} >
                            <Textarea style={[styles.input, { height: '100%', width: '100%' }]}
                                // pointerEvents={ this.state.isWorkpadEditingOn ? 'auto' : 'none'}
                                disabled={item.is_disable_user_editing}
                                placeholder='Enter here...'
                                placeholderTextColor={Colors.placeholder}
                                selectionColor={Colors.mainPrimary}
                                value={this.customFiledAnswer(item)}
                                onChangeText={(value) => {
                                    if (!item.is_disable_user_editing) {
                                        var arrTemp = this.state.arrCustomFileds && this.state.arrCustomFileds.length > 0 ? this.state.arrCustomFileds : []
                                        var isExists = false
                                        arrTemp.forEach(element => {
                                            if (item.id == element.id) {
                                                isExists = true
                                                element.value = value
                                            }
                                        });
                                        if (!isExists) {
                                            let obj = {
                                                id: item.id,
                                                caption: item.name,
                                                value: value
                                            }
                                            arrTemp.push(obj)
                                        }
                                        this.setState({ arrCustomFileds: arrTemp })
                                    }
                                }
                                }
                                ref={input => {
                                    this.workpadRef = input;
                                }}
                                blurOnSubmit={false}
                                keyboardAppearance='dark'
                            />
                        </View>
                    </View>
                )
                break;
            case 5: //DateTime
                return (
                    <View>
                        <Label style={[styles.inputTitle, { marginTop: 15 }, styles.placeholderColor]}>{item.name}</Label>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={[styles.inputContainer, { marginBottom: 15 }, this.state.currentEditingField == 'endUsers' ? styles.inputActive : styles.inputInactive]}
                            onPress={() => {
                                if (!item.is_disable_user_editing) {
                                    this.setState({ selectedItem: item, showDatePicker: true })
                                }
                            }}>
                            <Input
                                pointerEvents={'none'}
                                editable={false}
                                style={[styles.input, this.state.isDisableFields ? { color: Colors.textGray } : {}]}
                                placeholder={item.name}
                                placeholderTextColor={Colors.placeholder}
                                autoCapitalize='words'
                                selectionColor={Colors.mainPrimary}
                                value={(this.customFiledAnswer(item) != '' && this.customFiledAnswer(item) != 'null') ? Moment(this.customFiledAnswer(item)).format(DateFormat.DDMMMYYYY) : ''}
                                // value={`Select Alt ${this.state.endUsersTitle}`}
                                onChangeText={value => this.setState({ accountType: value })}
                                blurOnSubmit={false}
                                keyboardAppearance='dark'
                                returnKeyType={"next"}
                                onFocus={value => {
                                    this.setState({ currentEditingField: 'endUsers' })
                                }}
                                onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                ref={input => {
                                    this.dateRef = input;
                                }}
                                onSubmitEditing={() => {
                                    // this.ticketRef._root.focus();
                                }}
                            />
                            <Image style={styles.rightIcon} source={Images.downarrow} />
                        </TouchableOpacity>
                    </View>
                )
                break;
            case 4: //Checkboxes
                return (
                    <View>
                        <Label style={[styles.inputTitle, { marginTop: 15 }, styles.placeholderColor]}>{item.name}</Label>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={[styles.inputContainer, { marginBottom: 15 }, this.state.currentEditingField == 'endUsers' ? styles.inputActive : styles.inputInactive]}
                            onPress={() => {
                                if (!item.is_disable_user_editing) {
                                    var arrTemp = item.choices.split('\n')
                                    var arrValues = []
                                    for (let index = 0; index < arrTemp.length; index++) {
                                        const element = arrTemp[index];
                                        if (element.trim() != '') {
                                            var obj = {}
                                            obj.id = index
                                            obj.field_id = item.id
                                            obj.value_title = element.trim();
                                            arrValues.push(obj)
                                        }
                                    }
                                    this.setState({ selectedItem: item, multipleSelectionDataSource: arrValues, showMultipleSelectionPopup: true })
                                }
                            }}>
                            <Input
                                pointerEvents={'none'}
                                editable={false}
                                style={[styles.input, this.state.isDisableFields ? { color: Colors.textGray } : {}]}
                                placeholder={item.name}
                                placeholderTextColor={Colors.placeholder}
                                autoCapitalize='words'
                                selectionColor={Colors.mainPrimary}
                                value={this.customFiledAnswer(item)}
                                // value={`Select Alt ${this.state.endUsersTitle}`}
                                onChangeText={value => this.setState({ accountType: value })}
                                blurOnSubmit={false}
                                keyboardAppearance='dark'
                                returnKeyType={"next"}
                                onFocus={value => {
                                    this.setState({ currentEditingField: 'endUsers' })
                                }}
                                onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                ref={input => {
                                    this.endUsersRef = input;
                                }}
                                onSubmitEditing={() => {
                                    // this.ticketRef._root.focus();
                                }}
                            />
                            <Image style={styles.rightIcon} source={Images.downarrow} />
                        </TouchableOpacity>
                    </View>
                )
                break;
            case 3: //DropDown
                return (
                    <View>
                        <Label style={[styles.inputTitle, { marginTop: 15 }, styles.placeholderColor]}>{item.name}</Label>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={[styles.inputContainer, { marginBottom: 15 }, this.state.currentEditingField == 'endUsers' ? styles.inputActive : styles.inputInactive]}
                            onPress={() => {
                                if (!item.is_disable_user_editing) {
                                    var arrTemp = item.choices.split('\n')
                                    var arrValues = []
                                    for (let index = 0; index < arrTemp.length; index++) {
                                        const element = arrTemp[index];
                                        if (element.trim() != '') {
                                            var obj = {}
                                            obj.id = index
                                            obj.field_id = item.id
                                            obj.value_title = element.trim();
                                            arrValues.push(obj)
                                        }
                                    }
                                    this.setState({ selectedItem: item, signleSelectionDataSource: arrValues, showSignleSelectionPopup: true })
                                }
                            }}>
                            <Input
                                pointerEvents={'none'}
                                editable={false}
                                style={[styles.input, this.state.isDisableFields ? { color: Colors.textGray } : {}]}
                                placeholder={item.name}
                                placeholderTextColor={Colors.placeholder}
                                autoCapitalize='words'
                                selectionColor={Colors.mainPrimary}
                                value={this.customFiledAnswer(item)}
                                // value={`Select Alt ${this.state.endUsersTitle}`}
                                onChangeText={value => this.setState({ accountType: value })}
                                blurOnSubmit={false}
                                keyboardAppearance='dark'
                                returnKeyType={"next"}
                                onFocus={value => {
                                    this.setState({ currentEditingField: 'endUsers' })
                                }}
                                onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                ref={input => {
                                    this.endUsersRef = input;
                                }}
                                onSubmitEditing={() => {
                                    // this.ticketRef._root.focus();
                                }}
                            />
                            <Image style={styles.rightIcon} source={Images.downarrow} />
                        </TouchableOpacity>
                    </View>
                )
                break;
            case 6: //DropDownMulti
                return (
                    <View>
                        <Label style={[styles.inputTitle, { marginTop: 15 }, styles.placeholderColor]}>{item.name}</Label>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={[styles.inputContainer, { marginBottom: 15 }, this.state.currentEditingField == 'endUsers' ? styles.inputActive : styles.inputInactive]}
                            onPress={() => {
                                if (!item.is_disable_user_editing) {
                                    var arrTemp = item.choices.split('\n')
                                    var arrValues = []
                                    for (let index = 0; index < arrTemp.length; index++) {
                                        const element = arrTemp[index];
                                        if (element.trim() != '') {
                                            var obj = {}
                                            obj.id = index
                                            obj.field_id = item.id
                                            obj.value_title = element.trim();
                                            arrValues.push(obj)
                                        }
                                    }
                                    this.setState({ selectedItem: item, multipleSelectionDataSource: arrValues, showMultipleSelectionPopup: true })
                                }
                            }}>
                            <Input
                                pointerEvents={'none'}
                                editable={false}
                                style={[styles.input, this.state.isDisableFields ? { color: Colors.textGray } : {}]}
                                placeholder={item.name}
                                placeholderTextColor={Colors.placeholder}
                                autoCapitalize='words'
                                selectionColor={Colors.mainPrimary}
                                value={this.customFiledAnswer(item)}
                                // value={`Select Alt ${this.state.endUsersTitle}`}
                                onChangeText={value => this.setState({ accountType: value })}
                                blurOnSubmit={false}
                                keyboardAppearance='dark'
                                returnKeyType={"next"}
                                onFocus={value => {
                                    this.setState({ currentEditingField: 'endUsers' })
                                }}
                                onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                ref={input => {
                                    this.endUsersRef = input;
                                }}
                                onSubmitEditing={() => {
                                    // this.ticketRef._root.focus();
                                }}
                            />
                            <Image style={styles.rightIcon} source={Images.downarrow} />
                        </TouchableOpacity>
                    </View>
                )
                break;
            default:
                return (
                    <View />
                )
                break;
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
                        showTitle={this.state.ticketRes && this.state.ticketRes.number ? `${this.state.ticketTitle} #${this.state.ticketRes.number}` : (this.state.ticket && this.state.ticket.number ? `${this.state.ticketTitle} #${this.state.ticket.number}` : `${this.state.ticketTitle} Details`)}
                        rightImage={Images.shareW}
                        hideRightButton={false}
                        rightButton={() => {
                            if (this.state.ticket) {
                                CommonFunctions.retrieveData(UserDataKeys.Org)
                                    .then((org) => {
                                        let objOrg = JSON.parse(org)
                                        if (objOrg && objOrg.instances && objOrg.instances.length > 0) {
                                            var strUrl = `${ApiHelper.WebBaseUrl}login/?tkt=` + `${this.state.ticket.key}&dept=${objOrg.instances[0].key}&org=${objOrg.key}`
                                            try {
                                                const result = Share.share({
                                                    //  title:  this.state.ticketRes.subject,
                                                    message: Platform.OS == 'ios' ? '' : strUrl,
                                                    url: strUrl
                                                });
                                                if (result.action === Share.sharedAction) {
                                                    if (result.activityType) {
                                                        // shared with activity type of result.activityType
                                                    } else {
                                                        // shared
                                                    }
                                                } else if (result.action === Share.dismissedAction) {
                                                    // dismissed
                                                }
                                            } catch (error) {
                                                Linking.canOpenURL(strUrl).then(supported => {
                                                    if (supported) {
                                                        Linking.openURL(strUrl);
                                                    } else {
                                                        console.log("Don't know how to open URI: " + strUrl);
                                                    }
                                                });
                                            }
                                        }
                                    })
                            }
                        }
                        }
                    />
                </SafeAreaView>
                <ImageView
                    swipeToCloseEnabled={Platform.OS == 'android' ? false : true}
                    images={this.state.images}
                    imageIndex={0}
                    visible={this.state.visible}
                    onRequestClose={() => this.setState({ visible: false })}
                />
                <LoaderBar show={this.state.loadingBar} />
                {this.renderDropDownOptions()}
                {this.state.selectedTab != '' && this.state.ticket ?
                    <View style={styles.statusContainer}>
                        <Label style={[styles.subjectText, { flex: 1 }]}>{this.state.ticketRes && this.state.ticketRes.number ? `${this.state.ticketRes.status}` : (this.state.ticket && this.state.ticket.number ? `${this.state.ticket.status}` : '')}</Label>
                        <TouchableOpacity style={styles.actionButton} onPress={() => {
                            this.showOptions()
                        }}>
                            <Label style={styles.actionButtonText}>Action</Label>
                        </TouchableOpacity>
                    </View>
                    : null}
                {this.state.selectedTab != '' && this.state.ticket && !this.state.isInfoHiddens ?
                    //'flipInX' : 'flipOutX'
                    <Animatable.View duration={500} animation={!this.state.isInfoHidden ? 'pulse' : 'zoomOut'} onAnimationEnd={() => {
                        if (this.state.isInfoHidden) {
                            this.setState({ isInfoHiddens: true })
                        }
                    }} style={styles.topContainer}>
                        <TouchableOpacity activeOpacity={0.7} style={styles.titleContainer} onPress={() => {
                            this.setState({
                                isInfoExpanded: !this.state.isInfoExpanded
                            })
                        }}>
                            <View style={styles.titleInfoContainer}>
                                <Label style={[styles.subjectText, this.state.isInfoExpanded ? {} : { height: 24 }]}>{this.state.ticketRes.subject}</Label>
                                {this.state.ticketRes && this.state.ticketRes.next_step ?
                                    <Label style={[styles.nextStepText, this.state.isInfoExpanded ? {} : { height: 20 }]}>{`Next Step: ${this.state.ticketRes.next_step}${this.state.ticketRes.next_step_date && this.state.ticketRes.next_step_date != null ? (' - ' + Moment(CommonFunctions.utcToLocalTimeZone(this.state.ticketRes.next_step_date, DateFormat.DDMMMYYYYHMMA)).fromNow()) : ''}`}</Label>
                                    : null}
                            </View>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => {
                                this.setState({
                                    isInfoExpanded: !this.state.isInfoExpanded
                                })
                            }}>
                                <Image style={styles.infoExpandCollIcon} source={this.state.isInfoExpanded ? Images.dropdownUpW : Images.dropdownW} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                        {this.state.isInfoExpanded ?
                            <Animatable.View animation={'pulse'} style={styles.infoParentContainer}>
                                {this.state.ticketRes.class_name && this.state.ticketRes.class_name != '' ?
                                    <View style={styles.infoContainer}>
                                        <Label style={styles.infoTitleText}>Class</Label>
                                        <Label style={styles.infoDecriptionText}>{this.state.ticketRes.class_name}</Label>
                                    </View>
                                    : null}
                                {this.state.ticketRes.tech_firstname && this.state.ticketRes.tech_firstname != '' ?
                                    <View style={styles.infoContainer}>
                                        <Label style={styles.infoTitleText}>{this.state.techTitle}</Label>
                                        <Label style={styles.infoDecriptionText}>{this.state.ticketRes.tech_firstname + ' ' + this.state.ticketRes.tech_lastname}</Label>
                                    </View>
                                    : null}
                                {this.state.ticketRes.user_firstname && this.state.ticketRes.user_firstname != '' ?
                                    <View style={styles.infoContainer}>
                                        <Label style={styles.infoTitleText}>{this.state.userTitle}</Label>
                                        <Label style={styles.infoDecriptionText}>{this.state.ticketRes.user_firstname + ' ' + this.state.ticketRes.user_lastname}</Label>
                                    </View>
                                    : null}
                                {this.state.ticketRes.account_name && this.state.ticketRes.account_name != '' ?
                                    <View style={styles.infoContainer}>
                                        <Label style={styles.infoTitleText}>{this.state.acctTitle}</Label>
                                        <Label style={styles.infoDecriptionText}>{this.state.ticketRes.account_name}</Label>
                                    </View>
                                    : null}
                                {this.state.ticketRes.location_name && this.state.ticketRes.location_name != '' ?
                                    <View style={styles.infoContainer}>
                                        <Label style={styles.infoTitleText}>{this.state.locTitle}</Label>
                                        <Label style={styles.infoDecriptionText}>{this.state.ticketRes.location_name}</Label>
                                    </View>
                                    : null}
                                    {this.state.ticketRes.board_list_name && this.state.ticketRes.board_list_name != '' ?
                                    <View style={styles.infoContainer}>
                                        <Label style={styles.infoTitleText}>Board</Label>
                                        <Label style={styles.infoDecriptionText}>{this.state.ticketRes.board_list_name}</Label>
                                    </View>
                                    : null}
                                     {this.state.ticketRes.level_name && this.state.ticketRes.level_name != '' ?
                                    <View style={styles.infoContainer}>
                                        <Label style={styles.infoTitleText}>Level</Label>
                                        <Label style={styles.infoDecriptionText}>{this.state.ticketRes.level_name}</Label>
                                    </View>
                                    : null}
                                    {this.state.ticketRes.priority_name && this.state.ticketRes.priority_name != '' ?
                                    <View style={styles.infoContainer}>
                                        <Label style={styles.infoTitleText}>Priority</Label>
                                        <Label style={styles.infoDecriptionText}>{this.state.ticketRes.priority_name}</Label>
                                    </View>
                                    : null}
                                   
                                {this.state.ticketRes.total_hours && this.state.ticketRes.total_hours != '' ?
                                    <View style={styles.infoContainer}>
                                        <Label style={styles.infoTitleText}>Total Hours</Label>
                                        <Label style={styles.infoDecriptionText}>{this.state.ticketRes.total_hours}</Label>
                                    </View>
                                    : null}
                                {this.state.ticketRes.misc_cost && this.state.ticketRes.misc_cost != '' ?
                                    <View style={styles.infoContainer}>
                                        <Label style={styles.infoTitleText}>Expenses</Label>
                                        <Label style={styles.infoDecriptionText}>{`$${this.state.ticketRes.misc_cost}`}</Label>
                                    </View>
                                    : null}
                                {this.state.ticketRes.sla_complete_date && this.state.ticketRes.sla_complete_date != '' ?
                                    <View style={styles.infoContainer}>
                                        <Label style={styles.infoTitleText}>SLA</Label>
                                        <Label style={styles.infoDecriptionText}>{CommonFunctions.utcToLocalTimeZone(this.state.ticketRes.sla_complete_date, DateFormat.DDMMMYYYYHMMA)}</Label>
                                    </View>
                                    : null}
                                <View style={styles.infoContainer}>
                                    <Label style={styles.infoTitleText}></Label>
                                    {/* <Label style={[styles.infoDecriptionText, { color: Colors.snow50 }]}>{Moment(CommonFunctions.utcToLocalTimeZone(this.state.ticketRes.created_time, DateFormat.DDMMMYYYYHMMA)).fromNow()}</Label> */}
                                    <Label style={[styles.infoDecriptionText, { color: Colors.snow50 }]}>{this.state.ticketRes.days_old + ' ago'}</Label>
                                </View>
                                <TouchableOpacity activeOpacity={0.7} style={styles.editButtonContainer} onPress={() => {
                                    // this.setState({
                                    //     showNextStepPopup: true
                                    // })
                                    this.props.navigation.push('AddEditTicket', { ticket: this.state.ticketRes, customfields: this.state.customfieldsDataSource, ansCustomFileds: this.state.arrCustomFileds });
                                }}>
                                    <View style={styles.editContainer}>
                                        <Image style={styles.rightIcon} source={Images.editIcon} />
                                        <Text style={styles.editButtonText}>{`Edit ${this.state.ticketTitle}`}</Text>
                                    </View>
                                </TouchableOpacity>
                            </Animatable.View> : null}
                    </Animatable.View>
                    : null}
                {this.state.selectedTab != '' && this.state.dataSourceTabs.length > 0 ?
                    <Animatable.View animation={'fadeIn'} style={styles.flatListTabContainer}>
                        <FlatList
                            horizontal
                            ref={(ref) => { this.flatListTabRef = ref; }}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.flatListTabPadding}
                            data={this.state.dataSourceTabs}
                            renderItem={(row) => this.renderTabRow(row)}
                            keyExtractor={(item, index) => index.toString()}
                            keyboardShouldPersistTaps='handled'
                        />
                    </Animatable.View> : null}
                <View style={[styles.contentContainer, this.state.selectedTab == 'Reply' ? { paddingBottom: Metrics.baseMargin } : {}]}>
                    <SafeAreaView style={styles.mainContainer}>
                        <View style={styles.mainContainer}>
                            {this.renderTabContent()}
                        </View>
                    </SafeAreaView>

                </View>
                {this.state.selectedTab == 'Reply' ?
                    <View keyboardShouldPersistTaps='handled' style={[styles.messageInputContainer, this.state.isExpandOn ? { height: null, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 } : {}]}>
                        <SafeAreaView />
                        <View style={styles.messageInputSubContainer}>
                            <Input
                                multiline={true}
                                style={[styles.input, { alignSelf: 'flex-start' }]}
                                placeholder={'Write comment'}
                                selectionColor={Colors.mainPrimary}
                                placeholderTextColor={Colors.placeholder}
                                value={this.state.message}
                                onChangeText={value => this.setState({ message: value })}
                                ref={input => {
                                    this.msgRef = input;
                                }}
                            />
                            <TouchableOpacity onPress={() => {
                                this.setState({ isExpandOn: !this.state.isExpandOn })
                                setTimeout(() => {
                                    this.msgRef._root.focus()
                                }, 200)
                            }}>
                                <Image style={styles.sendIcon} source={this.state.isExpandOn ? Images.collapse : Images.expand} />
                            </TouchableOpacity>
                        </View>
                        {this.state.fileSource ?
                            <View style={styles.responseButtonsConatiner}>
                                <Label style={styles.nameText}>{this.state.fileSource.filename}</Label>
                                <TouchableOpacity onPress={() => {
                                    this.setState({ fileSource: null })
                                }}>
                                    <Image style={styles.removeFileIcon} source={Images.remove} />
                                </TouchableOpacity>
                            </View>
                            : null}
                        <View style={styles.responseButtonsConatiner}>
                            <View style={styles.responseOptionsConatiner}>
                                <TouchableOpacity style={[styles.optionButton, this.state.isTechsOnly ? styles.selectedOptionButton : {}]} onPress={() => {
                                    this.setState({ isTechsOnly: !this.state.isTechsOnly })
                                }}>
                                    <Label style={[styles.responseOptionText, this.state.isTechsOnly ? styles.selectedOptionText : {}]}>{`${this.state.techsTitle} Only`}</Label>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.optionButton, this.state.isWaitingOn ? styles.selectedOptionButton : {}]} onPress={() => {
                                    this.setState({ isWaitingOn: !this.state.isWaitingOn })
                                }}>
                                    <Label style={[styles.responseOptionText, this.state.isWaitingOn ? styles.selectedOptionText : {}]}>{`Waiting On`}</Label>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.responseMediaButtonsConatiner}>
                                <TouchableOpacity onPress={() => { this.changeFilePicture(); }}>
                                    <Image style={styles.sendIcon} source={Images.attachment} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    if ((this.state.message && this.state.message.trim() != '') || this.state.fileSource) {
                                        if (this.state.fileSource) {
                                            this.uploadFile()
                                        } else {
                                            this.onSendBtnPress();
                                        }
                                    } else {
                                        this.setState({ message: '' })
                                        setTimeout(() => {
                                            this.msgRef._root.focus()
                                        }, 200)
                                    }
                                }}>
                                    <Image style={styles.sendIcon} source={Images.send} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <SafeAreaView />
                    </View>
                    : null}
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
export default connect(mapStateToProps)(TicketDetails);