/* Imports */
import React, { Component } from 'react'
import { ScrollView, Image, View, TouchableOpacity, Platform, StatusBar, SafeAreaView, Text, Keyboard } from 'react-native'
import { Container, Label, Input, Toast, Textarea, ActionSheet } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import Moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import { parseString } from 'react-native-xml2js';

import ValidationHelper from '../../../Components/ValidationHelper';
import CommonFunctions from '../../../Components/CommonFunctions';
import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Images, Colors, Metrics } from '../../../Themes';
import LinearGradient from 'react-native-linear-gradient';
import ApiHelper from '../../../Components/ApiHelper';
import Loader from '../../../Components/Loader';
import { DateFormat, UserDataKeys } from '../../../Components/Constants';
import Selection from '../Selection';
import ToDoTemplates from './ToDoTemplates';
import AccountSelectionWithLoadMore from '../AccountSelectionWithLoadMore';

// Styless
import styles from './Styles/AddEditTicketStyles'

class AddEditTicket extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            accountSelected: null,
            userSelected: null,
            assetSelected: null,
            locationSelected: null,
            projectSelected: null,
            classSelected: null,
            creationCategorySelected: null,
            techSelected: null,
            toDoTemplatesSelected: null,
            toDoTemplatesSelectedDataSource: [],
            subject: '',
            step: '',
            details: '',
            fileSource: null,
            showAccountPopup: false,
            accountDataSource: [],
            showUsersPopup: false,
            showAssetPopup: false,
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
            ticketsTitle: 'Tickets',
            ticketTitle: 'Ticket',
            accountTitle: 'Account',
            accountsTitle: 'Accounts',
            techTitle: 'Tech',
            techsTitle: 'Technicians',
            technicianTitle: 'Technician',
            userTitle: 'End User',
            endUsersTitle: 'End Users',
            locationsTitle: 'Locations',
            locationTitle: 'Location',
            ticket: null,
            isEdit: false,
            isDisableFields: false,
            customfieldsDataSource: [],
            showSignleSelectionPopup: false,
            signleSelectionDataSource: [],
            showDatePicker: false,
            showMultipleSelectionPopup: false,
            multipleSelectionDataSource: [],
            selectedItem: null,
            arrCustomFileds: [],
            boardSelected: null,
            showBoardPopup: false,
            boardDataSource: [],
            levelSelected: null,
            showLevelPopup: false,
            levelDataSource: [],
            prioritySelected: null,
            showPriorityPopup: false,
            priorityDataSource: [],
        };
    }

    componentDidMount() {
        this.setState({
            loading: false,
            accountSelected: null,
            userSelected: null,
            assetSelected: null,
            locationSelected: null,
            projectSelected: null,
            classSelected: null,
            creationCategorySelected: null,
            techSelected: null,
            toDoTemplatesSelected: null,
            toDoTemplatesSelectedDataSource: [],
            subject: '',
            step: '',
            details: '',
            fileSource: null,
            showAccountPopup: false,
            accountDataSource: [],
            showUsersPopup: false,
            showAssetPopup: false,
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
            ticketsTitle: 'Tickets',
            ticketTitle: 'Ticket',
            accountTitle: 'Account',
            accountsTitle: 'Accounts',
            techTitle: 'Tech',
            techsTitle: 'Technicians',
            technicianTitle: 'Technician',
            userTitle: 'End User',
            endUsersTitle: 'End Users',
            locationsTitle: 'Locations',
            locationTitle: 'Location',
            ticket: null,
            isEdit: false,
            isDisableFields: false,
            customfieldsDataSource: [],
            showSignleSelectionPopup: false,
            signleSelectionDataSource: [],
            showDatePicker: false,
            showMultipleSelectionPopup: false,
            multipleSelectionDataSource: [],
            selectedItem: null,
            arrCustomFileds: [],
            boardSelected: null,
            showBoardPopup: false,
            boardDataSource: [],
            levelSelected: null,
            showLevelPopup: false,
            levelDataSource: [],
            prioritySelected: null,
            showPriorityPopup: false,
            priorityDataSource: [],
        });

        CommonFunctions.retrieveData(UserDataKeys.Config)
            .then((response) => {
                let config = JSON.parse(response)
                var ticketsTitle = 'Tickets'
                var ticketTitle = 'Ticket'
                var accountTitle = 'Account'
                var accountsTitle = 'Accounts'
                var techTitle = 'Tech'
                var techsTitle = 'Technicians'
                var technicianTitle = 'Technician'
                var userTitle = 'End User'
                var locationsTitle = 'Locations'
                var locationTitle = 'Location'
                var endUsersTitle = 'End Users'


                if (config.is_customnames) {
                    ticketsTitle = config.names.ticket.p ?? 'Tickets'
                    ticketTitle = config.names.ticket.s ?? 'Ticket'
                    accountsTitle = config.names.account.p ?? 'Accounts'
                    accountTitle = config.names.account.s ?? 'Account'
                    techsTitle = config.names.tech.p ?? 'Technicians'
                    technicianTitle = config.names.tech.s ?? 'Technician'
                    techTitle = config.names.tech.a ?? 'Tech'
                    userTitle = config.names.user.s ?? 'End User'
                    endUsersTitle = config.names.user.p ?? 'End Users'
                    locationsTitle = config.names.location.p ?? 'Locations'
                    locationTitle = config.names.location.s ?? 'Location'
                }

                this.setState({
                    ticketsTitle,
                    ticketTitle,
                    accountsTitle,
                    accountTitle,
                    techsTitle,
                    techTitle,
                    technicianTitle,
                    userTitle,
                    endUsersTitle,
                    locationsTitle,
                    locationTitle,
                })
            })

        if (this.props.navigation.state.params !== undefined) {
            if (this.props.navigation.state.params.ticket !== undefined) {
                this.setState({ ticket: this.props.navigation.state.params.ticket, isEdit: true })
            }

            if (this.props.navigation.state.params.asset !== undefined) {
                this.setState({ assetSelected: this.props.navigation.state.params.asset})
            }

            if (this.props.navigation.state.params.customfields !== undefined) {
                this.setState({ customfieldsDataSource: this.props.navigation.state.params.customfields })
            }

            if (this.props.navigation.state.params.ansCustomFileds !== undefined) {
                this.setState({ arrCustomFileds: this.props.navigation.state.params.ansCustomFileds })
            }

        }

        setTimeout(() => {
            if (this.state.ticket) {
                this.setState({
                    isEdit: true,
                    subject: this.state.ticket.subject,
                    step: this.state.ticket.next_step,
                    details: this.state.ticket.details,
                    // isDisableFields: (this.state.ticket.project_id || this.state.ticket.ticket_id),

                    accountSelected: {
                        id: this.state.ticket.account_id ? this.state.ticket.account_id : undefined,
                        name: this.state.ticket.account_name ? this.state.ticket.account_name : 'Default',
                        value_title: this.state.ticket.account_name,
                    },
                    boardSelected: {
                        id: this.state.ticket.board_list_id ? this.state.ticket.board_list_id : undefined,
                        name: this.state.ticket.board_list_name ? this.state.ticket.board_list_name : '',
                        value_title: this.state.ticket.board_list_name,
                    },
                    levelSelected: {
                        id: this.state.ticket.level_id ? this.state.ticket.level_id : undefined,
                        name: this.state.ticket.level_name ? this.state.ticket.level_name : 'Default',
                        value_title: this.state.ticket.level_name,
                    },
                    prioritySelected: {
                        id: this.state.ticket.priority_id ? this.state.ticket.priority_id : undefined,
                        name: this.state.ticket.priority_name ? this.state.ticket.priority_name : 'Default',
                        value_title: this.state.ticket.priority_name,
                    },
                    locationSelected: {
                        id: this.state.ticket.location_id ? this.state.ticket.location_id : undefined,
                        name: this.state.ticket.location_name ? this.state.ticket.location_name : 'Default',
                        value_title: this.state.ticket.location_name,
                    },
                    projectSelected: {
                        id: this.state.ticket.project_id ? this.state.ticket.project_id : undefined,
                        name: this.state.ticket.project_name ? this.state.ticket.project_name : 'Default',
                        value_title: this.state.ticket.project_name,
                    },
                    classSelected: {
                        id: this.state.ticket.class_id ? this.state.ticket.class_id : undefined,
                        name: this.state.ticket.class_name ? this.state.ticket.class_name : 'Default',
                        value_title: this.state.ticket.class_name,
                    },
                    techSelected: {
                        id: this.state.ticket.tech_id ? this.state.ticket.tech_id : undefined,
                        firstname: this.state.ticket.tech_firstname ? this.state.ticket.tech_firstname : 'Default',
                        lastname: this.state.ticket.tech_lastname ? this.state.ticket.tech_lastname : '',
                        email: this.state.ticket.tech_email,
                        value_title: `${this.state.ticket.tech_firstname} ${this.state.ticket.tech_lastname} (${this.state.ticket.user_email})`,
                    },
                    userSelected: {
                        id: this.state.ticket.user_id ? this.state.ticket.user_id : undefined,
                        firstname: this.state.ticket.user_firstname ? this.state.ticket.user_firstname : 'Default',
                        lastname: this.state.ticket.user_lastname ? this.state.ticket.user_lastname : '',
                        email: this.state.ticket.user_email,
                        value_title: `${this.state.ticket.user_firstname} ${this.state.ticket.user_lastname} (${this.state.ticket.user_email})`,
                    },
                    assetSelected: {
                        id: (this.state.ticket.assets || []).length > 0 ? this.state.ticket.assets[0].id : undefined,
                        name: (this.state.ticket.assets || []).length > 0 ? this.state.ticket.assets[0].name : (this.state.ticket.assets ? this.state.ticket.assets[0].serial_tag_number : 'Default'),
                        value_title: (this.state.ticket.assets || []).length > 0 ? this.state.ticket.assets[0].name : (this.state.ticket.assets ? this.state.ticket.assets[0].serial_tag_number : 'Default'),
                    },
                    creationCategorySelected: {
                        id: this.state.ticket.creation_category_id ? this.state.ticket.creation_category_id : undefined,
                        name: this.state.ticket.creation_category_name ? this.state.ticket.creation_category_name : 'Default',
                        value_title: this.state.ticket.creation_category_name,
                    },
                })
                if (this.state.ticket && this.state.ticket.class_id && (this.state.customfieldsDataSource == null || this.state.customfieldsDataSource == undefined || this.state.customfieldsDataSource.length == 0)) {
                    this.fetchCustomfields(this.state.ticket.class_id)
                }

                if (this.state.arrCustomFileds == null || this.state.arrCustomFileds == undefined || this.state.arrCustomFileds.length == 0) {
                    parseString(this.state.ticket.customfields_xml, { explicitArray: false, mergeAttrs: true }, (err, result) => {
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
                }
            }

        }, 100)

        this.viewWillAppear()
        this.props.navigation.addListener('didFocus', this.viewWillAppear)
        // this.fetchAccounts(false)
        console.log('Time====================================');
        console.log(Moment().unix().toString());
        console.log('====================================');
    }

    viewWillAppear = () => {
        if (this.props.navigation.state.params !== undefined) {
            if (this.props.navigation.state.params.techSelected !== undefined) {
                this.setState({ techSelected: this.props.navigation.state.params.techSelected })
            }
            if (this.props.navigation.state.params.userSelected !== undefined) {
                this.selectionDidChange("Users", null, this.props.navigation.state.params.userSelected)
                //this.setState({ userSelected: this.props.navigation.state.params.userSelected })
            }
            if (this.props.navigation.state.params !== undefined) {
                if (this.props.navigation.state.params.assetSelected !== undefined) {
                    this.selectionDidChange('Asset', null, this.props.navigation.state.params.assetSelected)
                }
            }
        }
    }

    componentWillUnmount() {
        Keyboard.dismiss();
    }

    //Actions

    /* Validating information and calling create in api */
    btnAddTicketPressed() {
        /* Checking validation if it's valid calling API*/
        if (this.isValid()) {
            Keyboard.dismiss();

            var strXML = '<root>'
            this.state.arrCustomFileds.forEach(element => {
                strXML += `<field id="${element.id}"><caption>${element.caption}</caption><value>${element.value}</value></field>`
            });
            strXML += `</root>`
            console.log('====================================');
            console.log(strXML);
            console.log('====================================');

            var obj = {
                c:1, 
                'subject': this.state.subject,
                'initial_post': this.state.details,
                'class_id': 0,
                'account_id': -1,
                'location_id': 0,
                'user_id': this.state.userSelected.id,
                'attach_assets': 0,
                'tech_id': 0,
                'default_contract_id': 0,
                'priority_id': 0,
                'estimated_time': '0.00',
                'in_progress': Moment().unix().toString(),
                'todos_id': 0,
                'level': 0,
                'customfields_xml': strXML,
                'default_contract_name': 'Choose',
                'creation_category_id': 0,
                'creation_category_name': 'Default',
                'submission_category': 'Choose',
                'todo_templates': 0,
                'status': 'open',
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

            if (this.state.userSelected && this.state.userSelected.id != null && this.state.userSelected.id != undefined) {
                obj.user_id = this.state.userSelected.id
            }

            if (this.state.assetSelected && this.state.assetSelected.id != null && this.state.assetSelected.id != undefined) {
                obj.attach_assets = this.state.assetSelected.id
            }

            if (this.state.techSelected && this.state.techSelected.id != null && this.state.techSelected.id != undefined) {
                obj.tech_id = this.state.techSelected.id
            }

            if (this.state.boardSelected && this.state.boardSelected.id != null && this.state.boardSelected.id != undefined) {
                obj.board_list_id = this.state.boardSelected.id
            }

            if (this.state.levelSelected && this.state.levelSelected.id != null && this.state.levelSelected.id != undefined) {
                obj.level_id = this.state.levelSelected.id
            }

            if (this.state.prioritySelected && this.state.prioritySelected.id != null && this.state.prioritySelected.id != undefined) {
                obj.priority_id = this.state.prioritySelected.id
            }


            var arrToDoTemplates = []
            this.state.toDoTemplatesSelectedDataSource.forEach(element => {
                if (element.id) {
                    arrToDoTemplates.push(element.id)
                }
            });
            if (arrToDoTemplates.length > 0) {
                obj.todos_id = arrToDoTemplates.join(', ')
                obj.todo_templates = arrToDoTemplates.join(', ')
            }

            if (this.state.projectSelected && this.state.projectSelected.id != null && this.state.projectSelected.id != undefined) {
                obj.project_id = this.state.projectSelected.id
            }

            if (this.state.creationCategorySelected && this.state.creationCategorySelected.id != null && this.state.creationCategorySelected.id != undefined) {
                obj.creation_category_id = this.state.creationCategorySelected.id
                obj.creation_category_name = this.state.creationCategorySelected.name
            }

            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))

            ApiHelper.postWithParam(ApiHelper.Apis.Tickets, obj, this, true, authHeader)
                .then((response) => {
                    if (this.state.fileSource) {
                        this.uploadFile(response)
                    } else {
                        this.props.navigation.goBack();
                        Toast.show({
                            text: `${this.state.ticketTitle} has been added successfully.`,
                            position: 'top',
                            duration: 3000,
                            type: 'success',
                            style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
                        })
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
                    } else {
                        ApiHelper.handleErrorAlert(response)
                    }
                });
        }
    }


    /* Validating information and calling update api */
    btnUpdateNextStepAndTicketPressed() {
        /* Checking validation if it's valid calling API*/
        if (this.isValidEditMode()) {
            Keyboard.dismiss();

            if (this.state.ticket.subject != this.state.subject || this.state.ticket.next_step != this.state.step) {
                let obj = {
                    'action': 'subject',
                    'subject': this.state.subject,
                    'next_step': this.state.step,
                }

                let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))

                ApiHelper.postWithParam(ApiHelper.Apis.Tickets + `/${this.state.ticket.key}`, obj, this, true, authHeader)
                    .then((response) => {
                        Toast.show({
                            text: `Subject has been updated successfully.`,
                            position: 'top',
                            duration: 3000,
                            type: 'success',
                            style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
                        })
                        var obj = this.state.ticket
                        obj.subject = this.state.subject
                        obj.next_step = this.state.step
                        obj.next_step_date = Moment().utc().format(DateFormat.YYYYMMDDTHHMMSS)
                        this.setState({ ticket: obj })
                        this.btnUpdateTicketPressed()
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
                        this.btnUpdateTicketPressed()
                    });
            } else {
                this.btnUpdateTicketPressed()
            }
        }
    }

    /* Validating information and calling update api */
    btnUpdateTicketPressed() {
        /* Checking validation if it's valid calling API*/
        if (this.isValidEditMode()) {
            Keyboard.dismiss();

            var strXML = '<root>'
            this.state.arrCustomFileds.forEach(element => {
                strXML += `<field id="${element.id}"><caption>${element.caption}</caption><value>${element.value}</value></field>`
            });
            strXML += `</root>`
            console.log('====================================');
            console.log(strXML);
            console.log('====================================');

            var obj = {
                'class_id': 0,
                'account_id': -1,
                'location_id': 0,
                'project_id': 0,
                'user_id': this.state.ticket.user_id ? this.state.ticket.user_id : 0,
                'tech_id': this.state.ticket.tech_id ? this.state.ticket.tech_id : 0,
                'default_contract_id': this.state.ticket.default_contract_id ? this.state.ticket.default_contract_id : 0,
                'priority_id': this.state.ticket.priority_id ? this.state.ticket.priority_id : 0,
                'level_id': this.state.ticket.level_id ? this.state.ticket.level_id : 0,
                'customfields_xml': strXML,
                'default_contract_name': this.state.ticket.default_contract_name ? this.state.ticket.default_contract_name : '',
                'creation_category_id': 0,
                'creation_category_name': '',
                'submission_category': this.state.ticket.submission_category ? this.state.ticket.submission_category : '',
                'asset_id': 0,
            }

            if (this.state.timelog && this.state.timelog.board_list_id) {
                obj.board_list_id = this.state.timelog.board_list_id
            }

            if (this.state.classSelected && this.state.classSelected.id != null && this.state.classSelected.id != undefined) {
                obj.class_id = this.state.classSelected.id
            }

            if (this.state.accountSelected && this.state.accountSelected.id != null && this.state.accountSelected.id != undefined) {
                obj.account_id = this.state.accountSelected.id
            }

            if (this.state.assetSelected && this.state.assetSelected.id != null && this.state.assetSelected.id != undefined) {
                obj.asset_id = this.state.assetSelected.id
            }

            if (this.state.locationSelected && this.state.locationSelected.id != null && this.state.locationSelected.id != undefined) {
                obj.location_id = this.state.locationSelected.id
            }

            if (this.state.projectSelected && this.state.projectSelected.id != null && this.state.projectSelected.id != undefined) {
                obj.project_id = this.state.projectSelected.id
            }

            if (this.state.creationCategorySelected && this.state.creationCategorySelected.id != null && this.state.creationCategorySelected.id != undefined) {
                obj.creation_category_id = this.state.creationCategorySelected.id
                obj.creation_category_name = this.state.creationCategorySelected.name
            }

            if (this.state.boardSelected && this.state.boardSelected.id != null && this.state.boardSelected.id != undefined) {
                obj.board_list_id = this.state.boardSelected.id
            }

            if (this.state.levelSelected && this.state.levelSelected.id != null && this.state.levelSelected.id != undefined) {
                obj.level_id = this.state.levelSelected.id
            }

            if (this.state.prioritySelected && this.state.prioritySelected.id != null && this.state.prioritySelected.id != undefined) {
                obj.priority_id = this.state.prioritySelected.id
            }

            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))

            ApiHelper.putWithParam(ApiHelper.Apis.Tickets + `/${this.state.ticket.key}`, obj, this, true, authHeader)
                .then((response) => {
                    this.props.navigation.goBack();
                    Toast.show({
                        text: `${this.state.ticketTitle} has been updated successfully.`,
                        position: 'top',
                        duration: 3000,
                        type: 'success',
                        style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
                    })

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

    /* Calling api to fetch custom fields */
    fetchCustomfields(class_id, isShowLoader = false) {
        if (class_id) {
            this.setState({ customfieldsDataSource: [] })
            var objData = { class_id: class_id }
            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
            ApiHelper.getWithParam(ApiHelper.Apis.CustomFields, objData, this, false, authHeader).then((response) => {
                this.setState({ customfieldsDataSource: response })
            })
                .catch((response) => {
                    console.log('Error ====================================');
                    console.log(response);
                    console.log('====================================');
                })
        }
    }

    /* Calling api to upload file */
    uploadFile(ticket) {
        let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
        let obj = { ticket: ticket.key, post_id: ticket.id }
        ApiHelper.postImageWithParam(ApiHelper.Apis.Files, [this.state.fileSource], obj, this, authHeader, true)
            .then((response) => {
                this.props.navigation.goBack();
                Toast.show({
                    text: `${this.state.ticketTitle} has been added successfully.`,
                    position: 'top',
                    duration: 3000,
                    type: 'success',
                    style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
                })
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

    /* Checking validation and returns true/false */
    isValid() {
        if (this.state.userSelected == null) {
            setTimeout(() => this.fetchUsers(true), 200)
            return false
        } else if ((this.props.configInfo && this.props.configInfo.is_account_manager) && (this.state.accountSelected == null || !this.state.accountSelected.id)) {
            setTimeout(() => this.fetchAccounts(true), 200)
            return false
        } else if ((this.props.configInfo && this.props.configInfo.is_creation_categories && this.props.configInfo.is_creation_categories_required_on_creation) && (!this.state.creationCategorySelected  || this.state.creationCategorySelected && !this.state.creationCategorySelected.id)) {
            setTimeout(() => this.fetchCategories(true), 200)
            return false
        } else if (ValidationHelper.isInvalidText(this.state.subject)) {
            setTimeout(() => this.subjectRef._root.focus(), 200)
            return false
        } else if (ValidationHelper.isInvalidText(this.state.details)) {
            setTimeout(() => this.detailsRef._root.focus(), 200)
            return false
        }

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

    /* Checking validation and returns true/false */
    isValidEditMode() {
        var isValid = true
        if (ValidationHelper.isInvalidText(this.state.subject)) {
            setTimeout(() => this.subjectEditRef._root.focus(), 200)
            return false
        }
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

    /* Navigating to search and select user screen  */
    fetchUsers(isShowPopup = false) {
        if (this.props.navigation.state.params)
            this.props.navigation.state.params.userSelected = null;
        this.props.navigation.push('SearchUsers', { screen: 'AddEditTicket', account: this.state.accountSelected });
    }

    /* Calling api to fetch assets and display selection popup  */
    fetchAssets(isShowPopup = false) {
        if (this.props.navigation.state.params)
        this.props.navigation.state.params.assetSelected = null;
    this.props.navigation.push('SearchAssets', { screen: 'AddEditTicket', account: this.state.accountSelected });
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

     /* Calling api to fetch levels and display in selection popup */
     fetchLevels(isShowPopup = false) {
        if (this.state.levelDataSource.length > 0 && isShowPopup) {
            this.setState({ showLevelPopup: true })
        } else {
        let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
        var objData = {  }
        ApiHelper.getWithParam(ApiHelper.Apis.Levels, objData, this, true, authHeader).then((response) => {
            var arrTemp = []
            // arrTemp.push({ value_title: 'Default', name: 'Default' })
            for (const key in response) {
                if (Object.hasOwnProperty.call(response, key)) {
                    var obj = response[key];
                    obj.value_title = obj.name
                    arrTemp.push(obj)
                }
            }
            this.setState({ levelDataSource: arrTemp })
            if (isShowPopup) {
                this.setState({ showLevelPopup: true })
            }
        })
            .catch((response) => {
                ApiHelper.handleErrorAlert(response)
            })
        }
    }

    /* Calling api to fetch board list and display in selection popup */
    fetchBoardList(isShowPopup = false) {
        if (this.state.boardDataSource.length > 0 && isShowPopup) {
            this.setState({ showBoardPopup: true })
        } else {
        let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
        var objData = {  }
        ApiHelper.getWithParam(ApiHelper.Apis.Boards, objData, this, true, authHeader).then((response) => {
            var arrTemp = []
            arrTemp.push({ value_title: 'Default', name: 'Default' })
            for (const key in response) {
                if (Object.hasOwnProperty.call(response, key)) {
                    var obj = response[key];
                    obj.value_title = obj.name
                    arrTemp.push(obj)
                }
            }
            this.setState({ boardDataSource: arrTemp })
            if (isShowPopup) {
                this.setState({ showBoardPopup: true })
            }
        })
            .catch((response) => {
                ApiHelper.handleErrorAlert(response)
            })
        }
    }
    
    /* Calling api to fetch priorities and display in selection popup */
    fetchPriorities(isShowPopup = false) {
        if (this.state.priorityDataSource.length > 0 && isShowPopup) {
            this.setState({ showPriorityPopup: true })
        } else {
            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
            ApiHelper.getWithParam(ApiHelper.Apis.Priorities, {}, this, true, authHeader).then((response) => {
                var arrTemp = []
                // arrTemp.push({ value_title: 'Default', name: 'Default' })
                for (const key in response) {
                    if (Object.hasOwnProperty.call(response, key)) {
                        var obj = response[key];
                        obj.value_title = obj.name
                        arrTemp.push(obj)
                    }
                }
                this.setState({ priorityDataSource: arrTemp })
                if (isShowPopup) {
                    this.setState({ showPriorityPopup: true })
                }
            })
                .catch((response) => {
                    ApiHelper.handleErrorAlert(response)
                })
        }
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

    /* Navigating to search and select technician screen  */
    fetchTechnicians(isShowPopup = false) {
        this.props.navigation.push('SearchTechnicians', { screen: 'AddEditTicket', account: this.state.accountSelected });
    }

    /* Calling api to fetch todo templates and display selection popup */
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
                        console.log('Updated', newImgSrc);
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
            showSignleSelectionPopup: false,
            showDatePicker: false,
            showMultipleSelectionPopup: false,
            showBoardPopup: false,
            showLevelPopup: false,
            showPriorityPopup: false,
            showAssetPopup: false,
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
            if (selectedData)
            {
            if (this.state.accountSelected && this.state.accountSelected.id)
            {
                selectedData.account_id = this.state.accountSelected.id;
                selectedData.account_name = this.state.accountSelected.name;
            }
            if (selectedData.account_id < 1 && this.props.configInfo && this.props.configInfo.user && this.props.configInfo.user)
                selectedData.account_name = this.props.configInfo.user.account_name;

            var _accountSelected = {
                id: selectedData.account_id,
                name: selectedData.account_name
            };
            this.setState({
                accountName: _accountSelected.name,
                accountSelected: _accountSelected,
                userSelected: selectedData,
                locationSelected: null,
                projectSelected: null,
            });
        }
        } else if (dropDownName === 'Asset') {
            selectedData.name = selectedData.name ? selectedData.name : (selectedData.id ? selectedData.serial_tag_number : 'Default'),
            selectedData.value_title = selectedData.name
            this.setState({ assetSelected: selectedData });
        } else if (dropDownName === 'Board') {
            this.setState({
                boardSelected: selectedData,
            });
        }  else if (dropDownName === 'Level') {
            this.setState({
                levelSelected: selectedData,
            });
        }  else if (dropDownName === 'Priority') {
            this.setState({
                prioritySelected: selectedData,
            });
        }  else if (dropDownName === 'Locations') {
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
                techSelected: selectedData,
            });
        } else if (dropDownName === 'ToDoTemplates') {
            this.setState({ toDoTemplatesSelected: selectedData });
        } else if (dropDownName === 'SignleSelection') {
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
            this.setState({ arrCustomFileds: arrItems })
        }
        this.dismissPopup();
    }

    /* Returns selected options array  */
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
                <AccountSelectionWithLoadMore name={this.state.accountTitle} defaultOption={{ value_title: '(No Account)', name: '(No Account)' }} dataSource={this.state.accountDataSource} dismissPopup={() => this.dismissPopup()} selected={this.state.accountName} selectedData={this.state.accountSelected} selectionDidChange={(selected, selectedData) => { this.selectionDidChange('Account', selected, selectedData); }} />
            )
        } else if (this.state.showUsersPopup) {
            return (
                <Selection name={this.state.userTitle} dataSource={this.state.userDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.userSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Users', selected, data); }} />
            )
        } else if (this.state.showBoardPopup) {
            return (
                <Selection name="Board" dataSource={this.state.boardDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.boardSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Board', selected, data); }} />
            )
        } else if (this.state.showLevelPopup) {
            return (
                <Selection name="Level" dataSource={this.state.levelDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.levelSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Level', selected, data); }} />
            )
        } else if (this.state.showPriorityPopup) {
            return (
                <Selection  name="Priority" dataSource={this.state.priorityDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.prioritySelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Priority', selected, data); }} />
            )
        } else if (this.state.showLocationPopup) {
            return (
                <Selection name={this.state.locationTitle} dataSource={this.state.locationDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.locationSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Locations', selected, data); }} />
            )
        } else if (this.state.showProjectPopup) {
            return (
                <Selection name="Project" dataSource={this.state.projectDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.projectSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Projects', selected, data); }} />
            )
        } else if (this.state.showClassPopup) {
            return (
                <Selection name="Class" dataSource={this.state.classDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.classSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Class', selected, data); }} />
            )
        } else if (this.state.showTechPopup) {
            return (
                <Selection name={this.state.techTitle} dataSource={this.state.techDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.techSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Tech', selected, data); }} />
            )
        } else if (this.state.showCreationCategoryPopup) {
            return (
                <Selection name="Creation Category" dataSource={this.state.creationCategoryDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.creationCategorySelected} selectionDidChange={(selected, data) => { this.selectionDidChange('CreationCategory', selected, data); }} />
            )
        } else if (this.state.showToDoTemplatesPopup) {
            return (
                <ToDoTemplates dataSource={this.state.toDoTemplatesDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.toDoTemplatesSelectedDataSource} selectionDidChange={(selected, data) => { this.selectionDidChange('ToDoTemplates', selected, data); }} />
                // <Selection dataSource={this.state.toDoTemplatesDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.toDoTemplatesSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('ToDoTemplates', selected, data); }} />
            )
        } else if (this.state.showSignleSelectionPopup) {
            return (
                <Selection name="ToDo" dataSource={this.state.signleSelectionDataSource} selectedData={{ value_title: this.customFiledAnswer(this.state.selectedItem) }} dismissPopup={() => this.dismissPopup()} selectionDidChange={(selected, data) => { this.selectionDidChange('SignleSelection', selected, data); }} />
            )
        } else if (this.state.showDatePicker) {
            console.log('====================================');
            console.log(this.customFiledAnswer(this.state.selectedItem));
            console.log('====================================');
            return (
                <DatePickerView name="Date" mode='date' minDate={null} maxDate={null} dismissPopup={() => this.dismissPopup()} selectedDate={(this.customFiledAnswer(this.state.selectedItem) != 'null' && this.customFiledAnswer(this.state.selectedItem) != '') ? Moment(this.customFiledAnswer(this.state.selectedItem)) : null} dateDidChange={(date) => { this.dateDidChange(date, 'date'); }} />
            )
        } else if (this.state.showMultipleSelectionPopup) {
            return (
                <ToDoTemplates name="ToDo Template" dataSource={this.state.multipleSelectionDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.customMultipleSelectionSelectedOption(this.customFiledAnswer(this.state.selectedItem))} selectionDidChange={(selected, data) => { this.selectionDidChange('MultipleSelection', selected, data); }} />
            )
        } else if (this.state.showAssetPopup) {
            return (
                <Selection dataSource={this.state.assetDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.assetSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Asset', selected, data); }} />
            )
        } else {
            return null
        }
    }

    /* Returns selected todo templates */
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

    /* Returns custom filed answer */
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

    /* Rendering custom fileds */
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
                                        var arrTemp = this.state.arrCustomFileds
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
                                        var arrTemp = this.state.arrCustomFileds
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
                    style={[styles.backgroundImage, { borderRadius: 0 }]} />
                <SafeAreaView>
                    <NavigationBar
                        isTransparent
                        navigation={this.props.navigation}
                        showTitle={this.state.isEdit ? `Edit ${this.state.ticketTitle}` : `Add ${this.state.ticketTitle}`}
                    />
                </SafeAreaView>
                {this.renderDropDownOptions()}
                <View style={styles.contentContainer}>
                    <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
                        <SafeAreaView style={styles.mainContainer}>
                            <View style={[styles.mainContainer, { paddingTop: 30, paddingBottom: 30 }]}>
                                {this.state.isEdit ?
                                    <View>
                                        <View>
                                            <Label style={[styles.inputTitle, styles.placeholderColor]}>Subject</Label>
                                            <View style={[styles.inputContainer, this.state.currentEditingField == 'subjectEdit' ? styles.inputActive : styles.inputInactive]}>
                                                <Input
                                                    style={styles.input}
                                                    placeholder='Subject'
                                                    placeholderTextColor={Colors.placeholder}
                                                    autoCapitalize='words'
                                                    selectionColor={Colors.mainPrimary}
                                                    value={this.state.subject}
                                                    onChangeText={value => this.setState({ subject: value })}
                                                    blurOnSubmit={false}
                                                    keyboardAppearance='dark'
                                                    returnKeyType={"next"}
                                                    onFocus={value => {
                                                        this.setState({ currentEditingField: 'subjectEdit' })
                                                    }}
                                                    onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                    ref={input => {
                                                        this.subjectEditRef = input;
                                                    }}
                                                    onSubmitEditing={() => {
                                                        this.stepRef._root.focus();
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        <View>
                                            <Label style={[styles.inputTitle, styles.placeholderColor]}>Next Step</Label>
                                            <View style={[styles.inputContainer, this.state.currentEditingField == 'step' ? styles.inputActive : styles.inputInactive]}>
                                                <Input
                                                    style={styles.input}
                                                    placeholder='Next Step'
                                                    placeholderTextColor={Colors.placeholder}
                                                    autoCapitalize='words'
                                                    selectionColor={Colors.mainPrimary}
                                                    value={this.state.step}
                                                    onChangeText={value => this.setState({ step: value })}
                                                    blurOnSubmit={false}
                                                    keyboardAppearance='dark'
                                                    // returnKeyType={"next"}
                                                    onFocus={value => {
                                                        this.setState({ currentEditingField: 'step' })
                                                    }}
                                                    onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                    ref={input => {
                                                        this.stepRef = input;
                                                    }}
                                                    onSubmitEditing={() => {
                                                        // this.naxtStepRef._root.focus();
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    : null}
                                {!this.state.isEdit ?
                                    <View>
                                        <Label style={[styles.inputTitle, styles.placeholderColor]}>{this.state.userTitle}</Label>
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            style={[styles.inputContainer, this.state.currentEditingField == 'user' ? styles.inputActive : styles.inputInactive]}
                                            onPress={() => { this.fetchUsers(true) }}>
                                            <Input
                                                pointerEvents={'none'}
                                                editable={false}
                                                style={styles.input}
                                                placeholder={this.state.userTitle}
                                                placeholderTextColor={Colors.placeholder}
                                                autoCapitalize='words'
                                                selectionColor={Colors.mainPrimary}
                                                value={this.state.userSelected ? (this.state.userSelected.firstname + ' ' + this.state.userSelected.lastname) : ''}
                                                // onChangeText={value => this.setState({ accountType: value })}
                                                blurOnSubmit={false}
                                                keyboardAppearance='dark'
                                                returnKeyType={"next"}
                                                onFocus={value => {
                                                    this.setState({ currentEditingField: 'user' })
                                                }}
                                                onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                ref={input => {
                                                    this.techRef = input;
                                                }}
                                                onSubmitEditing={() => {
                                                    // this.taskTypeRef._root.focus();
                                                }}
                                            />
                                            <Image style={styles.rightIcon} source={Images.downarrow} />
                                        </TouchableOpacity>
                                    </View>
                                    : null}
                                    {this.props.configInfo && this.props.configInfo.is_account_manager ?
                                    <View>
                                        <Label style={[styles.inputTitle, styles.placeholderColor]}>{this.state.accountTitle}</Label>
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            style={[styles.inputContainer, this.state.currentEditingField == 'account' ? styles.inputActive : styles.inputInactive]}
                                            onPress={() => {
                                                if (!this.state.isDisableFields) {
                                                    this.fetchAccounts(true)
                                                }
                                            }}>
                                            <Input
                                                pointerEvents={'none'}
                                                editable={false}
                                                style={[styles.input, this.state.isDisableFields ? { color: Colors.textGray } : {}]}
                                                placeholder={this.state.accountTitle}
                                                placeholderTextColor={Colors.placeholder}
                                                autoCapitalize='words'
                                                selectionColor={Colors.mainPrimary}
                                                value={(this.state.accountSelected && !!this.state.accountSelected.id) ? this.state.accountSelected.name : ''}
                                                onChangeText={value => this.setState({ accountType: value })}
                                                blurOnSubmit={false}
                                                keyboardAppearance='dark'
                                                returnKeyType={"next"}
                                                onFocus={value => {
                                                    this.setState({ currentEditingField: 'account' })
                                                }}
                                                onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                ref={input => {
                                                    this.accountRef = input;
                                                }}
                                                onSubmitEditing={() => {
                                                    this.projectRef._root.focus();
                                                }}
                                            />
                                            <Image style={styles.rightIcon} source={Images.downarrow} />
                                        </TouchableOpacity>
                                    </View>
                                    : null}
                                    {this.props.configInfo && this.props.configInfo.is_board_enabled ?
                                    <View>
                                        <Label style={[styles.inputTitle, styles.placeholderColor]}>Board</Label>
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            style={[styles.inputContainer, this.state.currentEditingField == 'boardList' ? styles.inputActive : styles.inputInactive]}
                                            onPress={() => {
                                                // if (!this.state.isDisableFields) {
                                                    this.fetchBoardList(true)
                                                // }
                                            }}>
                                            <Input
                                                pointerEvents={'none'}
                                                editable={false}
                                                style={styles.input}
                                                // style={[styles.input, this.state.isDisableFields ? { color: Colors.textGray } : {}]}
                                                placeholder={'Board'}
                                                placeholderTextColor={Colors.placeholder}
                                                autoCapitalize='words'
                                                selectionColor={Colors.mainPrimary}
                                                value={this.state.boardSelected ? this.state.boardSelected.name : ''}
                                                blurOnSubmit={false}
                                                keyboardAppearance='dark'
                                                returnKeyType={"next"}
                                                onFocus={value => {
                                                    this.setState({ currentEditingField: 'boardList' })
                                                }}
                                                onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                ref={input => {
                                                    this.boardListRef = input;
                                                }}
                                                onSubmitEditing={() => {
                                                    // this.ticketRef._root.focus();
                                                }}
                                            />
                                            <Image style={styles.rightIcon} source={Images.downarrow} />
                                        </TouchableOpacity>
                                    </View>
                                    : null}
                                    {this.props.configInfo && this.props.configInfo.is_ticket_levels ?
                                    <View>
                                        <Label style={[styles.inputTitle, styles.placeholderColor]}>Level</Label>
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            style={[styles.inputContainer, this.state.currentEditingField == 'level' ? styles.inputActive : styles.inputInactive]}
                                            onPress={() => {
                                                // if (!this.state.isDisableFields) {
                                                    this.fetchLevels(true)
                                                // }
                                            }}>
                                            <Input
                                                pointerEvents={'none'}
                                                editable={false}
                                                style={styles.input}
                                                // style={[styles.input, this.state.isDisableFields ? { color: Colors.textGray } : {}]}
                                                placeholder={'Level'}
                                                placeholderTextColor={Colors.placeholder}
                                                autoCapitalize='words'
                                                selectionColor={Colors.mainPrimary}
                                                value={this.state.levelSelected ? this.state.levelSelected.name : ''}
                                                blurOnSubmit={false}
                                                keyboardAppearance='dark'
                                                returnKeyType={"next"}
                                                onFocus={value => {
                                                    this.setState({ currentEditingField: 'level' })
                                                }}
                                                onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                ref={input => {
                                                    this.levelRef = input;
                                                }}
                                                onSubmitEditing={() => {
                                                    // this.ticketRef._root.focus();
                                                }}
                                            />
                                            <Image style={styles.rightIcon} source={Images.downarrow} />
                                        </TouchableOpacity>
                                    </View>
                                    : null}
                                    {this.props.configInfo && this.props.configInfo.is_priorities_general ?
                                    <View>
                                        <Label style={[styles.inputTitle, styles.placeholderColor]}>Priority</Label>
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            style={[styles.inputContainer, this.state.currentEditingField == 'priority' ? styles.inputActive : styles.inputInactive]}
                                            onPress={() => {
                                                // if (!this.state.isDisableFields) {
                                                    this.fetchPriorities(true)
                                                // }
                                            }}>
                                            <Input
                                                pointerEvents={'none'}
                                                editable={false}
                                                // style={[styles.input, this.state.isDisableFields ? { color: Colors.textGray } : {}]}
                                                style={styles.input}
                                                placeholder={'Priority'}
                                                placeholderTextColor={Colors.placeholder}
                                                autoCapitalize='words'
                                                selectionColor={Colors.mainPrimary}
                                                value={this.state.prioritySelected ? this.state.prioritySelected.name : ''}
                                                blurOnSubmit={false}
                                                keyboardAppearance='dark'
                                                returnKeyType={"next"}
                                                onFocus={value => {
                                                    this.setState({ currentEditingField: 'priority' })
                                                }}
                                                onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                ref={input => {
                                                    this.priorityRef = input;
                                                }}
                                                onSubmitEditing={() => {
                                                    // this.ticketRef._root.focus();
                                                }}
                                            />
                                            <Image style={styles.rightIcon} source={Images.downarrow} />
                                        </TouchableOpacity>
                                    </View>
                                    : null}
                                {this.props.configInfo && this.props.configInfo.is_location_tracking ?
                                    <View>
                                        <Label style={[styles.inputTitle, styles.placeholderColor]}>{this.state.locationTitle}</Label>
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            style={[styles.inputContainer, this.state.currentEditingField == 'location' ? styles.inputActive : styles.inputInactive]}
                                            onPress={() => {
                                                if (!this.state.isDisableFields) {
                                                    this.fetchLocations(true)
                                                }
                                            }}>
                                            <Input
                                                pointerEvents={'none'}
                                                editable={false}
                                                style={[styles.input, this.state.isDisableFields ? { color: Colors.textGray } : {}]}
                                                placeholder={this.state.locationTitle}
                                                placeholderTextColor={Colors.placeholder}
                                                autoCapitalize='words'
                                                selectionColor={Colors.mainPrimary}
                                                value={this.state.locationSelected ? this.state.locationSelected.name : ''}
                                                onChangeText={value => this.setState({ accountType: value })}
                                                blurOnSubmit={false}
                                                keyboardAppearance='dark'
                                                returnKeyType={"next"}
                                                onFocus={value => {
                                                    this.setState({ currentEditingField: 'location' })
                                                }}
                                                onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                ref={input => {
                                                    this.projectRef = input;
                                                }}
                                                onSubmitEditing={() => {
                                                    this.ticketRef._root.focus();
                                                }}
                                            />
                                            <Image style={styles.rightIcon} source={Images.downarrow} />
                                        </TouchableOpacity>
                                    </View>
                                    : null}
                                {this.props.configInfo && this.props.configInfo.is_project_tracking ?
                                    <View>
                                        <Label style={[styles.inputTitle, styles.placeholderColor]}>Project</Label>
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            style={[styles.inputContainer, this.state.currentEditingField == 'project' ? styles.inputActive : styles.inputInactive]}
                                            onPress={() => {
                                                if (!this.state.isDisableFields) {
                                                    this.fetchProjects(true)
                                                }
                                            }}>
                                            <Input
                                                pointerEvents={'none'}
                                                editable={false}
                                                style={[styles.input, this.state.isDisableFields ? { color: Colors.textGray } : {}]}
                                                placeholder='Project'
                                                placeholderTextColor={Colors.placeholder}
                                                autoCapitalize='words'
                                                selectionColor={Colors.mainPrimary}
                                                value={this.state.projectSelected ? this.state.projectSelected.name : ''}
                                                onChangeText={value => this.setState({ accountType: value })}
                                                blurOnSubmit={false}
                                                keyboardAppearance='dark'
                                                returnKeyType={"next"}
                                                onFocus={value => {
                                                    this.setState({ currentEditingField: 'project' })
                                                }}
                                                onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                ref={input => {
                                                    this.projectRef = input;
                                                }}
                                                onSubmitEditing={() => {
                                                    this.ticketRef._root.focus();
                                                }}
                                            />
                                            <Image style={styles.rightIcon} source={Images.downarrow} />
                                        </TouchableOpacity>
                                    </View>
                                    : null}
                                {this.props.configInfo && this.props.configInfo.is_class_tracking ?
                                    <View>
                                        <Label style={[styles.inputTitle, styles.placeholderColor]}>Class</Label>
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            style={[styles.inputContainer, this.state.currentEditingField == 'class' ? styles.inputActive : styles.inputInactive]}
                                            onPress={() => {
                                                if (!this.state.isDisableFields) {
                                                    this.fetchClasses(true)
                                                }
                                            }}>
                                            <Input
                                                pointerEvents={'none'}
                                                editable={false}
                                                style={[styles.input, this.state.isDisableFields ? { color: Colors.textGray } : {}]}
                                                placeholder='Class'
                                                placeholderTextColor={Colors.placeholder}
                                                autoCapitalize='words'
                                                selectionColor={Colors.mainPrimary}
                                                value={this.state.classSelected ? this.state.classSelected.name : ''}
                                                onChangeText={value => this.setState({ accountType: value })}
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
                                                    this.ticketRef._root.focus();
                                                }}
                                            />
                                            <Image style={styles.rightIcon} source={Images.downarrow} />
                                        </TouchableOpacity>
                                    </View>
                                    : null}
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
                                {!this.state.isEdit ?
                                    <View>
                                        <View>
                                            <Label style={[styles.inputTitle, styles.placeholderColor]}>{this.state.techTitle}</Label>
                                            <View style={{ flexDirection: 'row' }}>
                                                <TouchableOpacity
                                                    activeOpacity={0.7}
                                                    style={[styles.inputContainer, { flexGrow: 1, marginRight: 0 }, this.state.currentEditingField == 'technician' ? styles.inputActive : styles.inputInactive]}
                                                    onPress={() => {
                                                        if (!this.state.isDisableFields) {
                                                            this.fetchTechnicians(true)
                                                        }
                                                    }}>
                                                    <Input
                                                        pointerEvents={'none'}
                                                        editable={false}
                                                        style={[styles.input, this.state.isDisableFields ? { color: Colors.textGray } : {}]}
                                                        placeholder={this.state.techTitle}
                                                        placeholderTextColor={Colors.placeholder}
                                                        autoCapitalize='words'
                                                        selectionColor={Colors.mainPrimary}
                                                        value={this.state.techSelected ? (this.state.techSelected.firstname + ' ' + this.state.techSelected.lastname) : ''}
                                                        onChangeText={value => this.setState({ accountType: value })}
                                                        blurOnSubmit={false}
                                                        keyboardAppearance='dark'
                                                        returnKeyType={"next"}
                                                        onFocus={value => {
                                                            this.setState({ currentEditingField: 'technician' })
                                                        }}
                                                        onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                        ref={input => {
                                                            this.technicianRef = input;
                                                        }}
                                                        onSubmitEditing={() => {
                                                            this.ticketRef._root.focus();
                                                        }}
                                                    />
                                                    <Image style={styles.rightIcon} source={Images.downarrow} />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    activeOpacity={0.7}
                                                    style={[styles.inputContainer, this.state.currentEditingField == 'technician' ? styles.inputActive : styles.inputInactive]}
                                                    onPress={() => {
                                                        if (this.props.configInfo && this.props.configInfo.user) {
                                                            let aUser = this.props.configInfo.user
                                                            var obj = { ...aUser }
                                                            obj.id = aUser.user_id
                                                            obj.value_title = aUser.firstname + ' ' + aUser.lastname + ` (${aUser.email})`
                                                            this.setState({ techSelected: obj })
                                                        } else {
                                                            this.fetchTechnicians(true)
                                                        }
                                                    }}>
                                                    <Label style={styles.input}>ME</Label>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        {this.props.configInfo && this.props.configInfo.is_todos ?
                                            <View>
                                                <Label style={[styles.inputTitle, styles.placeholderColor]}>{'ToDo Templates'}</Label>
                                                <TouchableOpacity
                                                    activeOpacity={0.7}
                                                    style={[styles.inputContainer, this.state.currentEditingField == 'toDoTemplates' ? styles.inputActive : styles.inputInactive]}
                                                    onPress={() => {
                                                        if (!this.state.isDisableFields) {
                                                            this.fetchToDoTemplates(true)
                                                        }
                                                    }}>
                                                    <Input
                                                        pointerEvents={'none'}
                                                        editable={false}
                                                        style={[styles.input, this.state.isDisableFields ? { color: Colors.textGray } : {}]}
                                                        placeholder={'ToDo Templates'}
                                                        placeholderTextColor={Colors.placeholder}
                                                        autoCapitalize='words'
                                                        selectionColor={Colors.mainPrimary}
                                                        value={this.selectedToDoTemplates()}
                                                        onChangeText={value => this.setState({ accountType: value })}
                                                        blurOnSubmit={false}
                                                        keyboardAppearance='dark'
                                                        returnKeyType={"next"}
                                                        onFocus={value => {
                                                            this.setState({ currentEditingField: 'toDoTemplates' })
                                                        }}
                                                        onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                        ref={input => {
                                                            this.toDoTemplatesRef = input;
                                                        }}
                                                        onSubmitEditing={() => {
                                                            this.ticketRef._root.focus();
                                                        }}
                                                    />
                                                    <Image style={styles.rightIcon} source={Images.downarrow} />
                                                </TouchableOpacity>
                                            </View>
                                            : null}
                                        {this.props.configInfo && this.props.configInfo.is_asset_tracking ?
                                        <View>
                                        <Label style={[styles.inputTitle, styles.placeholderColor]}>Asset</Label>
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            style={[styles.inputContainer, this.state.currentEditingField == 'asset' ? styles.inputActive : styles.inputInactive]}
                                            onPress={() => {
                                                this.fetchAssets(true)
                                            }}>
                                            <Input
                                                pointerAssets={'none'}
                                                editable={false}
                                                style={styles.input}
                                                placeholder={'Asset tag / UniqueID'}
                                                placeholderTextColor={Colors.placeholder}
                                                autoCapitalize='words'
                                                selectionColor={Colors.mainPrimary}
                                                value={this.state.assetSelected ? (this.state.assetSelected.name ?? this.state.assetSelected.serial_tag_number) : ''}
                                                // onChangeText={value => this.setState({ accountType: value })}
                                                blurOnSubmit={false}
                                                keyboardAppearance='dark'
                                                returnKeyType={"next"}
                                                onFocus={value => {
                                                    this.setState({ currentEditingField: 'asset' })
                                                }}
                                                onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                ref={input => {
                                                    this.assetRef = input;
                                                }}
                                                onSubmitEditing={() => {
                                                    // this.taskTypeRef._root.focus();
                                                }}
                                            />
                                            <Image style={styles.rightIcon} source={Images.downarrow} />
                                        </TouchableOpacity>
                                        </View>    
                                        : null}
                                        <View>
                                            <Label style={[styles.inputTitle, styles.placeholderColor]}>Subject</Label>
                                            <View style={[styles.inputContainer, this.state.currentEditingField == 'subject' ? styles.inputActive : styles.inputInactive]}>
                                                <Input
                                                    style={styles.input}
                                                    placeholder='Subject'
                                                    placeholderTextColor={Colors.placeholder}
                                                    autoCapitalize='words'
                                                    selectionColor={Colors.mainPrimary}
                                                    value={this.state.subject}
                                                    onChangeText={value => this.setState({ subject: value })}
                                                    blurOnSubmit={false}
                                                    keyboardAppearance='dark'
                                                    returnKeyType={"next"}
                                                    onFocus={value => {
                                                        this.setState({ currentEditingField: 'subject' })
                                                    }}
                                                    onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                    ref={input => {
                                                        this.subjectRef = input;
                                                    }}
                                                    onSubmitEditing={() => {
                                                        this.internalCommentsRef._root.focus();
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        <View>
                                            <Label style={[styles.inputTitle, styles.placeholderColor]}>Details</Label>
                                            <View style={[styles.inputContainer, { height: 100, paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10 }, this.state.currentEditingField == 'details' ? styles.inputActive : styles.inputInactive]}>
                                                <Textarea
                                                    style={[styles.input, { height: '100%', width: '100%' }]}
                                                    placeholder='Details'
                                                    placeholderTextColor={Colors.placeholder}
                                                    selectionColor={Colors.mainPrimary}
                                                    value={this.state.details}
                                                    onChangeText={value => this.setState({ details: value })}
                                                    blurOnSubmit={false}
                                                    keyboardAppearance='dark'
                                                    // returnKeyType={"next"}
                                                    onFocus={value => {
                                                        this.setState({ currentEditingField: 'details' })
                                                    }}
                                                    onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                    ref={input => {
                                                        this.detailsRef = input;
                                                    }}
                                                // onSubmitEditing={() => {
                                                //     this.subjectRef._root.focus();
                                                // }}
                                                />
                                            </View>
                                        </View>
                                        <View>
                                            <Label style={[styles.inputTitle, styles.placeholderColor]}>{'Add File'}</Label>
                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                style={[styles.inputContainer, this.state.currentEditingField == 'addFile' ? styles.inputActive : styles.inputInactive]}
                                                onPress={() => {
                                                    if (this.state.fileSource != null) {
                                                        this.setState({ fileSource: null })
                                                    } else {
                                                        this.changeFilePicture()
                                                    }
                                                }}>
                                                <Input
                                                    pointerEvents={'none'}
                                                    editable={false}
                                                    style={styles.input}
                                                    placeholder={'Add File'}
                                                    placeholderTextColor={Colors.placeholder}
                                                    autoCapitalize='words'
                                                    selectionColor={Colors.mainPrimary}
                                                    value={this.state.fileSource ? this.state.fileSource.filename : ''}
                                                    // onChangeText={value => this.setState({ accountType: value })}
                                                    blurOnSubmit={false}
                                                    keyboardAppearance='dark'
                                                    // returnKeyType={"go"}
                                                    onFocus={value => {
                                                        this.setState({ currentEditingField: 'addFile' })
                                                    }}
                                                    onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                    ref={input => {
                                                        this.addFileRef = input;
                                                    }}
                                                    onSubmitEditing={() => {
                                                        // this.taskTypeRef._root.focus();
                                                    }}
                                                />
                                                <Image style={styles.attachmentIcon} source={this.state.fileSource != null ? Images.remove : Images.attachment} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    : null}
                                {this.state.customfieldsDataSource.map((item, index) => {
                                    return (this.renderCustomFiled(item, index))
                                })}
                                <TouchableOpacity activeOpacity={0.7} style={styles.buttonContainer} onPress={() => {
                                    if (this.state.isEdit) {
                                        this.btnUpdateNextStepAndTicketPressed()
                                    } else {
                                        this.btnAddTicketPressed()
                                    }
                                }}>
                                    <Text style={styles.buttonText}>{this.state.isEdit ? `Update ${this.state.ticketTitle}` : `Add ${this.state.ticketTitle}`}</Text>
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
    const { configInfo } = state.configInfo
    return { authToken, org, user, configInfo }
};

/* Connecting to redux store and exporting class */
export default connect(mapStateToProps)(AddEditTicket);