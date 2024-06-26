/* Imports */
import React, { Component } from 'react'
import { ScrollView, Image, View, TouchableOpacity, Platform, StatusBar, SafeAreaView, Text, Keyboard } from 'react-native'
import { Container, Label, Input, Toast, Textarea } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import Moment from 'moment';
import MomentTimezone from 'moment-timezone';

import ValidationHelper from '../../../Components/ValidationHelper';
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
import styles from './Styles/AddEditEventStyles'

class AddEditEvent extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            startDate: '',
            endDate: '',
            accountSelected: null,
            projectSelected: null,
            ticketSelected: null,
            techSelected: null,
            categorySelected: null,
            isMyEvent: false,
            description: '',
            account: null,
            showAccountNamePopup: false,
            accountDataSource: [],
            showStartDatePicker: false,
            showEndDatePicker: false,
            showStartTimePicker: false,
            showEndTimePicker: false,
            showTechsPopup: false,
            techsDataSource: [],
            showProjectPopup: false,
            projectDataSource: [],
            showTicketPopup: false,
            ticketDataSource: [],
            showCategoryPopup: false,
            categoryDataSource: [],
            ticketsTitle: 'Tickets',
            ticketTitle: 'Ticket',
            accountTitle: 'Account',
            accountsTitle: 'Accounts',
            techTitle: 'Tech',
            technicianTitle: 'Technician',
            techsTitle: 'Technicians',
            event: null,
            isEdit: false,
            isDisableFields: false,
            ticket: null,
            datePickerMode: 'datetime',
        };
    }

    componentDidMount() {
        this.setState({
            loading: false,
            startDate: '',
            endDate: '',
            accountSelected: null,
            projectSelected: null,
            ticketSelected: null,
            techSelected: null,
            categorySelected: null,
            isMyEvent: false,
            description: '',
            account: null,
            showAccountNamePopup: false,
            accountDataSource: [],
            showStartDatePicker: false,
            showEndDatePicker: false,
            showStartTimePicker: false,
            showEndTimePicker: false,
            showTechsPopup: false,
            techsDataSource: [],
            showProjectPopup: false,
            projectDataSource: [],
            showTicketPopup: false,
            ticketDataSource: [],
            showCategoryPopup: false,
            categoryDataSource: [],
            ticketsTitle: 'Tickets',
            ticketTitle: 'Ticket',
            accountTitle: 'Account',
            accountsTitle: 'Accounts',
            techTitle: 'Tech',
            technicianTitle: 'Technician',
            techsTitle: 'Technicians',
            event: null,
            isEdit: false,
            isDisableFields: false,
            subject: '',
            ticket: null,
            datePickerMode: 'datetime',
        });

        CommonFunctions.retrieveData(UserDataKeys.Config)
            .then((response) => {
                let config = JSON.parse(response)
                var ticketsTitle = 'Tickets'
                var ticketTitle = 'Ticket'
                var accountTitle = 'Account'
                var accountsTitle = 'Accounts'
                var techTitle = 'Tech'
                var technicianTitle = 'Technician'
                var techsTitle = 'Technicians'
                if (config.is_customnames) {
                    ticketsTitle = config.names.ticket.p ?? 'Tickets'
                    ticketTitle = config.names.ticket.s ?? 'Ticket'
                    accountsTitle = config.names.account.p ?? 'Accounts'
                    accountTitle = config.names.account.s ?? 'Account'
                    technicianTitle = config.names.tech.s ?? 'Technician'
                    techsTitle = config.names.tech.p ?? 'Technicians'
                    techTitle = config.names.tech.a ?? 'Tech'
                }

                this.setState({ ticketsTitle, ticketTitle, accountsTitle, accountTitle, techsTitle, technicianTitle, techTitle })
            })

        if (this.props.navigation.state.params !== undefined) {
            if (this.props.navigation.state.params.account !== undefined) {
                this.setState({ account: this.props.navigation.state.params.account })
                    this.setState({
                        accountSelected: {
                            id: this.props.navigation.state.params.account.id ? this.props.navigation.state.params.account.id : undefined,
                            name: this.props.navigation.state.params.account.name ? this.props.navigation.state.params.account.name : 'Default',
                            value_title: this.props.navigation.state.params.account.name,
                        }
                    })
                }
            if (this.props.navigation.state.params.event !== undefined) {
                this.setState({ event: this.props.navigation.state.params.event, isEdit: true })
            }

            if (this.props.navigation.state.params.ticket !== undefined) {
                this.setState({ ticket: this.props.navigation.state.params.ticket })
            }
        }

        setTimeout(() => {
            if (this.state.event) {
                this.setState({
                    isEdit: true,
                    startDate: Moment(this.state.event.start_date).format(DateFormat.YYYYMMDDTHHMMSS),
                    endDate: Moment(this.state.event.end_date).format(DateFormat.YYYYMMDDTHHMMSS),
                    subject: this.state.event.subject,
                    // isDisableFields: (this.state.event.project_id || this.state.event.ticket_id),
                    accountSelected: {
                        id: this.state.event.account_id ? this.state.event.account_id : undefined,
                        name: this.state.event.account_name ? this.state.event.account_name : 'Default',
                        value_title: this.state.event.account_name,
                    },
                    projectSelected: {
                        id: this.state.event.project_id ? this.state.event.project_id : undefined,
                        name: this.state.event.project_name ? this.state.event.project_name : 'Default',
                        value_title: this.state.event.project_name,
                    },
                    ticketSelected: {
                        id: this.state.event.ticket_id ? this.state.event.ticket_id : undefined,
                        key: this.state.event.ticket_key ? this.state.event.ticket_key : this.state.event.ticket_id ? this.state.event.ticket_id : undefined,
                        number: this.state.event.ticket_number ? this.state.event.ticket_number : undefined,
                        subject: this.state.event.ticket_name ? this.state.event.ticket_name : 'Default',
                        value_title: `${this.state.event.ticket_number || ''} ${this.state.event.ticket_name}`,
                    },
                    techSelected: {
                        id: this.state.event.tech_id ? this.state.event.tech_id : undefined,
                        firstname: this.state.event.tech_name ? this.state.event.tech_name : 'Default',
                        lastname: '',
                        email: this.state.event.tech_email || '',
                        value_title: `${this.state.event.tech_name} (${this.state.event.tech_email || ''})`,
                    },
                    categorySelected: {
                        id: this.state.event.event_type_id ? this.state.event.event_type_id : undefined,
                        name: this.state.event.event_type_name ? this.state.event.event_type_name : 'Default',
                        value_title: this.state.event.event_type_name,
                    },
                    isMyEvent: this.state.event.is_personal,
                    description: this.state.event.description,
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
                        value_title: `${this.state.ticket.tech_firstname} ${this.state.ticket.tech_lastname} (${this.state.ticket.user_email})`,
                    },
                    ticketSelected: {
                        id: this.state.ticket.id ? this.state.ticket.id : undefined,
                        key: this.state.ticket.key ? this.state.ticket.key : (this.state.ticket.id ? this.state.ticket.id : undefined),
                        number: this.state.ticket.number ? this.state.ticket.number : undefined,
                        subject: this.state.ticket.subject ? this.state.ticket.subject : 'Default',
                        value_title: `${this.state.ticket.number} ${this.state.ticket.subject}`,
                    },
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
        Keyboard.dismiss();
    }

    //Actions

    /* Validating information and calling create in api */
    btnAddEventPressed() {
        /* Checking validation if it's valid calling API*/
        if (this.isValid()) {
            Keyboard.dismiss();

            var obj = {
                'subject': this.state.subject,
                'description': this.state.description,
                'start_date': this.state.startDate,
                'end_date': this.state.endDate,
                'user_id': this.props.configInfo && this.props.configInfo.user.user_id || '',
                'shared_event_id': '',
                'event_type': 2,
                'timezone': MomentTimezone.tz.guess(),
            }

            if (this.state.accountSelected && this.state.accountSelected.id != null && this.state.accountSelected.id != undefined) {
                obj.account = this.state.accountSelected.id
            }

            if (this.state.techSelected && this.state.techSelected.id != null && this.state.techSelected.id != undefined) {
                obj.tech_id = this.state.techSelected.id
            }

            if (this.state.projectSelected && this.state.projectSelected.id != null && this.state.projectSelected.id != undefined) {
                obj.project = this.state.projectSelected.id
            }

            if (this.state.ticketSelected && this.state.ticketSelected.id != null && this.state.ticketSelected.id != undefined) {
                obj.ticket = this.state.ticketSelected.id
            }

            if (this.state.categorySelected && this.state.categorySelected.id != null && this.state.categorySelected.id != undefined) {
                obj.event_type_id = this.state.categorySelected.id
            }
            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))

            ApiHelper.postWithParam(ApiHelper.Apis.Events, obj, this, true, authHeader)
                .then((response) => {
                    this.props.navigation.goBack();
                    Toast.show({
                        text: `Event has been added successfully.`,
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


    /* Validating information and calling update api */
    btnUpdateEventPressed() {
        /* Checking validation if it's valid calling API*/
        if (this.isValid()) {
            Keyboard.dismiss();
            // return
            var obj = {
                'subject': this.state.subject,
                'description': this.state.description,
                'start_date': this.state.startDate,
                'end_date': this.state.endDate,
                'user_id': this.props.configInfo && this.props.configInfo.user.user_id || '',
                'shared_event_id': this.state.event.shared_event_id,
                'event_type': this.state.event.event_type,
                'timezone': this.state.event.timezone,
                'event_id': this.state.event.event_id
            }

            if (this.state.accountSelected && this.state.accountSelected.id != null && this.state.accountSelected.id != undefined) {
                obj.account = this.state.accountSelected.id
            }

            if (this.state.techSelected && this.state.techSelected.id != null && this.state.techSelected.id != undefined) {
                obj.tech_id = this.state.techSelected.id
            }

            if (this.state.projectSelected && this.state.projectSelected.id != null && this.state.projectSelected.id != undefined) {
                obj.project = this.state.projectSelected.id
            }

            if (this.state.ticketSelected && this.state.ticketSelected.id != null && this.state.ticketSelected.id != undefined) {
                obj.ticket = this.state.ticketSelected.id
            }

            if (this.state.categorySelected && this.state.categorySelected.id != null && this.state.categorySelected.id != undefined) {
                obj.event_type_id = this.state.categorySelected.id
            }

            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))

            ApiHelper.putWithParam(ApiHelper.Apis.Events + `/${this.state.event.event_id}`, obj, this, true, authHeader)
                .then((response) => {
                    this.props.navigation.goBack();
                    Toast.show({
                        text: `Event has been updated successfully.`,
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

    /* Hidding(Dismissing) popup screen */
    dismissPopup(option) {
        this.setState({
            showAccountNamePopup: false,
            showStartDatePicker: false,
            showEndDatePicker: false,
            showTechsPopup: false,
            showProjectPopup: false,
            showTicketPopup: false,
            showCategoryPopup: false,
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
            });
        } else if (dropDownName === 'Techs') {
            this.setState({
                techSelected: selectedData,
            });
        } else if (dropDownName === 'Projects') {
            this.setState({
                projectSelected: selectedData,
                ticketSelected: null,
            });
        } else if (dropDownName === 'Tickets') {
            this.setState({
                ticketSelected: selectedData,
            });
        } else if (dropDownName === 'Category') {
            this.setState({ categorySelected: selectedData });
        }
        this.dismissPopup();
    }

    /* Setting selected date to state */
    dateDidChange(date, option) {
        if (option == 'startDate') {
            this.setState({ startDate: Moment(date).format(DateFormat.YYYYMMDDTHHMMSS), showStartDatePicker: Platform.OS == 'android' ? false : true, })
            if (Platform.OS == 'android') {
                this.setState({ showStartTimePicker: true })
            }
        } else if (option == 'startTime') {
            this.setState({ startDate: Moment(date).format(DateFormat.YYYYMMDDTHHMMSS), showStartTimePicker: false })
        } else if (option == 'endDate') {
            this.setState({ endDate: Moment(date).format(DateFormat.YYYYMMDDTHHMMSS), showEndDatePicker: Platform.OS == 'android' ? false : true })
            if (Platform.OS == 'android') {
                this.setState({ showEndTimePicker: true })
            }
        } else if (option == 'endTime') {
            this.setState({ endDate: Moment(date).format(DateFormat.YYYYMMDDTHHMMSS), showEndTimePicker: false })
        }
    }

    //Class Methods

    /* Checking validation and returns true/false */
    isValid() {
        if (this.state.accountSelected == null) {
            setTimeout(() => this.fetchAccounts(true), 200)
            return false
        } else if (ValidationHelper.isInvalidText(this.state.subject)) {
            setTimeout(() => this.subjectRef._root.focus(), 200)
            return false
        } else if (ValidationHelper.isInvalidText(this.state.description)) {
            setTimeout(() => this.descriptionRef._root.focus(), 200)
            return false
        } else if (this.state.categorySelected == null) {
            setTimeout(() => this.fetchCategories(true), 200)
            return false
        } else if (ValidationHelper.isInvalidText(this.state.startDate)) {
            setTimeout(() => this.setState({ showStartDatePicker: true }), 200)
            return false
        } else if (ValidationHelper.isInvalidText(this.state.endDate)) {
            setTimeout(() => this.setState({ showEndDatePicker: true }), 200)
            return false
        }
        return true
    }

    /* Calling api to fetch accounts and display selection popup  */
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

    /* Calling api to fetch techs and display selection popup  */
    fetchTechs(isShowPopup = false) {
        this.setState({ showTechsPopup: true })
    }

    /* Calling api to fetch projects and display selection popup  */
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

    /* Calling api to fetch tickets and display selection popup  */
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

    /* Calling api to fetch categories and display selection popup  */
    fetchCategories(isShowPopup = false) {
        if (this.state.categoryDataSource.length > 0 && isShowPopup) {
            this.setState({ showCategoryPopup: true })
        } else {
            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
            ApiHelper.getWithParam(ApiHelper.Apis.EventTypes, {}, this, true, authHeader).then((response) => {
                var arrTemp = []
                // arrTemp.push({ value_title: 'Default', name: 'Default' })
                for (const key in response) {
                    if (Object.hasOwnProperty.call(response, key)) {
                        var obj = response[key];
                        obj.value_title = obj.name
                        arrTemp.push(obj)
                    }
                }
                this.setState({ categoryDataSource: arrTemp })
                if (isShowPopup) {
                    this.setState({ showCategoryPopup: true })
                }
            })
                .catch((response) => {
                    ApiHelper.handleErrorAlert(response)
                })
        }
    }


    /* Rendering popup screen */
    renderDropDownOptions() {
        if (this.state.showAccountNamePopup) {
            return (
                <AccountSelectionWithLoadMore dataSource={this.state.accountDataSource} defaultOption={{ value_title: 'Default', name: 'Default' }} dismissPopup={() => this.dismissPopup()} selected={this.state.accountName} selectedData={this.state.accountSelected} selectionDidChange={(selected, selectedData) => { this.selectionDidChange('Account', selected, selectedData); }} />
            )
        } else if (this.state.showTechsPopup) {
            return (
                <TechSelectionWithLoadMore dataSource={this.state.techsDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.techSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Techs', selected, data); }} account={this.state.accountSelected}/>
            )
        } else if (this.state.showProjectPopup) {
            return (
                <Selection dataSource={this.state.projectDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.projectSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Projects', selected, data); }} />
            )
        } else if (this.state.showTicketPopup) {
            return (
                <Selection dataSource={this.state.ticketDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.ticketSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Tickets', selected, data); }} />
            )
        } else if (this.state.showCategoryPopup) {
            return (
                <Selection dataSource={this.state.categoryDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.categorySelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Category', selected, data); }} />
            )
        } else {
            return null
        }
    }

    /* Rendering date picker view */
    renderDatePicker() {
        if (this.state.showStartDatePicker) {
            return (
                <DatePickerView mode={Platform.OS == 'android' ? 'date' : 'datetime'} minDate={null} maxDate={this.state.endDate && this.state.endDate != '' ? (new Date(this.state.endDate)) : null} dismissPopup={() => this.dismissPopup()} selectedDate={this.state.startDate} dateDidChange={(date) => { this.dateDidChange(date, 'startDate'); }} />
            )
        } else if (this.state.showStartTimePicker) {
            return (
                <DatePickerView mode={'time'} minDate={null} maxDate={this.state.endDate && this.state.endDate != '' ? (new Date(this.state.endDate)) : null} dismissPopup={() => this.dismissPopup()} selectedDate={this.state.startDate} dateDidChange={(date) => { this.dateDidChange(date, 'startTime'); }} />
            )
        } else if (this.state.showEndTimePicker) {
            return (
                <DatePickerView mode={'time'} minDate={this.state.startDate && this.state.startDate != '' ? (new Date(this.state.startDate)) : null} maxDate={null} dismissPopup={() => this.dismissPopup()} selectedDate={this.state.endDate} dateDidChange={(date) => { this.dateDidChange(date, 'endTime'); }} />
            )
        } else if (this.state.showEndDatePicker) {
            return (
                <DatePickerView mode={Platform.OS == 'android' ? 'date' : 'datetime'} minDate={this.state.startDate && this.state.startDate != '' ? (new Date(this.state.startDate)) : null} maxDate={null} dismissPopup={() => this.dismissPopup()} selectedDate={this.state.endDate} dateDidChange={(date) => { this.dateDidChange(date, 'endDate'); }} />
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
                        showTitle={this.state.isEdit ? 'Edit Event' : 'Add Event'}
                    />
                </SafeAreaView>
                {this.renderDropDownOptions()}
                {this.renderDatePicker()}
                <View style={styles.contentContainer}>
                    <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
                        <SafeAreaView style={styles.mainContainer}>
                            <View style={[styles.mainContainer, { paddingTop: 30, paddingBottom: 30 }]}>
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
                                            value={this.state.ticketSelected ? (this.state.ticketSelected.id ? (`#${this.state.ticketSelected.number || ''} ${this.state.ticketSelected.subject}`) : 'Default') : ''}
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
                                                this.descriptionRef._root.focus();
                                            }}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <Label style={[styles.inputTitle, styles.placeholderColor]}>Description</Label>
                                    <View style={[styles.inputContainer, { height: 100, paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10 }, this.state.currentEditingField == 'description' ? styles.inputActive : styles.inputInactive]}>
                                        <Textarea
                                            style={[styles.input, { height: '100%', width: '100%' }]}
                                            placeholder='Description'
                                            placeholderTextColor={Colors.placeholder}
                                            selectionColor={Colors.mainPrimary}
                                            value={this.state.description}
                                            onChangeText={value => this.setState({ description: value })}
                                            blurOnSubmit={false}
                                            keyboardAppearance='dark'
                                            // returnKeyType={"next"}
                                            onFocus={value => {
                                                this.setState({ currentEditingField: 'description' })
                                            }}
                                            onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                            ref={input => {
                                                this.descriptionRef = input;
                                            }}
                                        // onSubmitEditing={() => {
                                        //     this.subjectRef._root.focus();
                                        // }}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <Label style={[styles.inputTitle, styles.placeholderColor]}>{this.state.technicianTitle}</Label>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={[styles.inputContainer, this.state.currentEditingField == 'tech' ? styles.inputActive : styles.inputInactive]}
                                        onPress={() => { this.fetchTechs(true) }}>
                                        <Input
                                            pointerEvents={'none'}
                                            editable={false}
                                            style={styles.input}
                                            placeholder={this.state.technicianTitle}
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
                                                // this.taskTypeRef._root.focus();
                                            }}
                                        />
                                        <Image style={styles.rightIcon} source={Images.downarrow} />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <Label style={[styles.inputTitle, styles.placeholderColor]}>Type</Label>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={[styles.inputContainer, this.state.currentEditingField == 'type' ? styles.inputActive : styles.inputInactive]}
                                        onPress={() => {
                                            this.fetchCategories(true)
                                        }}>
                                        <Input
                                            pointerEvents={'none'}
                                            editable={false}
                                            style={styles.input}
                                            placeholder={'Type'}
                                            placeholderTextColor={Colors.placeholder}
                                            autoCapitalize='words'
                                            selectionColor={Colors.mainPrimary}
                                            value={this.state.categorySelected ? (this.state.categorySelected.name) : ''}
                                            // onChangeText={value => this.setState({ accountType: value })}
                                            blurOnSubmit={false}
                                            keyboardAppearance='dark'
                                            returnKeyType={"next"}
                                            onFocus={value => {
                                                this.setState({ currentEditingField: 'type' })
                                            }}
                                            onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                            ref={input => {
                                                this.typeRef = input;
                                            }}
                                            onSubmitEditing={() => {
                                                // this.taskTypeRef._root.focus();
                                            }}
                                        />
                                        <Image style={styles.rightIcon} source={Images.downarrow} />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <Label style={[styles.inputTitle, styles.placeholderColor]}>Start Date</Label>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={[styles.inputContainer, this.state.currentEditingField == 'startDate' ? styles.inputActive : styles.inputInactive]}
                                        onPress={() => {
                                            this.setState({ showStartDatePicker: true })
                                        }}>
                                        <Input
                                            pointerEvents={'none'}
                                            editable={false}
                                            style={styles.input}
                                            placeholder={'Start Date'}
                                            placeholderTextColor={Colors.placeholder}
                                            autoCapitalize='words'
                                            selectionColor={Colors.mainPrimary}
                                            value={this.state.startDate ? Moment(this.state.startDate).format(DateFormat.DDMMMYYYYHMMA) : ''}
                                            // onChangeText={value => this.setState({ accountType: value })}
                                            blurOnSubmit={false}
                                            keyboardAppearance='dark'
                                            returnKeyType={"next"}
                                            onFocus={value => {
                                                this.setState({ currentEditingField: 'startDate' })
                                            }}
                                            onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                            ref={input => {
                                                this.startDateRef = input;
                                            }}
                                            onSubmitEditing={() => {
                                                // this.taskTypeRef._root.focus();
                                            }}
                                        />
                                        <Image style={styles.rightIcon} source={Images.downarrow} />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <Label style={[styles.inputTitle, styles.placeholderColor]}>End Date</Label>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={[styles.inputContainer, this.state.currentEditingField == 'endDate' ? styles.inputActive : styles.inputInactive]}
                                        onPress={() => {
                                            this.setState({ showEndDatePicker: true })
                                        }}>
                                        <Input
                                            pointerEvents={'none'}
                                            editable={false}
                                            style={styles.input}
                                            placeholder={'End Date'}
                                            placeholderTextColor={Colors.placeholder}
                                            autoCapitalize='words'
                                            selectionColor={Colors.mainPrimary}
                                            value={this.state.endDate ? Moment(this.state.endDate).format(DateFormat.DDMMMYYYYHMMA) : ''}
                                            // onChangeText={value => this.setState({ accountType: value })}
                                            blurOnSubmit={false}
                                            keyboardAppearance='dark'
                                            onFocus={value => {
                                                this.setState({ currentEditingField: 'endDate' })
                                            }}
                                            onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                            ref={input => {
                                                this.endDateRef = input;
                                            }}
                                            onSubmitEditing={() => {
                                                // this.taskTypeRef._root.focus();
                                            }}
                                        />
                                        <Image style={styles.rightIcon} source={Images.downarrow} />
                                    </TouchableOpacity>
                                </View>
                                {!this.state.isEdit ?
                                    <View>
                                        <Label style={[styles.inputTitle, styles.placeholderColor]}>Assigned</Label>
                                        <View style={styles.multifieldContainer}>
                                            <View style={styles.switchContainer}>
                                                <TouchableOpacity onPress={() => {
                                                    this.setState({ isMyEvent: !this.state.isMyEvent })
                                                }}>
                                                    <Image style={styles.switchIcon} source={this.state.isMyEvent ? Images.toggleOn : Images.toggleOff} />
                                                </TouchableOpacity>
                                                <Label style={styles.switchTitle}>My Event</Label>
                                            </View>
                                        </View>
                                    </View> : null}
                                <TouchableOpacity activeOpacity={0.7} style={styles.buttonContainer} onPress={() => {
                                    if (this.state.isEdit) {
                                        this.btnUpdateEventPressed()
                                    } else {
                                        this.btnAddEventPressed()
                                    }
                                }}>
                                    <Text style={styles.buttonText}>{this.state.isEdit ? 'Update Event' : 'Add Event'}</Text>
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
export default connect(mapStateToProps)(AddEditEvent);