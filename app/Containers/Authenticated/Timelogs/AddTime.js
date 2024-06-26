/* Imports */
import React, { Component } from 'react'
import { ScrollView, Image, View, TouchableOpacity, Platform, StatusBar, SafeAreaView, Text, Keyboard } from 'react-native'
import { Container, Label, Input, Toast, Textarea } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import Moment from 'moment';

import CommonFunctions from '../../../Components/CommonFunctions';
import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Images, Colors, Metrics } from '../../../Themes';
import LinearGradient from 'react-native-linear-gradient';
import ApiHelper from '../../../Components/ApiHelper';
import Loader from '../../../Components/Loader';
import { DateFormat, UserDataKeys } from '../../../Components/Constants';
import DatePickerView from '../../../Components/DatePickerView';
import Selection from '../Selection';
import TechSelectionWithLoadMore from '../TechSelectionWithLoadMore';
import AccountSelectionWithLoadMore from '../AccountSelectionWithLoadMore';

// Styless
import styles from './Styles/AddTimeStyles'

class AddTime extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            date: '',
            timer: '',
            workingHours: '0.00',
            nonWorkingHours: '0.00',
            startTime: '',
            endTime: '',
            accountSelected: null,
            projectSelected: null,
            ticketSelected: null,
            techSelected: null,
            taskTypeSelected: null,
            isDoNotInvoice: false,
            isTaxable: true,
            iComplitedNote: '',
            internalNote: '',
            account: null,
            showAccountNamePopup: false,
            accountDataSource: [],
            timer: null,
            counter: 0,
            counterDates: [],
            showDatePicker: false,
            showStartDatePicker: false,
            showEndDatePicker: false,
            showUsersPopup: false,
            userDataSource: [],
            showProjectPopup: false,
            projectDataSource: [],
            showTicketPopup: false,
            ticketDataSource: [],
            showTaskTypePopup: false,
            taskDataSource: [],
            ticketsTitle: 'Tickets',
            ticketTitle: 'Ticket',
            accountTitle: 'Account',
            accountsTitle: 'Accounts',
            techTitle: 'Tech',
            techsTitle: 'Technicians',
            ticket: null,
            timelog: null,
            isEdit: false,
            isDisableFields: false,
        };
    }

    componentDidMount() {
        this.setState({
            loading: false,
            date: '',
            timer: '',
            workingHours: '0.00',
            nonWorkingHours: '0.00',
            startTime: '',
            endTime: '',
            accountSelected: null,
            projectSelected: null,
            ticketSelected: null,
            techSelected: null,
            taskTypeSelected: null,
            isDoNotInvoice: false,
            isTaxable: true,
            iComplitedNote: '',
            internalNote: '',
            account: null,
            showAccountNamePopup: false,
            accountDataSource: [],
            timer: null,
            counter: 0,
            counterDates: [],
            showDatePicker: false,
            showStartDatePicker: false,
            showEndDatePicker: false,
            showUsersPopup: false,
            userDataSource: [],
            showProjectPopup: false,
            projectDataSource: [],
            showTicketPopup: false,
            ticketDataSource: [],
            showTaskTypePopup: false,
            taskDataSource: [],
            ticketsTitle: 'Tickets',
            ticketTitle: 'Ticket',
            accountTitle: 'Account',
            accountsTitle: 'Accounts',
            techTitle: 'Tech',
            techsTitle: 'Technicians',
            ticket: null,
            timelog: null,
            isEdit: false,
            isDisableFields: false,
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
                if (config.is_customnames) {
                    ticketsTitle = config.names.ticket.p ?? 'Tickets'
                    ticketTitle = config.names.ticket.s ?? 'Ticket'
                    accountsTitle = config.names.account.p ?? 'Accounts'
                    accountTitle = config.names.account.s ?? 'Account'
                    techsTitle = config.names.tech.p ?? 'Technicians'
                    techTitle = config.names.tech.a ?? 'Tech'
                }

                this.setState({ ticketsTitle, ticketTitle, accountsTitle, accountTitle, techsTitle, techTitle, config })
                
                setTimeout(() => {
                    if ((this.state.timelog == null || this.state.timelog == undefined) && this.state.config && this.state.config.user && this.state.config.user.is_techoradmin) {
                        this.setState({
                            techSelected: {
                                id: this.state.config.user.user_id ? this.state.config.user.user_id : (this.state.config.user.user.id || undefined),
                                firstname: this.state.config.user.firstname ? this.state.config.user.firstname : 'Default',
                                lastname: this.state.config.user.lastname ? this.state.config.user.lastname : '',
                                email: this.state.config.user.email,
                                value_title: `${this.state.config.user.firstname} ${this.state.config.user.lastname} (${this.state.config.user.email})`,
                            }
                        })
                    }
                }, 100)

            })

        this.setState({ date: Moment().format(DateFormat.YYYYMMDDTHHMMSS) })

        this.calculateTime()

        if (this.props.navigation.state.params !== undefined) {
            if (this.props.navigation.state.params.account !== undefined) {
                this.setState({ account: this.props.navigation.state.params.account })
            }
            if (this.props.navigation.state.params.timelog !== undefined) {
                this.setState({ timelog: this.props.navigation.state.params.timelog, isEdit: true })
            }

            if (this.props.navigation.state.params.ticket !== undefined) {
                this.setState({ ticket: this.props.navigation.state.params.ticket })
            }
        }

        setTimeout(() => {
            if (this.state.timelog) {
                console.log('====================================');
                console.log(this.state.timelog.start_time);
                console.log('====================================');
                let startTime = this.props.configInfo && this.props.configInfo.timezone_offset ? Moment(this.state.timelog.start_time).utcOffset(this.props.configInfo.timezone_offset).format(DateFormat.YYYYMMDDTHHMMSS) : Moment(this.state.timelog.start_time).utc().format(DateFormat.YYYYMMDDTHHMMSS)
                let endTime = this.props.configInfo && this.props.configInfo.timezone_offset ? Moment(this.state.timelog.stop_time).utcOffset(this.props.configInfo.timezone_offset).format(DateFormat.YYYYMMDDTHHMMSS) : Moment(this.state.timelog.stop_time).utc().format(DateFormat.YYYYMMDDTHHMMSS)
                this.setState({
                    isEdit: true,
                    date: Moment(this.state.timelog.date).format(DateFormat.YYYYMMDDTHHMMSS),
                    workingHours: `${this.state.timelog.hours.toFixed(2)}`,
                    nonWorkingHours: `${(this.state.timelog.non_working_hours < 0 ? 0 : this.state.timelog.non_working_hours).toFixed(2)}`,
                    startTime: startTime != 'Invalid date' ? startTime : '',
                    endTime: endTime != 'Invalid date' ? endTime : '',
                    isDisableFields: (this.state.timelog.project_id || this.state.timelog.ticket_id),
                    accountSelected: {
                        id: this.state.timelog.account_id ? this.state.timelog.account_id : undefined,
                        name: this.state.timelog.account_name ? this.state.timelog.account_name : 'Default',
                        value_title: this.state.timelog.account_name,
                    },
                    projectSelected: {
                        id: this.state.timelog.project_id ? this.state.timelog.project_id : undefined,
                        name: this.state.timelog.project_name ? this.state.timelog.project_name : 'Default',
                        value_title: this.state.timelog.project_name,
                    },
                    ticketSelected: {
                        id: this.state.timelog.ticket_id ? this.state.timelog.ticket_id : undefined,
                        key: this.state.timelog.ticket_id ? this.state.timelog.ticket_id : undefined,
                        number: this.state.timelog.ticket_number ? this.state.timelog.ticket_number : undefined,
                        subject: this.state.timelog.ticket_subject ? this.state.timelog.ticket_subject : 'Default',
                        value_title: `${this.state.timelog.ticket_number} ${this.state.timelog.ticket_subject}`,
                    },
                    techSelected: {
                        id: this.state.timelog.user_id ? this.state.timelog.user_id : undefined,
                        firstname: this.state.timelog.user_name ? this.state.timelog.user_name : 'Default',
                        lastname: '',
                        email: this.state.timelog.user_email,
                        value_title: `${this.state.timelog.user_name} (${this.state.timelog.user_email})`,
                    },
                    taskTypeSelected: {
                        id: this.state.timelog.task_type_id ? this.state.timelog.task_type_id : undefined,
                        name: this.state.timelog.task_type ? this.state.timelog.task_type : 'Default',
                        value_title: this.state.timelog.task_type,
                    },
                    isDoNotInvoice: this.state.timelog.no_invoice,
                    isTaxable: this.state.timelog.is_taxable,
                    iComplitedNote: this.state.timelog.note,
                    internalNote: this.state.timelog.note_internal,
                })
            }
        }, 100)

        setTimeout(() => {
            if (this.state.ticket) {
                this.setState({
                    accountSelected: {
                        id: this.state.ticket.account_id ? this.state.ticket.account_id : undefined,
                        name: this.state.ticket.account_name ? this.state.ticket.account_name : 'Default',
                        value_title: this.state.ticket.account_name,
                    },
                    projectSelected: {
                        id: this.state.ticket.project_id ? this.state.ticket.project_id : undefined,
                        name: this.state.ticket.project_name ? this.state.ticket.project_name : 'Default',
                        value_title: this.state.ticket.project_name,
                    },
                    techSelected: {
                        id: this.state.ticket.tech_id ? this.state.ticket.tech_id : undefined,
                        firstname: this.state.ticket.tech_firstname ? this.state.ticket.tech_firstname : 'Default',
                        lastname: this.state.ticket.tech_lastname ? this.state.ticket.tech_lastname : '',
                        email: this.state.ticket.tech_email,
                        value_title: `${this.state.ticket.tech_firstname} ${this.state.ticket.tech_lastname} (${this.state.ticket.tech_email})`,
                    },
                    ticketSelected: {
                        id: this.state.ticket.id ? this.state.ticket.id : undefined,
                        key: this.state.ticket.key ? this.state.ticket.key : (this.state.ticket.id ? this.state.ticket.id : undefined),
                        number: this.state.ticket.number ? this.state.ticket.number : undefined,
                        subject: this.state.ticket.subject ? this.state.ticket.subject : 'Default',
                        value_title: `${this.state.ticket.number} ${this.state.ticket.subject}`,
                    },
                })
            } else if (this.state.account) {
                this.setState({
                    accountSelected: {
                        id: this.state.account.id ? this.state.account.id : undefined,
                        name: this.state.account.name ? this.state.account.name : 'Default',
                        value_title: this.state.account.name,
                    }
                })
            }
        }, 200)

        this.viewWillAppear()
        this.props.navigation.addListener('didFocus', this.viewWillAppear)
        // this.fetchAccounts(false)
    }

    viewWillAppear = () => {

    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
        Keyboard.dismiss();
    }


    //Actions

    /* Validating information and calling create in api */
    btnAddTimePressed() {
        /* Checking validation if it's valid calling API*/
        if (this.isValid()) {
            Keyboard.dismiss();

            var obj = {
                'tech_id': 0,
                'test_name': '',
                'project_id': 0,
                'is_project_log': !((this.state.ticketSelected || {}).id > 0),
                'ticket_key': 0,
                'account_id': -1,
                'note_text': this.state.iComplitedNote,
                'note_internal': this.state.internalNote,
                'task_type_id': 0,
                'prepaid_pack_id': 0,
                'hours': this.state.workingHours,
                'no_invoice': this.state.isDoNotInvoice,
                'is_taxable': this.state.isTaxable,
                'date': this.state.date,
                'start_date': this.state.startTime,
                'stop_date': this.state.endTime,
                'non_working_hours': this.state.nonWorkingHours,
                'contract_id': 0,
                'is_local_time': true
            }

            if (this.state.accountSelected && this.state.accountSelected.id != null && this.state.accountSelected.id != undefined) {
                obj.account_id = this.state.accountSelected.id
            }

            if (this.state.techSelected && this.state.techSelected.id != null && this.state.techSelected.id != undefined) {
                obj.tech_id = this.state.techSelected.id
                obj.test_name = this.state.techSelected.firstname + ' ' + this.state.techSelected.lastname
            }

            if (this.state.projectSelected && this.state.projectSelected.id != null && this.state.projectSelected.id != undefined) {
                obj.project_id = this.state.projectSelected.id
            }

            if (this.state.ticketSelected && this.state.ticketSelected.id != null && this.state.ticketSelected.id != undefined) {
                obj.ticket_key = this.state.ticketSelected.key
            }

            if (this.state.taskTypeSelected && this.state.taskTypeSelected.id != null && this.state.taskTypeSelected.id != undefined) {
                obj.task_type_id = this.state.taskTypeSelected.id
            }
            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))

            ApiHelper.postWithParam(ApiHelper.Apis.Time, obj, this, true, authHeader)
                .then((response) => {
                    clearInterval(this.state.timer);
                    CommonFunctions.storeData(UserDataKeys.CounterDates, '')
                    this.setState({ timer: null, counter: 0, counterDates: [], startDate: '', endDate: '', workingHours: '0.00', nonWorkingHours: '0.00' })
                    this.props.navigation.goBack();
                    Toast.show({
                        text: `Time has been added successfully.`,
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
                    } else {
                        ApiHelper.handleErrorAlert(response)
                    }
                });
        }
    }


    /* Validating information and calling update api */
    btnUpdateTimePressed() {
        /* Checking validation if it's valid calling API*/
        if (this.isValid()) {
            Keyboard.dismiss();

            var obj = {
                'tech_id': 0,
                'test_name': '',
                'project_id': 0,
                'is_project_log': !((this.state.ticketSelected || {}).id > 0),
                'ticket_key': 0,
                'account_id': -1,
                'note_text': this.state.iComplitedNote,
                'note_internal': this.state.internalNote,
                'task_type_id': 0,
                'prepaid_pack_id': this.state.timelog.prepaid_pack_id,
                'hours': this.state.workingHours,
                'no_invoice': this.state.isDoNotInvoice,
                'is_taxable': this.state.isTaxable,
                'date': this.state.date,
                'start_date': this.state.startTime,
                'stop_date': this.state.endTime,
                'non_working_hours': this.state.nonWorkingHours,
                'is_local_time': true
            }
            if (this.state.timelog && this.state.timelog.contract_id) {
                obj.contract_id = this.state.timelog.contract_id
            }
            if (this.state.accountSelected && this.state.accountSelected.id != null && this.state.accountSelected.id != undefined) {
                obj.account_id = this.state.accountSelected.id
            }

            if (this.state.techSelected && this.state.techSelected.id != null && this.state.techSelected.id != undefined) {
                obj.tech_id = this.state.techSelected.id
                obj.test_name = this.state.techSelected.firstname + ' ' + this.state.techSelected.lastname
            }

            if (this.state.projectSelected && this.state.projectSelected.id != null && this.state.projectSelected.id != undefined) {
                obj.project_id = this.state.projectSelected.id
            }

            if (this.state.ticketSelected && this.state.ticketSelected.id != null && this.state.ticketSelected.id != undefined) {
                obj.ticket_key = this.state.ticketSelected.key
            }

            if (this.state.taskTypeSelected && this.state.taskTypeSelected.id != null && this.state.taskTypeSelected.id != undefined) {
                obj.task_type_id = this.state.taskTypeSelected.id
            }
            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))

            ApiHelper.putWithParam(ApiHelper.Apis.Time + `/${this.state.timelog.time_id ? this.state.timelog.time_id : this.state.timelog.ticket_time_id}`, obj, this, true, authHeader)
                .then((response) => {
                    clearInterval(this.state.timer);
                    CommonFunctions.storeData(UserDataKeys.CounterDates, '')
                    this.setState({ timer: null, counter: 0, counterDates: [], startDate: '', endDate: '', workingHours: '0.00', nonWorkingHours: '0.00' })
                    this.props.navigation.goBack();
                    Toast.show({
                        text: `Time has been updated successfully.`,
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
                    } else {
                        ApiHelper.handleErrorAlert(response)
                    }
                });
        }
    }

    /* Saving timer counter */
    tick = () => {
        this.setState({
            counter: this.state.counter + 1
        });
    }

    //Class Methods

    /* Calculating time if it's alrady started */
    calculateTime() {
        CommonFunctions.retrieveData(UserDataKeys.CounterDates)
            .then((response) => {
                if (response != null) {
                    let arrDates = response.split(', ')
                    var secounds = 0
                    var workingHours = 0.00

                    for (let index = 0; index < arrDates.length; index++) {
                        const date = arrDates[index];
                        if ((index % 2) != 0 && index != 0) {
                            // Complited sets 
                            const startDate = arrDates[index - 1];
                            var now = Moment(date);
                            var dif = Moment.duration(now.diff(startDate)).asSeconds()
                            secounds += dif
                            workingHours += Moment.duration(now.diff(startDate)).asHours()

                            // this.setState({ counter: Number(secounds), counterDates: arrDates })
                        } else if (index + 1 == arrDates.length) {
                            //Incomplete and Last 
                            var startDate = new Moment(date);
                            var now = Moment();
                            var dif = Moment.duration(now.diff(startDate)).asSeconds()
                            secounds += dif
                            // this.setState({ counter: Number(secounds), counterDates: arrDates })
                            let timer = setInterval(this.tick, 1000);
                            this.setState({ timer });
                        }
                    }
                    // workingHours = secounds / 600
                    if (arrDates.length > 0 && (arrDates.length % 2) == 0) {
                        let startDate = Moment(arrDates[0])
                        let endDate = Moment(arrDates[arrDates.length - 1])
                        let totalHours = Moment.duration(endDate.diff(startDate)).asHours()
                        this.setState({
                            counter: Number(secounds),
                            counterDates: arrDates,
                            workingHours: `${workingHours.toFixed(2)}`,
                            nonWorkingHours: `${(totalHours - workingHours).toFixed(2)}`,
                            startTime: Moment(arrDates[0]).format(DateFormat.YYYYMMDDTHHMMSS),
                            endTime: Moment(arrDates[arrDates.length - 1]).format(DateFormat.YYYYMMDDTHHMMSS)
                        })

                    }
                    this.setState({ counter: Number(secounds), counterDates: arrDates, workingHours: `${workingHours.toFixed(2)}` })
                }
            })
    }

    /* Checking validation and returns true/false */
    isValid() {
        if (this.state.startTime == '' && this.state.workingHours == '0.00' && this.state.nonWorkingHours == '0.00') {
            setTimeout(() => this.setState({ showStartDatePicker: true }), 200)
            return false
        } else if (this.state.endTime == '' && this.state.workingHours == '0.00' && this.state.nonWorkingHours == '0.00') {
            setTimeout(() => this.setState({ showEndDatePicker: true }), 200)
            return false
        } else if ((this.props.configInfo && this.props.configInfo.is_account_manager) && this.state.accountSelected == null) {
            setTimeout(() => this.fetchAccounts(true), 200)
            return false
        } else if (this.state.techSelected == null) {
            setTimeout(() => this.fetchUsers(true), 200)
            return false
        } else if (this.state.taskTypeSelected == null) {
            setTimeout(() => this.fetchTaskTypes(true), 200)
            return false
        } else if (this.state.iComplitedNote.trim() == '' && this.props.configInfo && this.props.configInfo.is_show_time_on_ticketlog) {
            setTimeout(() => this.iComplitedNoteRef._root.focus(), 200)
            return false
        }
        return true
    }

    /* Calling api to fetch accounts and display selection popup */
    fetchAccounts(isShowPopup = false) {
        this.setState({ showAccountNamePopup: true })
        /*
        if (this.state.accountDataSource.length > 0 && isShowPopup) {
            this.setState({ showAccountNamePopup: true })
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
        }*/
    }

    /* Calling api to fetch users and display selection popup */
    fetchUsers(isShowPopup = false) {
        this.setState({ showUsersPopup: true })
    }

    /* Calling api to fetch projects and display selection popup */
    fetchProjects(isShowPopup = false) {
        let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
        var id = this.state.account ? this.state.account.id : -1
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

    /* Calling api to fetch tickets and display selection popup */
    fetchTickets(isShowPopup = false) {
        let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
        var id = this.state.account ? this.state.account.id : -1
        if (this.state.accountSelected && this.state.accountSelected.id != null && this.state.accountSelected.id != undefined) {
            id = this.state.accountSelected.id
        }
        var projectId = 0
        if (this.state.projectSelected && this.state.projectSelected.id != null && this.state.projectSelected.id != undefined) {
            projectId = this.state.projectSelected.id
        }
        let objData = { status: 'open', account: id, project: projectId }
        ApiHelper.getWithParam(ApiHelper.Apis.Tickets, objData, this, true, authHeader).then((response) => {
            var arrTemp = []
            arrTemp.push({ value_title: 'Default', name: 'Default' })
            for (const key in response) {
                if (Object.hasOwnProperty.call(response, key)) {
                    var obj = response[key];
                    obj.value_title = `${obj.number} ${obj.subject}`
                    arrTemp.push(obj)
                }
            }
            this.setState({ ticketDataSource: arrTemp })
            if (isShowPopup) {
                this.setState({ showTicketPopup: true })
            }
        })
            .catch((response) => {
                ApiHelper.handleErrorAlert(response)
            })
    }

    /* Calling api to fetch task types and display selection popup */
    fetchTaskTypes(isShowPopup = false) {
        let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
        var id = this.state.account ? this.state.account.id : -1
        if (this.state.accountSelected && this.state.accountSelected.id != null && this.state.accountSelected.id != undefined) {
            id = this.state.accountSelected.id
        }
        var projectId = 0
        if (this.state.projectSelected && this.state.projectSelected.id != null && this.state.projectSelected.id != undefined) {
            projectId = this.state.projectSelected.id
        }

        var ticketId = 0
        if (this.state.ticketSelected && this.state.ticketSelected.id != null && this.state.ticketSelected.id != undefined) {
            ticketId = this.state.ticketSelected.id
        }

        let objData = { ticket: ticketId, account: id, project: projectId, contract: 0 }
        ApiHelper.getWithParam(ApiHelper.Apis.TaskTypes, objData, this, true, authHeader).then((response) => {
            var arrTemp = []
            for (const key in response) {
                if (Object.hasOwnProperty.call(response, key)) {
                    var obj = response[key];
                    obj.value_title = obj.name
                    arrTemp.push(obj)
                }
            }
            this.setState({ taskDataSource: arrTemp })
            if (isShowPopup) {
                this.setState({ showTaskTypePopup: true })
            }
        })
            .catch((response) => {
                ApiHelper.handleErrorAlert(response)
            })
    }

    /* Hidding(Dismissing) popup screen */
    dismissPopup(option) {
        this.setState({
            showAccountNamePopup: false,
            showDatePicker: false,
            showStartDatePicker: false,
            showEndDatePicker: false,
            showUsersPopup: false,
            showProjectPopup: false,
            showTicketPopup: false,
            showTaskTypePopup: false,
        })
    }

    /* Setting state on drop down selection change */
    selectionDidChange(dropDownName, selected, selectedData) {
        if (dropDownName === 'Account') {
            this.setState({
                accountName: selected,
                accountSelected: selectedData,
                projectSelected: null,
                ticketSelected: null,
                taskTypeSelected: null,
                isTaxable: true,
            });
        } else if (dropDownName === 'Users') {
            this.setState({ techSelected: selectedData });
        } else if (dropDownName === 'Projects') {
            this.setState({
                projectSelected: selectedData,
                ticketSelected: null,
                taskTypeSelected: null,
                isTaxable: true,
            });
        } else if (dropDownName === 'Tickets') {
            this.setState({
                ticketSelected: selectedData,
                taskTypeSelected: null,
                isTaxable: true,
            });
        } else if (dropDownName === 'Tasks') {
            this.setState({ taskTypeSelected: selectedData, isTaxable: selectedData.is_taxable });
        }
        this.dismissPopup();
    }

    /* Setting selected date to state */
    dateDidChange(date, option) {
        if (option == 'date') {
            this.setState({ date: Moment(date).format(DateFormat.YYYYMMDDTHHMMSS), showDatePicker: Platform.OS === 'android' ? false : true })
        } else if (option == 'startTime') {
            this.setState({ startTime: Moment(date).format(DateFormat.YYYYMMDDTHHMMSS), endTime: '', showStartDatePicker: Platform.OS === 'android' ? false : true })
        } else if (option == 'endTime') {
            if (this.state.startTime != '') {
                let startDate = Moment(this.state.startTime)
                let endDate = Moment(date)
                let totalHours = Moment.duration(endDate.diff(startDate)).asHours()
                console.log('====================================');
                console.log(totalHours);
                console.log('====================================');
                this.setState({ workingHours: `${totalHours >= 0 ? totalHours.toFixed(2) : (0.00).toFixed(2)}` })
            }
            this.setState({ endTime: Moment(date).format(DateFormat.YYYYMMDDTHHMMSS), showEndDatePicker: Platform.OS === 'android' ? false : true })
        }
    }

    /* Rendering popup screen */
    renderDropDownOptions() {
        if (this.state.showAccountNamePopup) {
            return (
                <AccountSelectionWithLoadMore dataSource={this.state.accountDataSource} dismissPopup={() => this.dismissPopup()} selected={this.state.accountName} selectedData={this.state.accountSelected} selectionDidChange={(selected, selectedData) => { this.selectionDidChange('Account', selected, selectedData); }} />
            )
        } else if (this.state.showUsersPopup) {
            return (
                <TechSelectionWithLoadMore dataSource={this.state.userDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.techSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Users', selected, data); }}  account={this.state.accountSelected} />
            )
        } else if (this.state.showProjectPopup) {
            return (
                <Selection dataSource={this.state.projectDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.projectSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Projects', selected, data); }} />
            )
        } else if (this.state.showTicketPopup) {
            return (
                <Selection dataSource={this.state.ticketDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.ticketSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Tickets', selected, data); }} />
            )
        } else if (this.state.showTaskTypePopup) {
            return (
                <Selection dataSource={this.state.taskDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.taskTypeSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Tasks', selected, data); }} />
            )
        } else {
            return null
        }
    }

    /* Rendering date picker view */
    renderDatePicker() {
        if (this.state.showDatePicker) {
            return (
                <DatePickerView mode='date' minDate={null} maxDate={new Date()} dismissPopup={() => this.dismissPopup()} selectedDate={this.state.date} dateDidChange={(date) => { this.dateDidChange(date, 'date'); }} />
            )
        } else if (this.state.showStartDatePicker) {
            return (
                <DatePickerView mode='time' minDate={null} maxDate={null} dismissPopup={() => this.dismissPopup()} selectedDate={this.state.startTime} dateDidChange={(date) => { this.dateDidChange(date, 'startTime'); }} />
            )
        } else if (this.state.showEndDatePicker) {
            return (
                <DatePickerView mode='time' minDate={this.state.startTime != '' ? new Date(this.state.startTime) : null} maxDate={null} dismissPopup={() => this.dismissPopup()} selectedDate={this.state.endTime} dateDidChange={(date) => { this.dateDidChange(date, 'endTime'); }} />
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
                    style={[styles.backgroundImage, { borderRadius: 0 }]} />
                <SafeAreaView>
                    <NavigationBar
                        isTransparent
                        navigation={this.props.navigation}
                        showTitle={this.state.isEdit ? 'Edit Time' : 'Add Time'}
                    />
                </SafeAreaView>
                {this.renderDropDownOptions()}
                {this.renderDatePicker()}
                <View style={styles.contentContainer}>
                    <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
                        <SafeAreaView style={styles.mainContainer}>
                            <View style={[styles.mainContainer, { paddingTop: 30, paddingBottom: 30 }]}>
                                {this.state.isEdit ?
                                    <View>
                                        <Label style={[styles.inputTitle, styles.placeholderColor]}>Date</Label>
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            style={[styles.inputContainer, { marginLeft: Metrics.baseMargin, marginRight: Metrics.baseMargin }, this.state.currentEditingField == 'startTime' ? styles.inputActive : styles.inputInactive]}
                                            onPress={() => { this.setState({ showDatePicker: true }) }}>
                                            <Input
                                                pointerEvents={'none'}
                                                editable={false}
                                                style={styles.input}
                                                placeholder='Date'
                                                placeholderTextColor={Colors.placeholder}
                                                autoCapitalize='words'
                                                selectionColor={Colors.mainPrimary}
                                                value={Moment(this.state.date).utc().format(DateFormat.ESHORTMMMDDYYYY)}
                                                onChangeText={value => this.setState({ date: value })}
                                                blurOnSubmit={false}
                                                keyboardAppearance='dark'
                                                returnKeyType={"next"}
                                                onFocus={value => {
                                                    this.setState({ currentEditingField: 'startTime' })
                                                }}
                                                onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                ref={input => {
                                                    this.startTimeRef = input;
                                                }}
                                                onSubmitEditing={() => {
                                                    this.endTimeRef._root.focus();
                                                }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    : <View style={styles.topContainer}>
                                        <Image style={styles.backgroundImage} source={Images.addTimeBg} />
                                        <TouchableOpacity activeOpacity={0.7} style={styles.buttonDateContainer} onPress={() => {
                                            this.setState({ showDatePicker: true })
                                        }}>
                                            <Text style={styles.dateText}>{Moment(this.state.date).format(DateFormat.ESHORTMMMDDYYYY)}</Text>
                                        </TouchableOpacity>
                                        <Label style={styles.timeText}>{new Date(this.state.counter * 1000).toISOString().substr(11, 8)}</Label>
                                        <TouchableOpacity activeOpacity={0.95} style={styles.buttonStartStopContainer} onPress={() => {
                                            if (this.state.timer) {
                                                console.log('====================================');
                                                console.log('Inside');
                                                console.log('====================================');
                                                clearInterval(this.state.timer);
                                                var arrDates = this.state.counterDates
                                                arrDates.push(new Date().toISOString())
                                                CommonFunctions.storeData(UserDataKeys.CounterDates, arrDates.join(', ')).then(() => {
                                                    Toast.show({
                                                        text: `Time log has been recorded.`,
                                                        position: 'top',
                                                        duration: 3000,
                                                        type: 'success',
                                                        style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
                                                    })
                                                    this.calculateTime()
                                                }).catch(() => {
                                                    Toast.show({
                                                        text: `Unable to record time log.`,
                                                        position: 'top',
                                                        duration: 3000,
                                                        type: 'danger',
                                                        style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
                                                    })
                                                })
                                                this.setState({ timer: null, counterDates: arrDates });
                                            } else {
                                                console.log('====================================');
                                                console.log('Out Inside');
                                                console.log('====================================');
                                                let timer = setInterval(this.tick, 1000);
                                                var arrDates = this.state.counterDates
                                                arrDates.push(new Date().toISOString())
                                                CommonFunctions.storeData(UserDataKeys.CounterDates, arrDates.join(', '))
                                                this.setState({ timer, counterDates: arrDates });
                                            }
                                        }}>
                                            <Text style={styles.buttonStartStopText}>{this.state.timer ? 'Stop' : 'Start'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity activeOpacity={0.7} style={styles.buttonResetContainer} onPress={() => {
                                            clearInterval(this.state.timer);
                                            CommonFunctions.storeData(UserDataKeys.CounterDates, '')
                                            this.setState({ timer: null, counter: 0, counterDates: [], startDate: '', endDate: '', workingHours: '0.00', nonWorkingHours: '0.00' });
                                        }}>
                                            <Image style={styles.resetIcon} source={Images.reset} />
                                        </TouchableOpacity>
                                    </View>}
                                <View style={styles.multifieldContainer}>
                                    <View style={styles.filedContainer}>
                                        <Label style={[styles.inputTitle, styles.placeholderColor]}>Working Hours</Label>
                                        <View style={styles.hoursContainer}>
                                            <TouchableOpacity style={styles.buttonAddMinusContainer} onPress={() => {
                                                var workingHours = Number(this.state.workingHours)
                                                if (workingHours > 0.24) {
                                                    workingHours -= 0.25
                                                    this.setState({ workingHours: `${workingHours.toFixed(2)}` })
                                                }
                                            }}>
                                                <Image source={Images.minus} />
                                            </TouchableOpacity>
                                            <View style={[styles.inputContainer, styles.hoursInput, this.state.currentEditingField == 'WorkingHours' ? styles.inputActive : styles.inputInactive]}>
                                                <Input
                                                    style={[styles.input, { textAlign: 'center' }]}
                                                    placeholder='0:00'
                                                    placeholderTextColor={Colors.placeholder}
                                                    selectionColor={Colors.mainPrimary}
                                                    value={this.state.workingHours}
                                                    onChangeText={value => this.setState({ workingHours: value })}
                                                    blurOnSubmit={false}
                                                    selectTextOnFocus={true}
                                                    keyboardAppearance='dark'
                                                    keyboardType='numeric'
                                                    returnKeyType={"next"}
                                                    onFocus={value => {
                                                        this.setState({ currentEditingField: 'WorkingHours' })
                                                    }}
                                                    onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                    ref={input => {
                                                        this.workingHoursRef = input;
                                                    }}
                                                    onSubmitEditing={() => {
                                                        this.nonWorkingHoursRef._root.focus();
                                                    }}
                                                />
                                            </View>
                                            <TouchableOpacity style={styles.buttonAddMinusContainer} onPress={() => {
                                                var workingHours = Number(this.state.workingHours)
                                                workingHours += 0.25
                                                this.setState({ workingHours: `${workingHours.toFixed(2)}` })
                                            }}>
                                                <Image source={Images.addTech} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={styles.filedContainer}>
                                        <Label style={[styles.inputTitle, styles.placeholderColor]}>Non-Working Hours</Label>
                                        <View style={styles.hoursContainer}>
                                            <TouchableOpacity style={styles.buttonAddMinusContainer} onPress={() => {
                                                var nonWorkingHours = Number(this.state.nonWorkingHours)
                                                if (nonWorkingHours > 0.24) {
                                                    nonWorkingHours -= 0.25
                                                    this.setState({ nonWorkingHours: `${nonWorkingHours.toFixed(2)}` })
                                                }
                                            }}>
                                                <Image source={Images.minus} />
                                            </TouchableOpacity>
                                            <View style={[styles.inputContainer, styles.hoursInput, this.state.currentEditingField == 'nonWorkingHours' ? styles.inputActive : styles.inputInactive]}>
                                                <Input
                                                    style={[styles.input, { textAlign: 'center' }]}
                                                    placeholder='0:00'
                                                    placeholderTextColor={Colors.placeholder}
                                                    selectionColor={Colors.mainPrimary}
                                                    value={this.state.nonWorkingHours}
                                                    onChangeText={value => {
                                                        this.setState({ nonWorkingHours: value })
                                                    }}
                                                    blurOnSubmit={false}
                                                    selectTextOnFocus={true}
                                                    keyboardAppearance='dark'
                                                    returnKeyType={"next"}
                                                    keyboardType='numeric'
                                                    onFocus={value => {
                                                        this.setState({ currentEditingField: 'nonWorkingHours' })
                                                    }}
                                                    onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                    ref={input => {
                                                        this.nonWorkingHoursRef = input;
                                                    }}
                                                    onSubmitEditing={() => {
                                                        this.startTimeRef._root.focus();
                                                    }}
                                                />
                                            </View>
                                            <TouchableOpacity style={styles.buttonAddMinusContainer} onPress={() => {
                                                var nonWorkingHours = Number(this.state.nonWorkingHours)
                                                nonWorkingHours += 0.25
                                                this.setState({ nonWorkingHours: `${nonWorkingHours.toFixed(2)}` })
                                            }}>
                                                <Image source={Images.addTech} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.multifieldContainer}>
                                    <View style={styles.filedContainer}>
                                        <Label style={[styles.inputTitle, styles.placeholderColor]}>Start Time</Label>
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            style={[styles.inputContainer, { marginLeft: Metrics.baseMargin, marginRight: Metrics.baseMargin }, this.state.currentEditingField == 'startTime' ? styles.inputActive : styles.inputInactive]}
                                            onPress={() => { this.setState({ showStartDatePicker: true }) }}>
                                            <Input
                                                pointerEvents={'none'}
                                                editable={false}
                                                style={[styles.input, { textAlign: 'center' }]}
                                                placeholder='Start Time'
                                                placeholderTextColor={Colors.placeholder}
                                                autoCapitalize='words'
                                                selectionColor={Colors.mainPrimary}
                                                value={this.state.startTime ? Moment(this.state.startTime).format(DateFormat.HMMA) : ''}
                                                onChangeText={value => this.setState({ startTime: value })}
                                                blurOnSubmit={false}
                                                keyboardAppearance='dark'
                                                returnKeyType={"next"}
                                                onFocus={value => {
                                                    this.setState({ currentEditingField: 'startTime' })
                                                }}
                                                onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                ref={input => {
                                                    this.startTimeRef = input;
                                                }}
                                                onSubmitEditing={() => {
                                                    this.endTimeRef._root.focus();
                                                }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.filedContainer}>
                                        <Label style={[styles.inputTitle, styles.placeholderColor]}>End Time</Label>
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            style={[styles.inputContainer, { marginLeft: Metrics.baseMargin, marginRight: Metrics.baseMargin }, this.state.currentEditingField == 'endTime' ? styles.inputActive : styles.inputInactive]}
                                            onPress={() => { this.setState({ showEndDatePicker: true }) }}>
                                            <Input
                                                pointerEvents={'none'}
                                                editable={false}
                                                style={[styles.input, { textAlign: 'center' }]}
                                                placeholder='End Time'
                                                placeholderTextColor={Colors.placeholder}
                                                autoCapitalize='words'
                                                selectionColor={Colors.mainPrimary}
                                                value={this.state.endTime ? Moment(this.state.endTime).format(DateFormat.HMMA) : ''}
                                                onChangeText={value => this.setState({ endTime: value })}
                                                blurOnSubmit={false}
                                                keyboardAppearance='dark'
                                                returnKeyType={"next"}
                                                onFocus={value => {
                                                    this.setState({ currentEditingField: 'endTime' })
                                                }}
                                                onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                ref={input => {
                                                    this.endTimeRef = input;
                                                }}
                                                onSubmitEditing={() => {
                                                    this.accountRef._root.focus();
                                                }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
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
                                                value={this.state.accountSelected ? this.state.accountSelected.name : ''}
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
                                <View>
                                    <Label style={[styles.inputTitle, styles.placeholderColor]}>{this.state.ticketTitle}</Label>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={[styles.inputContainer, this.state.currentEditingField == 'ticket' ? styles.inputActive : styles.inputInactive]}
                                        onPress={() => {
                                            if (!this.state.isDisableFields) {
                                                this.fetchTickets(true)
                                            }
                                        }}>
                                        <Input
                                            pointerEvents={'none'}
                                            editable={false}
                                            style={[styles.input, this.state.isDisableFields ? { color: Colors.textGray } : {}]}
                                            placeholder={this.state.ticketTitle}
                                            placeholderTextColor={Colors.placeholder}
                                            autoCapitalize='words'
                                            selectionColor={Colors.mainPrimary}
                                            value={this.state.ticketSelected ? (this.state.ticketSelected.number ? (`#${this.state.ticketSelected.number} ${this.state.ticketSelected.subject}`) : 'Default') : ''}
                                            // onChangeText={value => this.setState({ accountType: value })}
                                            blurOnSubmit={false}
                                            keyboardAppearance='dark'
                                            returnKeyType={"next"}
                                            onFocus={value => {
                                                this.setState({ currentEditingField: 'ticket' })
                                            }}
                                            onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                            ref={input => {
                                                this.ticketRef = input;
                                            }}
                                            onSubmitEditing={() => {
                                                this.techRef._root.focus();
                                            }}
                                        />
                                        <Image style={styles.rightIcon} source={Images.downarrow} />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <Label style={[styles.inputTitle, styles.placeholderColor]}>{this.state.techTitle}</Label>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={[styles.inputContainer, this.state.currentEditingField == 'tech' ? styles.inputActive : styles.inputInactive]}
                                        onPress={() => { this.fetchUsers(true) }}>
                                        <Input
                                            pointerEvents={'none'}
                                            editable={false}
                                            style={styles.input}
                                            placeholder={this.state.techTitle}
                                            placeholderTextColor={Colors.placeholder}
                                            autoCapitalize='words'
                                            selectionColor={Colors.mainPrimary}
                                            value={this.state.techSelected ? (this.state.techSelected.firstname + ' ' + this.state.techSelected.lastname) : ''}
                                            // onChangeText={value => this.setState({ accountType: value })}
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
                                                this.taskTypeRef._root.focus();
                                            }}
                                        />
                                        <Image style={styles.rightIcon} source={Images.downarrow} />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <Label style={[styles.inputTitle, styles.placeholderColor]}>Service</Label>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={[styles.inputContainer, this.state.currentEditingField == 'taskType' ? styles.inputActive : styles.inputInactive]}
                                        onPress={() => { this.fetchTaskTypes(true) }}>
                                        <Input
                                            pointerEvents={'none'}
                                            editable={false}
                                            style={styles.input}
                                            placeholder='Service'
                                            placeholderTextColor={Colors.placeholder}
                                            autoCapitalize='words'
                                            selectionColor={Colors.mainPrimary}
                                            value={this.state.taskTypeSelected ? this.state.taskTypeSelected.name : ''}
                                            // onChangeText={value => this.setState({ accountType: value })}
                                            blurOnSubmit={false}
                                            keyboardAppearance='dark'
                                            returnKeyType={"next"}
                                            onFocus={value => {
                                                this.setState({ currentEditingField: 'taskType' })
                                            }}
                                            onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                            ref={input => {
                                                this.taskTypeRef = input;
                                            }}
                                            onSubmitEditing={() => {
                                                this.iComplitedNoteRef._root.focus();
                                            }}
                                        />
                                        <Image style={styles.rightIcon} source={Images.downarrow} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.multifieldContainer}>
                                    <View style={styles.switchContainer}>
                                        <TouchableOpacity onPress={() => {
                                            this.setState({ isDoNotInvoice: !this.state.isDoNotInvoice })
                                        }}>
                                            <Image style={styles.switchIcon} source={this.state.isDoNotInvoice ? Images.toggleOn : Images.toggleOff} />
                                        </TouchableOpacity>
                                        <Label style={styles.switchTitle}>Do not Invoice</Label>
                                    </View>
                                    <View style={styles.switchContainer}>
                                        <TouchableOpacity onPress={() => {
                                            this.setState({ isTaxable: !this.state.isTaxable })
                                        }}>
                                            <Image style={styles.switchIcon} source={this.state.isTaxable ? Images.toggleOn : Images.toggleOff} />
                                        </TouchableOpacity>
                                        <Label style={styles.switchTitle}>Taxable</Label>
                                    </View>
                                </View>
                                <View>
                                    <Label style={[styles.inputTitle, styles.placeholderColor]}>Notes</Label>
                                    <View style={[styles.inputContainer, { height: 100, paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10 }, this.state.currentEditingField == 'iComplitedNote' ? styles.inputActive : styles.inputInactive]}>
                                        <Textarea
                                            style={[styles.input, { height: '100%', width: '100%' }]}
                                            placeholder='I Completed'
                                            placeholderTextColor={Colors.placeholder}
                                            selectionColor={Colors.mainPrimary}
                                            value={this.state.iComplitedNote}
                                            onChangeText={value => this.setState({ iComplitedNote: value })}
                                            blurOnSubmit={false}
                                            keyboardAppearance='dark'
                                            // returnKeyType={"next"}
                                            onFocus={value => {
                                                this.setState({ currentEditingField: 'iComplitedNote' })
                                            }}
                                            onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                            ref={input => {
                                                this.iComplitedNoteRef = input;
                                            }}
                                        // onSubmitEditing={() => {
                                        //     this.internalCommentsRef._root.focus();
                                        // }}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <Label style={[styles.inputTitle, styles.placeholderColor]}>Internal notes</Label>
                                    <View style={[styles.inputContainer, { height: 100, paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10 }, this.state.currentEditingField == 'internalComments' ? styles.inputActive : styles.inputInactive]}>
                                        <Textarea
                                            style={[styles.input, { height: '100%', width: '100%' }]}
                                            placeholder='Internal notes'
                                            placeholderTextColor={Colors.placeholder}
                                            selectionColor={Colors.mainPrimary}
                                            value={this.state.internalNote}
                                            onChangeText={value => this.setState({ internalNote: value })}
                                            blurOnSubmit={false}
                                            keyboardAppearance='dark'
                                            // returnKeyType={"go"}
                                            onFocus={value => {
                                                this.setState({ currentEditingField: 'internalComments' })
                                            }}
                                            onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                            ref={input => {
                                                this.internalCommentsRef = input;
                                            }}
                                        // onSubmitEditing={() => {
                                        //     if (this.state.isEdit) {
                                        //         this.btnUpdateTimePressed()
                                        //     } else {
                                        //         this.btnAddTimePressed()
                                        //     }
                                        // }}
                                        />
                                    </View>
                                </View>
                                <TouchableOpacity activeOpacity={0.7} style={styles.buttonContainer} onPress={() => {
                                    if (this.state.isEdit) {
                                        this.btnUpdateTimePressed()
                                    } else {
                                        this.btnAddTimePressed()
                                    }
                                }}>
                                    <Text style={styles.buttonText}>{this.state.isEdit ? 'Update Time' : 'Add Time'}</Text>
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
export default connect(mapStateToProps)(AddTime);