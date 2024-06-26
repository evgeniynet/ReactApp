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
import AccountSelectionWithLoadMore from '../AccountSelectionWithLoadMore';

// Styless
import styles from './Styles/AddEditAssetStyles'

class AddEditAsset extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            startDate: '',
            accountSelected: null,
            locationSelected: null,
            ticketSelected: null,
            userSelected: null,
            assetSelected: null,
            isMyAsset: false,
            description: '',
            account: null,
            showAccountNamePopup: false,
            accountDataSource: [],
            showStartDatePicker: false,
            showStartTimePicker: false,
            showUsersPopup: false,
            usersDataSource: [],
            showLocationPopup: false,
            locationDataSource: [],
            showTicketPopup: false,
            ticketDataSource: [],
            showAssetPopup: false,
            assetDataSource: [],
            ticketsTitle: 'Tickets',
            ticketTitle: 'Ticket',
            accountTitle: 'Account',
            accountsTitle: 'Accounts',
            userTitle: 'End User',
            endUsersTitle: 'End Users',
            locationsTitle: 'Locations',
            locationTitle: 'Location',
            asset: null,
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
            accountSelected: null,
            locationSelected: null,
            ticketSelected: null,
            userSelected: null,
            assetSelected: null,
            isMyAsset: false,
            description: '',
            account: null,
            showAccountNamePopup: false,
            accountDataSource: [],
            showStartDatePicker: false,
            showStartTimePicker: false,
            showUsersPopup: false,
            usersDataSource: [],
            showLocationPopup: false,
            locationDataSource: [],
            showTicketPopup: false,
            ticketDataSource: [],
            showAssetPopup: false,
            assetDataSource: [],
            ticketsTitle: 'Tickets',
            ticketTitle: 'Ticket',
            accountTitle: 'Account',
            accountsTitle: 'Accounts',
            userTitle: 'End User',
            endUsersTitle: 'End Users',
            locationsTitle: 'Locations',
            locationTitle: 'Location',
            asset: null,
            isEdit: false,
            isDisableFields: false,
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
                var userTitle = 'End User'
                var endUsersTitle = 'End Users'
                var locationsTitle = 'Locations'
                var locationTitle = 'Location'
                if (config.is_customnames) {
                    ticketsTitle = config.names.ticket.p ?? 'Tickets'
                    ticketTitle = config.names.ticket.s ?? 'Ticket'
                    accountsTitle = config.names.account.p ?? 'Accounts'
                    accountTitle = config.names.account.s ?? 'Account'
                    endUsersTitle = config.names.user.p ?? 'End Users'
                    userTitle = config.names.user.a ?? 'End User'
                    locationsTitle = config.names.location.p ?? 'Locations'
                    locationTitle = config.names.location.s ?? 'Location'
                }

                this.setState({ ticketsTitle, ticketTitle, accountsTitle, accountTitle, endUsersTitle, userTitle,
                    locationsTitle,
                    locationTitle, })
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
            if (this.props.navigation.state.params.asset !== undefined) {
                this.setState({ asset: this.props.navigation.state.params.asset, isEdit: true })
            }

            if (this.props.navigation.state.params.ticket !== undefined) {
                this.setState({ ticket: this.props.navigation.state.params.ticket })
            }
        }

        setTimeout(() => {
            if (this.state.asset) {
                this.setState({
                    isEdit: true,
                    startDate: Moment(this.state.asset.start_date).format(DateFormat.YYYYMMDDTHHMMSS),
                    accountSelected: {
                        id: this.state.asset.account_id ? this.state.asset.account_id : undefined,
                        name: this.state.asset.account_name ? this.state.asset.account_name : 'Default',
                        value_title: this.state.asset.account_name,
                    },
                    locationSelected: {
                        id: this.state.asset.location_id ? this.state.asset.location_id : undefined,
                        name: this.state.asset.location_name ? this.state.asset.location_name : 'Default',
                        value_title: this.state.asset.location_name,
                    },
                    ticketSelected: {
                        id: this.state.asset.ticket_id ? this.state.asset.ticket_id : undefined,
                        key: this.state.asset.ticket_key ? this.state.asset.ticket_key : this.state.asset.ticket_id ? this.state.asset.ticket_id : undefined,
                        number: this.state.asset.ticket_number ? this.state.asset.ticket_number : undefined,
                        subject: this.state.asset.ticket_name ? this.state.asset.ticket_name : 'Default',
                        value_title: `${this.state.asset.ticket_number || ''} ${this.state.asset.ticket_name}`,
                    },
                    userSelected: {
                        id: this.state.asset.checkout_id ? this.state.asset.checkout_id : undefined,
                        firstname: this.state.asset.checkout_name ? this.state.asset.checkout_name : 'Default',
                        lastname: '',
                        email: this.state.asset.checkout_email || '',
                        value_title: `${this.state.asset.checkout_name} (${this.state.asset.checkout_email || ''})`,
                    },
                    assetSelected: {
                        id: this.state.asset.id ? this.state.asset.id : undefined,
                        name: this.state.asset.name ? this.state.asset.name : (this.state.asset.id ? this.state.asset.serial_tag_number : 'Default'),
                        value_title: this.state.asset.name,
                    },
                    isMyAsset: this.state.asset.is_personal,
                    description: this.state.asset.description,
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
                    locationSelected: {
                        id: this.state.ticket.location_id ? this.state.ticket.location_id : undefined,
                        name: this.state.ticket.location_name ? this.state.ticket.location_name : 'Default',
                        value_title: this.state.ticket.location_name,
                    },
                    userSelected: {
                        id: this.state.ticket.checkout_id ? this.state.ticket.checkout_id : undefined,
                        firstname: this.state.ticket.checkout_firstname ? this.state.ticket.checkout_firstname : 'Default',
                        lastname: this.state.ticket.checkout_lastname ? this.state.ticket.checkout_lastname : '',
                        email: this.state.ticket.checkout_email,
                        value_title: `${this.state.ticket.checkout_firstname} ${this.state.ticket.checkout_lastname} (${this.state.ticket.user_email})`,
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
        if (this.props.navigation.state.params !== undefined) {
        if (this.props.navigation.state.params.userSelected !== undefined) {
            this.selectionDidChange('Users', null, this.props.navigation.state.params.userSelected)
            //this.setState({ userSelected: this.props.navigation.state.params.userSelected })
        }

        if (this.props.navigation.state.params !== undefined) {
            if (this.props.navigation.state.params.assetSelected) {
                this.selectionDidChange('Asset', null, this.props.navigation.state.params.assetSelected)
            }
        }
    }
    }

    componentWillUnmount() {
        Keyboard.dismiss();
    }

    //Actions

    /* Validating information and calling update api */
    btnAssignAssetPressed() {
        /* Checking validation if it's valid calling API*/
        if (this.isValid()) {
            Keyboard.dismiss();
            // return
            var obj = {
                'account_id': -1,
                'location_id': 0,
                'ticket': 0,
                'note': this.state.description,
                'deploy_date': this.state.startDate,
                'checkout_id': this.props.configInfo && this.props.configInfo.user.user_id || '',
                //'timezone': this.state.asset.timezone,
                'id': this.state.assetSelected.id
            }

            if (this.state.accountSelected && this.state.accountSelected.id != null && this.state.accountSelected.id != undefined) {
                obj.account_id = this.state.accountSelected.id
            }

            if (this.state.userSelected && this.state.userSelected.id != null && this.state.userSelected.id != undefined) {
                obj.checkout_id = this.state.userSelected.id
            }

            if (this.state.locationSelected && this.state.locationSelected.id != null && this.state.locationSelected.id != undefined) {
                obj.location_id = this.state.locationSelected.id
            }

            if (this.state.ticketSelected && this.state.ticketSelected.id != null && this.state.ticketSelected.id != undefined) {
                obj.ticket = this.state.ticketSelected.id
            }

            if (this.state.assetSelected && this.state.assetSelected.id != null && this.state.assetSelected.id != undefined) {
                obj.id = this.state.assetSelected.id
            }

            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))

            ApiHelper.postWithParam(ApiHelper.Apis.AssetsAssign, obj, this, true, authHeader)
                .then((response) => {
                    this.props.navigation.goBack();
                    Toast.show({
                        text: `Asset has been assigned successfully.`,
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
            showUsersPopup: false,
            showLocationPopup: false,
            showTicketPopup: false,
            showAssetPopup: false,
        })
    }

    /* Setting state on drop down selection change */
    selectionDidChange(dropDownName, selected, selectedData) {
        if (dropDownName === 'Account') {
            this.setState({
                accountName: selected,
                accountSelected: selectedData,
                //userSelected: null,
                locationSelected: null,
                ticketSelected: null,
            });
        } else if (dropDownName === 'Users') {
            this.setState({
                userSelected: selectedData,
            });
        } else if (dropDownName === 'Locations') {
            this.setState({
                locationSelected: selectedData,
                ticketSelected: null,
            });
        } else if (dropDownName === 'Tickets') {
            this.setState({
                ticketSelected: selectedData,
            });
        } else if (dropDownName === 'Asset') {
            if (selectedData)
            {
            selectedData.name = selectedData.name ? selectedData.name : (selectedData.id ? selectedData.serial_tag_number : 'Default'),
            selectedData.value_title = selectedData.name
            }
            this.setState({ assetSelected: selectedData });
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
        }
    }

    //Class Methods

    /* Checking validation and returns true/false */
    isValid() {
        if (this.state.accountSelected == null) {
            setTimeout(() => this.fetchAccounts(true), 200)
            return false
        } else if (!this.state.description || ValidationHelper.isInvalidText(this.state.description)) {
            setTimeout(() => this.descriptionRef._root.focus(), 200)
            return false
        } else if (this.state.assetSelected == null) {
            setTimeout(() => this.fetchAssets(true), 200)
            return false
        } else if (ValidationHelper.isInvalidText(this.state.startDate)) {
            setTimeout(() => this.setState({ showStartDatePicker: true }), 200)
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

    /* Calling api to fetch users and display selection popup  */
    fetchUsers(isShowPopup = false) {
        //this.setState({ showUsersPopup: true })
        if (this.props.navigation.state.params)
        this.props.navigation.state.params.userSelected = null;
    this.props.navigation.push('SearchUsers', { screen: 'AddEditAsset', account: this.state.accountSelected });
    }

    /* Calling api to fetch locations and display selection popup  */
    fetchLocations(isShowPopup = false) {
        let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
        var id = this.state.account ? this.state.account.id : -1
        if (this.state.accountSelected && this.state.accountSelected.id != null && this.state.accountSelected.id != undefined) {
            id = this.state.accountSelected.id
        }
        let objData = { is_with_statistics: false, account: id }
        ApiHelper.getWithParam(ApiHelper.Apis.Locations, objData, this, true, authHeader).then((response) => {
            var arrLocations = []
            arrLocations.push({ value_title: 'Default', name: 'Default' })
            for (const key in response) {
                if (Object.hasOwnProperty.call(response, key)) {
                    var obj = response[key];
                    obj.value_title = obj.name
                    arrLocations.push(obj)
                }
            }
            this.setState({ locationDataSource: arrLocations })
            if (isShowPopup) {
                this.setState({ showLocationPopup: true })
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
        var locationId = 0
        if (this.state.locationSelected && this.state.locationSelected.id != null && this.state.locationSelected.id != undefined) {
            locationId = this.state.locationSelected.id
        }
        let objData = { status: 'open', account: id, location: locationId }
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

    /* Calling api to fetch assets and display selection popup  */
    fetchAssets(isShowPopup = false) {
        if (this.props.navigation.state.params)
        this.props.navigation.state.params.assetSelected = null;
    this.props.navigation.push('SearchAssets', { screen: 'AddEditAsset', account: this.state.accountSelected });
    }

    /* Calling api to fetch Assets and display selection popup  */
    /*fetchAssets(isShowPopup = false) {
        if (this.state.assetDataSource.length > 0 && isShowPopup) {
            this.setState({ showAssetPopup: true })
        } else {
            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
            ApiHelper.getWithParam(ApiHelper.Apis.AssetsSearch, {}, this, true, authHeader).then((response) => {
                var arrTemp = []
                // arrTemp.push({ value_title: 'Default', name: 'Default' })
                for (const key in response) {
                    if (Object.hasOwnProperty.call(response, key)) {
                        var obj = response[key];
                        obj.value_title = obj.name
                        arrTemp.push(obj)
                    }
                }
                this.setState({ assetDataSource: arrTemp })
                if (isShowPopup) {
                    this.setState({ showAssetPopup: true })
                }
            })
                .catch((response) => {
                    ApiHelper.handleErrorAlert(response)
                })
        }
    }
    */

    /* Rendering popup screen */
    renderDropDownOptions() {
        if (this.state.showAccountNamePopup) {
            return (
                <AccountSelectionWithLoadMore dataSource={this.state.accountDataSource} defaultOption={{ value_title: 'Default', name: 'Default' }} dismissPopup={() => this.dismissPopup()} selected={this.state.accountName} selectedData={this.state.accountSelected} selectionDidChange={(selected, selectedData) => { this.selectionDidChange('Account', selected, selectedData); }} />
            )
        } else if (this.state.showUsersPopup) {
            return (
                <Selection name={this.state.userTitle} dataSource={this.state.usersDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.userSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Users', selected, data); }} />
            )
        } else if (this.state.showLocationPopup) {
            return (
                <Selection name={this.state.locationTitle} dataSource={this.state.locationDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.locationSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Locations', selected, data); }} />
            )
        } else if (this.state.showTicketPopup) {
            return (
                <Selection dataSource={this.state.ticketDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.ticketSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Tickets', selected, data); }} />
            )
        } else if (this.state.showAssetPopup) {
            return (
                <Selection dataSource={this.state.assetDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.assetSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Asset', selected, data); }} />
            )
        } else {
            return null
        }
    }

    /* Rendering date picker view */
    renderDatePicker() {
        if (this.state.showStartDatePicker) {
            return (
                <DatePickerView mode={Platform.OS == 'android' ? 'date' : 'datetime'} minDate={null} maxDate={null} dismissPopup={() => this.dismissPopup()} selectedDate={this.state.startDate ?? Moment().format(DateFormat.YYYYMMDDTHHMMSS)} dateDidChange={(date) => { this.dateDidChange(date, 'startDate'); }} />
            )
        } else if (this.state.showStartTimePicker) {
            return (
                <DatePickerView mode={'time'} minDate={null} maxDate={null} dismissPopup={() => this.dismissPopup()} selectedDate={this.state.startDate} dateDidChange={(date) => { this.dateDidChange(date, 'startTime'); }} />
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
                        showTitle={this.state.isEdit ? 'Assign Asset' : 'Assign Asset'}
                    />
                </SafeAreaView>
                {this.renderDropDownOptions()}
                {this.renderDatePicker()}
                <View style={styles.contentContainer}>
                    <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
                        <SafeAreaView style={styles.mainContainer}>
                            <View style={[styles.mainContainer, { paddingTop: 30, paddingBottom: 30 }]}>
                            <View>
                                    <Label style={[styles.inputTitle, styles.placeholderColor]}>Date</Label>
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
                                            placeholder={'Date'}
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
                                                this.userRef = input;
                                            }}
                                            onSubmitEditing={() => {
                                                // this.taskTypeRef._root.focus();
                                            }}
                                        />
                                        <Image style={styles.rightIcon} source={Images.downarrow} />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <Label style={[styles.inputTitle, styles.placeholderColor]}>Asset</Label>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={[styles.inputContainer, this.state.currentEditingField == 'asset' ? styles.inputActive : styles.inputInactive]}
                                        onPress={() => {
                                            this.fetchAssets(true)
                                        }}>
                                        <Input
                                            pointerEvents={'none'}
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
                                                    this.locationRef._root.focus();
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
                                                    this.locationRef = input;
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
                                                this.userRef._root.focus();
                                            }}
                                        />
                                        <Image style={styles.rightIcon} source={Images.downarrow} />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <Label style={[styles.inputTitle, styles.placeholderColor]}>Notes</Label>
                                    <View style={[styles.inputContainer, { height: 100, paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10 }, this.state.currentEditingField == 'description' ? styles.inputActive : styles.inputInactive]}>
                                        <Textarea
                                            style={[styles.input, { height: '100%', width: '100%' }]}
                                            placeholder='Notes'
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
                                {!this.state.isEdit && false ?
                                    <View>
                                        <Label style={[styles.inputTitle, styles.placeholderColor]}>Assigned</Label>
                                        <View style={styles.multifieldContainer}>
                                            <View style={styles.switchContainer}>
                                                <TouchableOpacity onPress={() => {
                                                    this.setState({ isMyAsset: !this.state.isMyAsset })
                                                }}>
                                                    <Image style={styles.switchIcon} source={this.state.isMyAsset ? Images.toggleOn : Images.toggleOff} />
                                                </TouchableOpacity>
                                                <Label style={styles.switchTitle}>My Asset</Label>
                                            </View>
                                        </View>
                                    </View> : null}
                                <TouchableOpacity activeOpacity={0.7} style={styles.buttonContainer} onPress={() => {
                                        this.btnAssignAssetPressed()
                                }}>
                                    <Text style={styles.buttonText}>{this.state.isEdit ? 'Assign Asset' : 'Assign Asset'}</Text>
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
export default connect(mapStateToProps)(AddEditAsset);