/* Imports */
import React, { Component } from 'react'
import { ScrollView, Image, View, TouchableOpacity, Platform, StatusBar, SafeAreaView, Text, Keyboard } from 'react-native'
import { Container, Label, Input, Toast, Textarea } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import Moment from 'moment';

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
import AccountSelectionWithLoadMore from '../AccountSelectionWithLoadMore';

// Styless
import styles from './Styles/AddEditToDoStyles'

class AddEditToDo extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            date: '',
            time: '',
            accountSelected: null,
            projectSelected: null,
            ticketSelected: null,
            techSelected: null,
            taskTypeSelected: null,
            title: '',
            note: '',
            account: null,
            showAccountNamePopup: false,
            accountDataSource: [],
            showDatePicker: false,
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
            todo: null,
            isEdit: false,
            isDisableFields: false,
            showTimePicker: false,
            parentTodo: null,
        };
    }

    componentDidMount() {
        this.setState({
            loading: false,
            date: '',
            time: '',
            accountSelected: null,
            projectSelected: null,
            ticketSelected: null,
            techSelected: null,
            taskTypeSelected: null,
            title: '',
            note: '',
            account: null,
            showAccountNamePopup: false,
            accountDataSource: [],
            showDatePicker: false,
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
            todo: null,
            isEdit: false,
            isDisableFields: false,
            showTimePicker: false,
            parentTodo: null,
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

                this.setState({ ticketsTitle, ticketTitle, accountsTitle, accountTitle, techsTitle, techTitle })
            })

        // this.setState({ date: Moment().format(DateFormat.YYYYMMDDTHHMMSS) })

        if (this.props.navigation.state.params !== undefined) {
            if (this.props.navigation.state.params.account !== undefined) {
                this.setState({ account: this.props.navigation.state.params.account })
            }
            if (this.props.navigation.state.params.techSelected !== undefined) {
                this.setState({ techSelected: this.props.navigation.state.params.techSelected })
            }
            if (this.props.navigation.state.params.todo !== undefined) {
                this.setState({ todo: this.props.navigation.state.params.todo, parentTodo: this.props.navigation.state.params.parentTodo, isEdit: true })
            }
        }

        setTimeout(() => {
            if (this.state.todo) {
                let date = Moment(this.state.todo.due_date).format(DateFormat.YYYYMMDDTHHMMSS)
                this.setState({
                    isEdit: true,
                    date: date != 'Invalid date' ? date : '',
                    isDisableFields: (this.state.todo.project_id || this.state.todo.ticket_id),
                    accountSelected: {
                        id: this.state.parentTodo.account_id ? this.state.parentTodo.account_id : undefined,
                        name: this.state.parentTodo.account_name ? this.state.parentTodo.account_name : 'Default',
                        value_title: this.state.parentTodo.account_name,
                    },
                    projectSelected: {
                        id: this.state.parentTodo.project_id ? this.state.parentTodo.project_id : undefined,
                        name: this.state.parentTodo.project_name ? this.state.parentTodo.project_name : 'Default',
                        value_title: this.state.parentTodo.project_name,
                    },
                    ticketSelected: {
                        id: this.state.parentTodo.list_ticket_id ? this.state.parentTodo.list_ticket_id : undefined,
                        key: this.state.parentTodo.list_ticket_id ? this.state.parentTodo.list_ticket_id : undefined,
                        number: this.state.parentTodo.list_ticket_number ? this.state.parentTodo.list_ticket_number : undefined,
                        subject: this.state.parentTodo.list_ticket_subject ? this.state.parentTodo.list_ticket_subject : 'Default',
                        value_title: `${this.state.parentTodo.list_ticket_number} ${this.state.parentTodo.list_ticket_subject}`,
                    },
                    techSelected: {
                        id: this.state.todo.assigned_id ? this.state.todo.assigned_id : undefined,
                        firstname: this.state.todo.assigned_name ? this.state.todo.assigned_name : 'Default',
                        lastname: '',
                        value_title: this.state.todo.assigned_name,
                    },
                    title: this.state.todo.title,
                    note: this.state.todo.text != 'undefined' ? this.state.todo.text : '',
                })
            }
        }, 100)

        this.viewWillAppear()
        this.props.navigation.addListener('didFocus', this.viewWillAppear)
        // this.fetchAccounts(false)
    }

    viewWillAppear = () => {
        if (this.props.navigation.state.params !== undefined) {
            if (this.props.navigation.state.params.account !== undefined) {
                this.setState({ account: this.props.navigation.state.params.account })
            }
            if (this.props.navigation.state.params.techSelected !== undefined) {
                this.setState({ techSelected: this.props.navigation.state.params.techSelected })
            }
            if (this.props.navigation.state.params.todo !== undefined) {
                this.setState({ todo: this.props.navigation.state.params.todo, parentTodo: this.props.navigation.state.params.parentTodo, isEdit: true })
            }
        }
    }

    componentWillUnmount() {
        Keyboard.dismiss();
    }

    //Actions

    /* Validating information and calling create in api */
    btnAddToDoPressed() {
        /* Checking validation if it's valid calling API*/
        if (this.isValid()) {
            Keyboard.dismiss();
            var obj = {
                'title': this.state.title,
                'project_id': 0,
                'text': this.state.note,
                'assigned_id': 0,
                'estimated_remain': null,
                'due_date': this.state.date,
                'notify': true,
                'list_id': '',
                'ticket_key': 0
            }

            if (this.state.accountSelected && this.state.accountSelected.id != null && this.state.accountSelected.id != undefined) {
                obj.account_id = this.state.accountSelected.id
            }

            if (this.state.techSelected && this.state.techSelected.id != null && this.state.techSelected.id != undefined) {
                obj.assigned_id = this.state.techSelected.id
            }

            if (this.state.projectSelected && this.state.projectSelected.id != null && this.state.projectSelected.id != undefined) {
                obj.project_id = this.state.projectSelected.id
            }

            if (this.state.ticketSelected && this.state.ticketSelected.id != null && this.state.ticketSelected.id != undefined) {
                obj.ticket_key = this.state.ticketSelected.key
                obj.project_id = 0
            }

            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))

            ApiHelper.postWithParam(ApiHelper.Apis.ToDos, obj, this, true, authHeader)
                .then((response) => {
                    this.props.navigation.goBack();
                    Toast.show({
                        text: `ToDo has been added successfully.`,
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
    btnUpdateToDoPressed() {
        /* Checking validation if it's valid calling API*/
        if (this.isValid()) {
            Keyboard.dismiss();

            var obj = {
                'task_id': this.state.todo.id,
                'title': this.state.title,
                'account_id': this.state.parentTodo.account_id,
                'project_id': this.state.parentTodo.project_id,
                'text': this.state.note,
                'assigned_id': this.state.todo.assigned_id,
                'estimated_remain': this.state.todo.estimated_remain,
                'due_date': this.state.date,
                'notify': this.state.todo.notify,
                'list_id': this.state.todo.list_id,
                'ticket_key': this.state.parentTodo.list_ticket_id
            }

            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))

            ApiHelper.postWithParam(ApiHelper.Apis.ToDos, obj, this, true, authHeader)
                .then((response) => {
                    this.props.navigation.goBack();
                    Toast.show({
                        text: `ToDo has been updated successfully.`,
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

    /* Checking validation and returns true/false */
    isValid() {
        if (this.state.techSelected == null && !this.state.isEdit) {
            setTimeout(() => this.fetchUsers(true), 200)
            return false
        } else if (ValidationHelper.isInvalidText(this.state.title)) {
            setTimeout(() => this.titleRef._root.focus(), 200)
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
                arrAccounts.push({ value_title: 'Default', name: 'Default' })
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

    /* Navigating to search technician screen for search and select tech */
    fetchUsers(isShowPopup = false) {
        this.props.navigation.push('SearchTechnicians', { account: this.state.accountSelected } );
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

    /* Hidding(Dismissing) popup screen */
    dismissPopup(option) {
        this.setState({
            showAccountNamePopup: false,
            showDatePicker: false,
            showUsersPopup: false,
            showProjectPopup: false,
            showTicketPopup: false,
            showTimePicker: false,
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
        } else if (dropDownName === 'Users') {
            this.setState({ techSelected: selectedData });
        } else if (dropDownName === 'Projects') {
            this.setState({
                projectSelected: selectedData,
                ticketSelected: null,
            });
        } else if (dropDownName === 'Tickets') {
            this.setState({
                ticketSelected: selectedData,
            });
        }
        this.dismissPopup();
    }

    /* Setting selected date to state */
    dateDidChange(date, option) {
        if (option == 'date') {
            this.setState({ date: Moment(date).format(DateFormat.YYYYMMDDTHHMMSS), showDatePicker: Platform.OS === 'android' ? false : true })
        } else if (option == 'time') {
            this.setState({ date: Moment(date).format(DateFormat.YYYYMMDDTHHMMSS), time: Moment(date).format(DateFormat.YYYYMMDDTHHMMSS), showTimePicker: Platform.OS === 'android' ? false : true })
        }
    }

    /* Rendering popup screen */
    renderDropDownOptions() {
        if (this.state.showAccountNamePopup) {
            return (
                <AccountSelectionWithLoadMore dataSource={this.state.accountDataSource} defaultOption={{ value_title: 'Default', name: 'Default' }} dismissPopup={() => this.dismissPopup()} selected={this.state.accountName} selectedData={this.state.accountSelected} selectionDidChange={(selected, selectedData) => { this.selectionDidChange('Account', selected, selectedData); }} />
            )
        } else if (this.state.showUsersPopup) {
            return (
                <Selection dataSource={this.state.userDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.techSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Users', selected, data); }} />
            )
        } else if (this.state.showProjectPopup) {
            return (
                <Selection dataSource={this.state.projectDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.projectSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Projects', selected, data); }} />
            )
        } else if (this.state.showTicketPopup) {
            return (
                <Selection dataSource={this.state.ticketDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.ticketSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Tickets', selected, data); }} />
            )
        } else {
            return null
        }
    }

    /* Rendering date picker view */
    renderDatePicker() {
        if (this.state.showDatePicker) {
            return (
                <DatePickerView mode='date' minDate={null} maxDate={null} dismissPopup={() => this.dismissPopup()} selectedDate={this.state.date} dateDidChange={(date) => { this.dateDidChange(date, 'date'); }} />
            )
        } else if (this.state.showTimePicker) {
            return (
                <DatePickerView mode='time' minDate={null} maxDate={null} dismissPopup={() => this.dismissPopup()} selectedDate={this.state.date} dateDidChange={(date) => { this.dateDidChange(date, 'time'); }} />
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
                        showTitle={this.state.isEdit ? 'Edit ToDo' : 'Add ToDo'}
                    />
                </SafeAreaView>
                {this.renderDropDownOptions()}
                {this.renderDatePicker()}
                <View style={styles.contentContainer}>
                    <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
                        <SafeAreaView style={styles.mainContainer}>
                            <View style={[styles.mainContainer, { paddingTop: 30, paddingBottom: 30 }]}>
                                {this.state.isEdit ? null :
                                    <View>
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
                                    </View>}
                                <View>
                                    <Label style={[styles.inputTitle, styles.placeholderColor]}>{'Title'}</Label>
                                    <View style={[styles.inputContainer, this.state.currentEditingField == 'title' ? styles.inputActive : styles.inputInactive]} >
                                        <Input
                                            style={[styles.input, this.state.isDisableFields ? { color: Colors.textGray } : {}]}
                                            placeholder={'Title'}
                                            placeholderTextColor={Colors.placeholder}
                                            autoCapitalize='words'
                                            selectionColor={Colors.mainPrimary}
                                            value={this.state.title}
                                            onChangeText={value => this.setState({ title: value })}
                                            blurOnSubmit={false}
                                            keyboardAppearance='dark'
                                            returnKeyType={"next"}
                                            onFocus={value => {
                                                this.setState({ currentEditingField: 'title' })
                                            }}
                                            onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                            ref={input => {
                                                this.titleRef = input;
                                            }}
                                            onSubmitEditing={() => {
                                                this.noteRef._root.focus();
                                            }}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <Label style={[styles.inputTitle, styles.placeholderColor]}>Notes</Label>
                                    <View style={[styles.inputContainer, { height: 100, paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10 }, this.state.currentEditingField == 'note' ? styles.inputActive : styles.inputInactive]}>
                                        <Textarea
                                            style={[styles.input, { height: '100%', width: '100%' }]}
                                            placeholder='Notes'
                                            placeholderTextColor={Colors.placeholder}
                                            selectionColor={Colors.mainPrimary}
                                            value={this.state.note}
                                            onChangeText={value => this.setState({ note: value })}
                                            blurOnSubmit={false}
                                            keyboardAppearance='dark'
                                            // returnKeyType={"next"}
                                            onFocus={value => {
                                                this.setState({ currentEditingField: 'note' })
                                            }}
                                            onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                            ref={input => {
                                                this.noteRef = input;
                                            }}
                                        // onSubmitEditing={() => {
                                        //     this.internalCommentsRef._root.focus();
                                        // }}
                                        />
                                    </View>
                                </View>
                                <View style={styles.multifieldContainer}>
                                    <View style={styles.filedContainer}>
                                        <Label style={[styles.inputTitle, styles.placeholderColor]}>Due Date</Label>
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            style={[styles.inputContainer, { marginLeft: Metrics.baseMargin, marginRight: Metrics.baseMargin }, this.state.currentEditingField == 'date' ? styles.inputActive : styles.inputInactive]}
                                            onPress={() => { this.setState({ showDatePicker: true }) }}>
                                            <Input
                                                pointerEvents={'none'}
                                                editable={false}
                                                style={[styles.input, { textAlign: 'center' }]}
                                                placeholder='Due Date'
                                                placeholderTextColor={Colors.placeholder}
                                                autoCapitalize='words'
                                                selectionColor={Colors.mainPrimary}
                                                value={this.state.date ? Moment(this.state.date).format(DateFormat.DDMMMYYYY) : ''}
                                                onChangeText={value => this.setState({ date: value })}
                                                blurOnSubmit={false}
                                                keyboardAppearance='dark'
                                                returnKeyType={"next"}
                                                onFocus={value => {
                                                    this.setState({ currentEditingField: 'date' })
                                                }}
                                                onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                ref={input => {
                                                    this.dateRef = input;
                                                }}
                                                onSubmitEditing={() => {
                                                    this.timeRef._root.focus();
                                                }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.filedContainer}>
                                        <Label style={[styles.inputTitle, styles.placeholderColor]}>Est. Time</Label>
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            style={[styles.inputContainer, { marginLeft: Metrics.baseMargin, marginRight: Metrics.baseMargin }, this.state.currentEditingField == 'time' ? styles.inputActive : styles.inputInactive]}
                                            onPress={() => { this.setState({ showTimePicker: true }) }}>
                                            <Input
                                                pointerEvents={'none'}
                                                editable={false}
                                                style={[styles.input, { textAlign: 'center' }]}
                                                placeholder='Est. Time hh:mm'
                                                placeholderTextColor={Colors.placeholder}
                                                autoCapitalize='words'
                                                selectionColor={Colors.mainPrimary}
                                                value={this.state.date ? Moment(this.state.date).format(DateFormat.HMMA) : ''}
                                                onChangeText={value => this.setState({ date: value })}
                                                blurOnSubmit={false}
                                                keyboardAppearance='dark'
                                                returnKeyType={"go"}
                                                onFocus={value => {
                                                    this.setState({ currentEditingField: 'time' })
                                                }}
                                                onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                ref={input => {
                                                    this.timeRef = input;
                                                }}
                                                onSubmitEditing={() => {
                                                    if (this.state.isEdit) {
                                                        this.btnUpdateToDoPressed()
                                                    } else {
                                                        this.btnAddToDoPressed()
                                                    }
                                                }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <TouchableOpacity activeOpacity={0.7} style={styles.buttonContainer} onPress={() => {
                                    if (this.state.isEdit) {
                                        this.btnUpdateToDoPressed()
                                    } else {
                                        this.btnAddToDoPressed()
                                    }
                                }}>
                                    <Text style={styles.buttonText}>{this.state.isEdit ? 'Update ToDo' : 'Add ToDo'}</Text>
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
export default connect(mapStateToProps)(AddEditToDo);