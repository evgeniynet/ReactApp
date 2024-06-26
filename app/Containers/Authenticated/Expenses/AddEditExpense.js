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
import TechSelectionWithLoadMore from '../TechSelectionWithLoadMore';
import AccountSelectionWithLoadMore from '../AccountSelectionWithLoadMore';

// Styless
import styles from './Styles/AddEditExpenseStyles'

class AddEditExpense extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            date: '',
            accountSelected: null,
            productSelected: null,
            projectSelected: null,
            ticketSelected: null,
            techSelected: null,
            categorySelected: null,
            isBillable: true,
            iComplitedNote: '',
            internalNote: '',
            account: null,
            showAccountNamePopup: false,
            accountDataSource: [],
            showProductsPopup: false,
            productDataSource: [],
            showDatePicker: false,
            showUsersPopup: false,
            userDataSource: [],
            showProjectPopup: false,
            projectDataSource: [],
            showTicketPopup: false,
            ticketDataSource: [],
            showCategoryPopup: false,
            categoryDataSource: [],
            showMarkupP: false,
            markupPDataSource: [],
            ticketsTitle: 'Tickets',
            ticketTitle: 'Ticket',
            accountTitle: 'Account',
            accountsTitle: 'Accounts',
            techTitle: 'Tech',
            techsTitle: 'Technicians',
            expense: null,
            isEdit: false,
            isDisableFields: false,
            vendor: '',
            units: '1',
            cost: '',
            markup: '',
            markupPercentage: '',
            totalCosts: '0.00',
            ticket: null,
        };
    }

    componentDidMount() {

        var arrTempMarkupP = [{ value_title: '0 (Default)', value: 0, id: 1 }]
        var previousMarkupP = 0
        for (let index = 1; index < 21; index++) {
            const element = index;
            previousMarkupP += 5
            arrTempMarkupP.push({ value_title: `${previousMarkupP}`, value: previousMarkupP, id: index})
        }

        this.setState({
            loading: false,
            date: '',
            accountSelected: null,
            productSelected: null,
            projectSelected: null,
            ticketSelected: null,
            techSelected: null,
            categorySelected: null,
            isBillable: true,
            iComplitedNote: '',
            internalNote: '',
            account: null,
            showAccountNamePopup: false,
            accountDataSource: [],
            showProductsPopup: false,
            productDataSource: [],
            showDatePicker: false,
            showUsersPopup: false,
            userDataSource: [],
            showProjectPopup: false,
            projectDataSource: [],
            showTicketPopup: false,
            ticketDataSource: [],
            showCategoryPopup: false,
            categoryDataSource: [],
            showMarkupP: false,
            markupPDataSource: arrTempMarkupP,
            ticketsTitle: 'Tickets',
            ticketTitle: 'Ticket',
            accountTitle: 'Account',
            accountsTitle: 'Accounts',
            techTitle: 'Tech',
            techsTitle: 'Technicians',
            expense: null,
            isEdit: false,
            isDisableFields: false,
            vendor: '',
            units: '1',
            cost: '',
            markup: '',
            markupPercentage: '',
            totalCosts: '0.00',
            ticket: null,
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
            })

        this.setState({ date: Moment().format(DateFormat.YYYYMMDDTHHMMSS) })

        if (this.props.navigation.state.params !== undefined) {
            if (this.props.navigation.state.params.account !== undefined) {
                this.setState({ account: this.props.navigation.state.params.account })
            }
            if (this.props.navigation.state.params.expense !== undefined) {
                this.setState({ expense: this.props.navigation.state.params.expense, isEdit: true })
            }

            if (this.props.navigation.state.params.ticket !== undefined) {
                this.setState({ ticket: this.props.navigation.state.params.ticket })
            }
        }

        setTimeout(() => {
            if (this.state.expense) {

                let units = (this.state.expense.units && this.state.expense.units != '' ? this.state.expense.units : 0)
                let cost = (this.state.expense.amount && this.state.expense.amount != '' ? this.state.expense.amount : 0)
                let markup = (this.state.expense.markup_value && this.state.expense.markup_value != '' ? this.state.expense.markup_value : 0)
                let markupP = ((markup / cost) * 100)
                var totolAmount = (markup * units) + (cost * units)

                this.setState({
                    isEdit: true,
                    date: Moment(this.state.expense.date).format(DateFormat.YYYYMMDDTHHMMSS),
                    units: `${this.state.expense.units}`,
                    cost: `${this.state.expense.amount}`,
                    vendor: this.state.expense.vendor,
                    markup: `${this.state.expense.markup_value}`,
                    markupPercentage: `${markupP != 0 ? markupP.toFixed() : ''}`,
                    totalCosts: `${totolAmount.toFixed(2)}`,
                    isDisableFields: (this.state.expense.project_id || this.state.expense.ticket_id),
                    accountSelected: {
                        id: this.state.expense.account_id ? this.state.expense.account_id : undefined,
                        name: this.state.expense.account_name ? this.state.expense.account_name : 'Default',
                        value_title: this.state.expense.account_name,
                    },
                    projectSelected: {
                        id: this.state.expense.project_id ? this.state.expense.project_id : undefined,
                        name: this.state.expense.project_name ? this.state.expense.project_name : 'Default',
                        value_title: this.state.expense.project_name,
                    },
                    ticketSelected: {
                        id: this.state.expense.ticket_id ? this.state.expense.ticket_id : undefined,
                        key: this.state.expense.ticket_key ? this.state.expense.ticket_key : undefined,
                        number: this.state.expense.ticket_number ? this.state.expense.ticket_number : undefined,
                        subject: this.state.expense.ticket_subject ? this.state.expense.ticket_subject : 'Default',
                        value_title: `${this.state.expense.ticket_number} ${this.state.expense.ticket_subject}`,
                    },
                    techSelected: {
                        id: this.state.expense.user_id ? this.state.expense.user_id : undefined,
                        firstname: this.state.expense.user_name ? this.state.expense.user_name : 'Default',
                        lastname: '',
                        email: this.state.expense.user_email,
                        value_title: `${this.state.expense.user_name} (${this.state.expense.user_email})`,
                    },
                    productSelected: {
                        category_id: this.state.expense.category_id,
                        amount: this.state.expense.amount,
                        units: this.state.expense.units,
                        name: this.state.expense.category,
                        markup: this.state.expense.markup,
                        markup_value: this.state.expense.markup_value,
                    },
                    isBillable: this.state.expense.billable,
                    iComplitedNote: this.state.expense.note,
                    internalNote: this.state.expense.note_internal,
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
            if (this.state.config && this.state.config.user && this.state.config.user.is_techoradmin && (!this.state.techSelected)) {
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
    btnAddExpensePressed() {
        /* Checking validation if it's valid calling API*/
        if (this.isValid()) {
            Keyboard.dismiss();

            var obj = {
                'ticket_key': null,
                'ticket_name': 'Default',
                'account_id': -1,
                'contract_id': 0,
                'category_id': null,
                'project_id': 0,
                'project_name': 'Default',
                'tech_id': 0,
                'user_name': 'Default',
                'note': this.state.iComplitedNote,
                'note_internal': this.state.internalNote,
                'amount': parseFloat(this.state.cost),
                'is_billable': this.state.isBillable,
                'is_technician_payment': (this.state.techSelected && this.state.techSelected.id != null && this.state.techSelected.id != undefined) ? true : false,
                'vendor': this.state.vendor,
                'units': parseFloat(this.state.units),
                'markup_value': parseFloat(this.state.markup),
                'date': this.state.date,
                'product_id': ''
            }

            if (this.state.accountSelected && this.state.accountSelected.id != null && this.state.accountSelected.id != undefined) {
                obj.account_id = this.state.accountSelected.id
            }

            if (this.state.techSelected && this.state.techSelected.id != null && this.state.techSelected.id != undefined) {
                obj.tech_id = this.state.techSelected.id
                obj.user_name = this.state.techSelected.firstname + ' ' + this.state.techSelected.lastname
            }

            if (this.state.projectSelected && this.state.projectSelected.id != null && this.state.projectSelected.id != undefined) {
                obj.project_id = this.state.projectSelected.id
                obj.project_name = this.state.projectSelected.name
            }

            if (this.state.ticketSelected && this.state.ticketSelected.id != null && this.state.ticketSelected.id != undefined) {
                obj.ticket_key = this.state.ticketSelected.key
                obj.ticket_name = `#${this.state.ticketSelected.number} ${this.state.ticketSelected.subject}`
            }

            if (this.state.productSelected && this.state.productSelected.category_id != null && this.state.productSelected.category_id != undefined) {
                obj.category_id = this.state.productSelected.category_id
            }
            
            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))

            ApiHelper.postWithParam(ApiHelper.Apis.Products, obj, this, true, authHeader)
                .then((response) => {
                    this.props.navigation.goBack();
                    Toast.show({
                        text: `Product has been added successfully.`,
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
    btnUpdateExpensePressed() {
        /* Checking validation if it's valid calling API*/
        if (this.isValid()) {
            Keyboard.dismiss();

            var obj = {
                'ticket_key': this.state.expense.ticket_key && this.state.expense.ticket_key.trim() != '' && this.state.expense.ticket_key ? this.state.expense.ticket_key : (this.state.expense.ticket_id ? this.state.expense.ticket_id : null),
                'ticket_name': this.state.expense.ticket_subject,
                'account_id': this.state.expense.account_id,
                'contract_id': this.state.expense.contract_id,
                'category_id': this.state.expense.category_id && this.state.expense.category_id != '' && this.state.expense.category_id ? this.state.expense.category_id : null,
                'project_id': this.state.expense.project_id,
                'project_name': this.state.expense.project_name,
                'tech_id': this.state.expense.user_id,
                'user_name': this.state.expense.user_name,
                'note': this.state.iComplitedNote,
                'note_internal': this.state.internalNote,
                'amount': parseFloat(this.state.cost),
                'is_billable': this.state.isBillable,
                'is_technician_payment': (this.state.techSelected && this.state.techSelected.id != null && this.state.techSelected.id != undefined) ? true : false,
                'vendor': this.state.vendor,
                'units': parseFloat(this.state.units),
                'markup_value': parseFloat(this.state.markup),
                'date': this.state.date,
                'product_id': this.state.expense.expense_id
            }

            if (this.state.accountSelected && this.state.accountSelected.id != null && this.state.accountSelected.id != undefined) {
                obj.account_id = this.state.accountSelected.id
            }

            if (this.state.techSelected && this.state.techSelected.id != null && this.state.techSelected.id != undefined) {
                obj.tech_id = this.state.techSelected.id
                obj.user_name = this.state.techSelected.firstname + ' ' + this.state.techSelected.lastname
            }

            if (this.state.projectSelected && this.state.projectSelected.id != null && this.state.projectSelected.id != undefined) {
                obj.project_id = this.state.projectSelected.id
                obj.project_name = this.state.projectSelected.name
            }

            if (this.state.ticketSelected && this.state.ticketSelected.id != null && this.state.ticketSelected.id != undefined) {
                obj.ticket_key = this.state.ticketSelected.key
                obj.ticket_name = `#${this.state.ticketSelected.number} ${this.state.ticketSelected.subject}`
            }

            if (this.state.productSelected && this.state.productSelected.category_id != null && this.state.productSelected.category_id != undefined) {
                obj.category_id = this.state.productSelected.category_id
            }
            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))

            ApiHelper.postWithParam(ApiHelper.Apis.Products, obj, this, true, authHeader)
                .then((response) => {
                    this.props.navigation.goBack();
                    Toast.show({
                        text: `Product has been updated successfully.`,
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
            showProductsPopup: false,
            showMarkupP: false,
            showAccountNamePopup: false,
            showDatePicker: false,
            showUsersPopup: false,
            showProjectPopup: false,
            showTicketPopup: false,
            showCategoryPopup: false,   
        })
    }

    /* Setting state on drop down selection change */
    selectionDidChange(dropDownName, selected, selectedData) {
        if (dropDownName === 'Product') {
            let units = (this.state.units && this.state.units != '' ? this.state.units : 0)
            let cost =  (selectedData.amount && selectedData.amount != '' ? selectedData.amount : 0)
            let markupP =  (selectedData.markup && selectedData.markup != '' ? selectedData.markup : 0)
            let markup =  (selectedData.markup_value && selectedData.markup_value != '' ? selectedData.markup_value : 0)
            var totolAmount = (markup * units) + (cost * units)

            this.setState({ cost: `${cost != 0 ? cost : ''}`,  markupPercentage:  `${markupP != 0 ? markupP : ''}`, totalCosts: `${totolAmount.toFixed(2)}`, markup: `${markup != 0 ? markup : ''}` })
            this.setState({
                productSelected: selectedData,
            });
        } else if (dropDownName === 'Markup') {
            let units = (this.state.units && this.state.units != '' ? this.state.units : 0)
            let cost = (this.state.cost && this.state.cost != '' ? this.state.cost : 0)
            let markupP = ((selectedData.value && selectedData.value != '' ? selectedData.value : 0))
            let markup = ((cost / 100) * markupP).toFixed(2)                                   
            var totolAmount = (markup * units) + (cost * units)
            
            this.setState({ markupPercentage: `${selectedData.value != 0 ? selectedData.value : ''}`, totalCosts: `${totolAmount.toFixed(2)}`, markup: `${markup}` })
        } else if (dropDownName === 'Account') {
            this.setState({
                accountName: selected,
                accountSelected: selectedData,
                projectSelected: null,
                ticketSelected: null,
            });
        } else if (dropDownName === 'Users') {
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
        if (option == 'date') {
            this.setState({ date: Moment(date).format(DateFormat.YYYYMMDDTHHMMSS), showDatePicker: Platform.OS === 'android' ? false : true })
        }
    }

    //Class Methods

    /* Checking validation and returns true/false */
    isValid() {
        if (ValidationHelper.isInvalidText(this.state.units)) {
            setTimeout(() => this.unitsRef._root.focus(), 200)
            return false
        } else if (ValidationHelper.isInvalidText(this.state.cost)) {
            setTimeout(() => this.costRef._root.focus(), 200)
            return false
        } else if ((this.props.configInfo && this.props.configInfo.is_account_manager) && (this.state.accountSelected == null)) {
            setTimeout(() => this.fetchAccounts(true), 200)
            return false
        } else if (ValidationHelper.isInvalidText(this.state.iComplitedNote)) {
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

    /* Calling api to fetch products and display selection popup */
    fetchProducts(isShowPopup = false) {
        if (this.state.productDataSource.length > 0 && isShowPopup) {
            this.setState({ showProductsPopup: true })
        } else {
            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
            ApiHelper.getWithParam(ApiHelper.Apis.ProductItems, { limit : 100 }, this, isShowPopup, authHeader).then((response) => {
                var arrProducts = []
                for (const key in response) {
                    if (Object.hasOwnProperty.call(response, key)) {
                        var product = response[key];
                        product.value_title = product.name
                        arrProducts.push(product)
                    }
                }
                this.setState({ productDataSource: arrProducts })
                if (isShowPopup) {
                    this.setState({ showProductsPopup: true })
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

    /* Calling api to fetch users and display selection popup  */
    fetchUsers(isShowPopup = false) {
        this.setState({ showUsersPopup: true })
        /*
        if (this.state.userDataSource.length > 0 && isShowPopup) {
            this.setState({ showUsersPopup: true })
        } else {
            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
            ApiHelper.get(ApiHelper.Apis.Users, this, authHeader).then((response) => {
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
        }*/
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
        } else if (this.state.showCategoryPopup) {
            return (
                <Selection dataSource={this.state.categoryDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.categorySelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Category', selected, data); }} />
            )
        } else if (this.state.showProductsPopup) {
            return (
                <Selection dataSource={this.state.productDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.productSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Product', selected, data); }} />
            )
        } else if (this.state.showMarkupP) {
            return (
                <Selection dataSource={this.state.markupPDataSource} dismissPopup={() => this.dismissPopup()} selectedData={{ value_title: `${this.state.markupPercentage != '' && this.state.markupPercentage != '0' ? this.state.markupPercentage : '0 (Default)'}`, value: this.state.markupPercentage }} selectionDidChange={(selected, selectedData) => { this.selectionDidChange('Markup', selected, selectedData); }} />
            )
        } else {
            return null
        }
    }

    /* Rendering data picker */
    renderDatePicker() {
        if (this.state.showDatePicker) {
            return (
                <DatePickerView mode='date' minDate={null} maxDate={new Date()} dismissPopup={() => this.dismissPopup()} selectedDate={this.state.date} dateDidChange={(date) => { this.dateDidChange(date, 'date'); }} />
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
                        showTitle={this.state.isEdit ? 'Edit Product' : 'Add Product'}
                    />
                </SafeAreaView>
                {this.renderDropDownOptions()}
                {this.renderDatePicker()}
                <View style={styles.contentContainer}>
                    <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
                        <SafeAreaView style={styles.mainContainer}>
                            <View style={[styles.mainContainer, { paddingTop: 30, paddingBottom: 30 }]}>
                                <View style={styles.topContainer}>
                                    <Image style={styles.backgroundImage} source={Images.addTimeBg} />
                                    <TouchableOpacity activeOpacity={0.7} style={styles.buttonDateContainer} onPress={() => {
                                        this.setState({ showDatePicker: true })
                                    }}>
                                        <Text style={styles.dateText}>{Moment(this.state.date).format(DateFormat.ESHORTMMMDDYYYY)}</Text>
                                    </TouchableOpacity>
                                    <View style={styles.twoFieldsContainer}>
                                        <View style={{ width: 100 }}>
                                            <Label style={[styles.inputTitle, styles.placeholderColor]}>Units</Label>
                                            <View style={[styles.inputContainer, { paddingRight: Metrics.smallMargin, paddingLeft: Metrics.smallMargin }, this.state.currentEditingField == 'units' ? styles.inputActive : styles.inputInactive]}>
                                                <Input
                                                    style={[styles.input, { textAlign: 'center' }]}
                                                    placeholder='1'
                                                    placeholderTextColor={Colors.placeholder}
                                                    autoCapitalize='words'
                                                    selectionColor={Colors.mainPrimary}
                                                    value={this.state.units}
                                                    onChangeText={value => {
                                                        let units = (value && value != '' ? value.replace(/[^0-9]/g, '') : 0)
                                                        let cost = (this.state.cost && this.state.cost != '' ? this.state.cost : 0)
                                                        let markup = (this.state.markup && this.state.markup != '' ? this.state.markup : 0)
                                                        var totolAmount = (markup * units) + (cost * units)

                                                        this.setState({ units: value.replace(/[^0-9]/g, ''), totalCosts: `${totolAmount.toFixed(2)}` })
                                                    }}
                                                    blurOnSubmit={false}
                                                    keyboardAppearance='dark'
                                                    keyboardType={'number-pad'}
                                                    returnKeyType={"next"}
                                                    onFocus={value => {
                                                        this.setState({ currentEditingField: 'units' })
                                                    }}
                                                    onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                    ref={input => {
                                                        this.unitsRef = input;
                                                    }}
                                                    onSubmitEditing={() => {
                                                        this.costRef._root.focus();
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.itemFieldContainer}>
                                        <Label style={[styles.inputTitle, styles.placeholderColor]}>Product</Label>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={[styles.inputContainer, this.state.currentEditingField == 'product' ? styles.inputActive : styles.inputInactive]}
                                        onPress={() => { this.fetchProducts(true) }}>
                                        <Input
                                            pointerEvents={'none'}
                                            editable={false}
                                            style={styles.input}
                                            placeholder={'Product'}
                                            placeholderTextColor={Colors.placeholder}
                                            autoCapitalize='words'
                                            selectionColor={Colors.mainPrimary}
                                            value={this.state.productSelected ? this.state.productSelected.name : ''}
                                            blurOnSubmit={false}
                                            keyboardAppearance='dark'
                                            returnKeyType={"next"}
                                            onFocus={value => {
                                                this.setState({ currentEditingField: 'product' })
                                            }}
                                            onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                            ref={input => {
                                                this.productRef = input;
                                            }}
                                            onSubmitEditing={() => {
                                                this.costRef._root.focus();
                                            }}
                                        />
                                        <Image style={styles.rightIcon} source={Images.downarrow} />
                                    </TouchableOpacity>
                                </View>
                                    </View>

                                    <View style={styles.twoFieldsContainer}>
                                        <View style={styles.itemFieldContainer}>
                                            <Label style={[styles.inputTitle, styles.placeholderColor]}>Cost</Label>
                                            <View style={[styles.inputContainer, { marginRight: Metrics.baseMargin }, this.state.currentEditingField == 'cost' ? styles.inputActive : styles.inputInactive]}>
                                                <Input
                                                    style={styles.input}
                                                    placeholder='$99'
                                                    placeholderTextColor={Colors.placeholder}
                                                    autoCapitalize='words'
                                                    selectionColor={Colors.mainPrimary}
                                                    value={this.state.cost}
                                                    onChangeText={value => {
                                                        let units = (this.state.units && this.state.units != '' ? this.state.units : 0)
                                                        let cost = (value && value != '' ? value.replace(/[^0-9.,]/g, '') : 0)
                                                        let markupP = (this.state.markupPercentage && this.state.markupPercentage != '') ? this.state.markupPercentage : 0
                                                        let markup = ((cost / 100) * markupP).toFixed(2)                                   
                                                        var totolAmount = (markup * units) + (cost * units)
                                                        
                                                        this.setState({ markup: `${markup}`, cost: value.replace(/[^0-9.,]/g, ''), totalCosts: `${totolAmount.toFixed(2)}` })
                                                    }}
                                                    blurOnSubmit={false}
                                                    keyboardType={'numeric'}
                                                    keyboardAppearance='dark'
                                                    returnKeyType={"next"}
                                                    onFocus={value => {
                                                        this.setState({ currentEditingField: 'cost' })
                                                    }}
                                                    onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                    ref={input => {
                                                        this.costRef = input;
                                                    }}
                                                    onSubmitEditing={() => {
                                                        this.markupRef._root.focus();
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        {/* <View>
                                        <Label style={[styles.inputTitle, styles.placeholderColor]}>Markup</Label>
                                        <View style={[styles.inputContainer, this.state.currentEditingField == 'markup' ? styles.inputActive : styles.inputInactive]}>
                                            <Input
                                                style={styles.input}
                                                placeholder='$10'
                                                placeholderTextColor={Colors.placeholder}
                                                autoCapitalize='words'
                                                selectionColor={Colors.mainPrimary}
                                                value={this.state.markup}
                                                onChangeText={value => {
                                                    let units = (this.state.units && this.state.units != '' ? this.state.units : 0)
                                                    let cost = (this.state.cost && this.state.cost != '' ? this.state.cost : 0)
                                                    let markup = (value && value != '' ? value.replace(/[^0-9]/g, '') : 0)
                                                    let markupP = cost > 0 ? (markup / cost) * 100 : 0
                                                    var totolAmount = (markup * units) + (cost * units)
                                                    this.setState({ markupPercentage: '', markup: value.replace(/[^0-9]/g, ''), totalCosts: `${totolAmount.toFixed(2)}` })
                                                }}
                                                blurOnSubmit={false}
                                                keyboardType={'numeric'}
                                                keyboardAppearance='dark'
                                                returnKeyType={"next"}
                                                onFocus={value => {
                                                    this.setState({ currentEditingField: 'markup' })
                                                }}
                                                onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                ref={input => {
                                                    this.markupRef = input;
                                                }}
                                                onSubmitEditing={() => {
                                                    this.percentageRef._root.focus();
                                                }}
                                            />
                                        </View>
                                    </View> */}
                                        <View style={styles.itemFieldContainer}>
                                            <Label style={[styles.inputTitle, styles.placeholderColor]}>Markup</Label>
                                            {/* <Label style={[styles.inputTitle, styles.placeholderColor]}>Percentage</Label> */}
                                        <TouchableOpacity 
                                         activeOpacity={0.7}
                                         style={[styles.inputContainer, { marginLeft: Metrics.baseMargin }, this.state.currentEditingField == 'percentage' ? styles.inputActive : styles.inputInactive]}
                                         onPress={() => {
                                             this.setState({ showMarkupP: true })
                                         }}>
                                               
                                                <Input
                                                    pointerEvents={'none'}
                                                    editable={false}
                                                    style={styles.input}
                                                    placeholder='10%'
                                                    placeholderTextColor={Colors.placeholder}
                                                    autoCapitalize='words'
                                                    selectionColor={Colors.mainPrimary}
                                                    value={this.state.markupPercentage}
                                                    onChangeText={value => {
                                                        let units = (this.state.units && this.state.units != '' ? this.state.units : 0)
                                                        let cost = (this.state.cost && this.state.cost != '' ? this.state.cost : 0)
                                                        let markupP = ((value && value != '' ? value.replace(/[^0-9]/g, '') : 0))
                                                        let markup = ((cost / 100) * markupP).toFixed(2)                                   
                                                        var totolAmount = (markup * units) + (cost * units)
                                                        
                                                        this.setState({ markupPercentage: value.replace(/[^0-9]/g, ''), totalCosts: `${totolAmount.toFixed(2)}`, markup: `${markup}` })
                                                    }
                                                    }
                                                    blurOnSubmit={false}
                                                    keyboardType={'numeric'}
                                                    keyboardAppearance='dark'
                                                    returnKeyType={"next"}
                                                    onFocus={value => {
                                                        this.setState({ currentEditingField: 'percentage' })
                                                    }}
                                                    onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                                    ref={input => {
                                                        this.percentageRef = input;
                                                    }}
                                                    onSubmitEditing={() => {
                                                        this.iComplitedNoteRef._root.focus();
                                                    }}
                                                />
                                            <Image style={styles.rightIcon} source={Images.downarrow} />
                                    </TouchableOpacity>
                                            </View>
                                    </View>
                                    <Label style={styles.totalText}>{`Total Cost $${this.state.totalCosts}`}</Label>
                                </View>
                                <View>
                                    <Label style={[styles.inputTitle]}>{this.state.techTitle}</Label>
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
                                {this.props.configInfo && this.props.configInfo.is_account_manager ?
                                    <View>
                                        <Label style={[styles.inputTitle]}>{this.state.accountTitle}</Label>
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
                                        <Label style={[styles.inputTitle]}>Project</Label>
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
                                    <Label style={[styles.inputTitle]}>{this.state.ticketTitle}</Label>
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
                                    <Label style={[styles.inputTitle]}>Notes</Label>
                                    <View style={[styles.inputContainer, { height: 100, paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10 }, this.state.currentEditingField == 'iComplitedNote' ? styles.inputActive : styles.inputInactive]}>
                                        <Textarea
                                            style={[styles.input, { height: '100%', width: '100%' }]}
                                            placeholder='Notes'
                                            placeholderTextColor={Colors.placeholder}
                                            selectionColor={Colors.mainPrimary}
                                            value={this.state.iComplitedNote}
                                            onChangeText={value => this.setState({ iComplitedNote: value })}
                                            blurOnSubmit={false}
                                            keyboardAppearance='dark'
                                            onFocus={value => {
                                                this.setState({ currentEditingField: 'iComplitedNote' })
                                            }}
                                            onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                            ref={input => {
                                                this.iComplitedNoteRef = input;
                                            }}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <Label style={[styles.inputTitle]}>Vendor</Label>
                                    <View style={[styles.inputContainer, this.state.currentEditingField == 'vendor' ? styles.inputActive : styles.inputInactive]}>
                                        <Input
                                            style={styles.input}
                                            placeholder='Vendor'
                                            placeholderTextColor={Colors.placeholder}
                                            autoCapitalize='words'
                                            selectionColor={Colors.mainPrimary}
                                            value={this.state.vendor}
                                            onChangeText={value => this.setState({ vendor: value })}
                                            blurOnSubmit={false}
                                            keyboardAppearance='dark'
                                            returnKeyType={"next"}
                                            onFocus={value => {
                                                this.setState({ currentEditingField: 'vendor' })
                                            }}
                                            onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                            ref={input => {
                                                this.vendorRef = input;
                                            }}
                                            onSubmitEditing={() => {
                                                this.internalCommentsRef._root.focus();
                                            }}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <Label style={[styles.inputTitle]}>Internal Notes</Label>
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
                                            onFocus={value => {
                                                this.setState({ currentEditingField: 'internalComments' })
                                            }}
                                            onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                            ref={input => {
                                                this.internalCommentsRef = input;
                                            }}
                                        />
                                    </View>
                                </View>
                                <View style={styles.multifieldContainer}>
                                    <View style={styles.switchContainer}>
                                        <TouchableOpacity onPress={() => {
                                            this.setState({ isBillable: !this.state.isBillable })
                                        }}>
                                            <Image style={styles.switchIcon} source={this.state.isBillable ? Images.toggleOn : Images.toggleOff} />
                                        </TouchableOpacity>
                                        <Label style={styles.switchTitle}>Billable</Label>
                                    </View>
                                </View>
                                <TouchableOpacity activeOpacity={0.7} style={styles.buttonContainer} onPress={() => {
                                    if (this.state.isEdit) {
                                        this.btnUpdateExpensePressed()
                                    } else {
                                        this.btnAddExpensePressed()
                                    }
                                }}>
                                    <Text style={styles.buttonText}>{this.state.isEdit ? 'Update Product' : 'Add Product'}</Text>
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
export default connect(mapStateToProps)(AddEditExpense);