/* Imports */
import React, { Component } from 'react'
import { ScrollView, Image, View, TouchableOpacity, Platform, StatusBar, SafeAreaView, Text, Keyboard } from 'react-native'
import { Container, Input, Label } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';

import CommonFunctions from '../../../Components/CommonFunctions';
import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Images, Colors } from '../../../Themes';
import LinearGradient from 'react-native-linear-gradient';
import ApiHelper from '../../../Components/ApiHelper';
import Loader from '../../../Components/Loader';
import { UserDataKeys } from '../../../Components/Constants';
import Selection from '../Selection';
import TechSelectionWithLoadMore from '../TechSelectionWithLoadMore';
import AccountSelectionWithLoadMore from '../AccountSelectionWithLoadMore';

// Styless
import styles from './Styles/FilterTicketStyles'

class FilterTickets extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            accountSelected: null,
            techSelected: null,
            account: null,
            locationSelected: null,
            showLocationPopup: false,
            locationDataSource: [],
            classSelected: null,
            classDataSource: [],
            showClassPopup: false,
            prioritySelected: null,
            priorityDataSource: [],
            showPriorityPopup: false,
            statusSelected: null,
            statusDataSource: [],
            showStatusPopup: false,
            showAccountNamePopup: false,
            accountDataSource: [],
            showUsersPopup: false,
            userDataSource: [],
            ticketsTitle: 'Tickets',
            ticketTitle: 'Ticket',
            accountTitle: 'Account',
            accountsTitle: 'Accounts',
            techTitle: 'Tech',
            techsTitle: 'Technicians',
            locationsTitle: 'Locations',
            locationTitle: 'Location',
        };
    }

    componentDidMount() {
        this.setState({
            loading: false,
            accountSelected: null,//{ value_title: `All ${this.state.accountsTitle}`, name: `All ${this.state.accountsTitle}` },
            techSelected: null,//{ value_title: `All ${this.state.techTitle}`, firstname: 'All', lastname: this.state.techTitle },
            account: null,
            locationSelected: null,
            showLocationPopup: false,
            locationDataSource: [],
            classSelected: null,
            classDataSource: [],
            showClassPopup: false,
            prioritySelected: null,
            priorityDataSource: [],
            showPriorityPopup: false,
            statusSelected: null,
            statusDataSource: [
                            //    { value_title: 'Open', name: 'Open', api_value: 'open' }, 
                            //    { value_title: 'Closed', name: 'Closed', api_value: 'closed' }, 
                               { value_title: 'On Hold', name: 'On Hold', api_value: 'onhold' }, 
                               { value_title: 'Waiting On Response', name: 'Waiting On Response', api_value: 'waiting' }],
            showStatusPopup: false,
            showAccountNamePopup: false,
            accountDataSource: [],
            showUsersPopup: false,
            userDataSource: [],
            ticketsTitle: 'Tickets',
            ticketTitle: 'Ticket',
            accountTitle: 'Account',
            accountsTitle: 'Accounts',
            techTitle: 'Tech',
            techsTitle: 'Technicians',
            locationsTitle: 'Locations',
            locationTitle: 'Location',
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
                var locationsTitle = 'Locations'
                var locationTitle = 'Location'
                if (config.is_customnames) {
                    ticketsTitle = config.names.ticket.p ?? 'Tickets'
                    ticketTitle = config.names.ticket.s ?? 'Ticket'
                    accountsTitle = config.names.account.p ?? 'Accounts'
                    accountTitle = config.names.account.s ?? 'Account'
                    techsTitle = config.names.tech.p ?? 'Technicians'
                    techTitle = config.names.tech.a ?? 'Tech'
                    locationsTitle = config.names.location.p ?? 'Locations'
                    locationTitle = config.names.location.s ?? 'Location'
                }

                this.setState({ ticketsTitle, ticketTitle, accountsTitle, accountTitle, techsTitle, techTitle, locationsTitle, locationTitle })
            })

        if (this.props.navigation.state.params !== undefined) {
            if (this.props.navigation.state.params.selected.account !== undefined) {
                this.setState({ accountSelected: this.props.navigation.state.params.selected.account })
            }
            if (this.props.navigation.state.params.selected.tech !== undefined) {
                this.setState({ techSelected: this.props.navigation.state.params.selected.tech })
            }

            if (this.props.navigation.state.params.selected.location !== undefined) {
                this.setState({ locationSelected: this.props.navigation.state.params.selected.location })
            }

            if (this.props.navigation.state.params.selected.class !== undefined) {
                this.setState({ classSelected: this.props.navigation.state.params.selected.class })
            }

            if (this.props.navigation.state.params.selected.status !== undefined) {
                this.setState({ statusSelected: this.props.navigation.state.params.selected.status })
            }

            if (this.props.navigation.state.params.selected.priority !== undefined) {
                this.setState({ prioritySelected: this.props.navigation.state.params.selected.priority })
            }
        }

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

    /* Applying new filter and returns to time-logs screen */
    btnApplyPressed() {
        this.props.navigation.navigate('Tickets', { selected: { 
                                                    account: this.state.accountSelected, 
                                                    tech: this.state.techSelected,
                                                    location: this.state.locationSelected,
                                                    class: this.state.classSelected,
                                                    status: this.state.statusSelected, 
                                                    priority: this.state.prioritySelected, 
                                                } })
    }

    /* Setting filter to defaults settings */
    btnResetPressed() {
        this.setState({
            accountSelected: null,//{ value_title: `All ${this.state.accountsTitle}`, name: `All ${this.state.accountsTitle}` },
            techSelected: null, //{ value_title: `All ${this.state.techTitle}`, firstname: 'All', lastname: this.state.techTitle },
            locationSelected: null,
            classSelected: null,
            statusSelected: null,
            prioritySelected: null,
        })
    }

    //Class Methods
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
                // arrAccounts.push({ value_title: `All ${this.state.accountsTitle}`, name: `All ${this.state.accountsTitle}` })
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
            // arrTemp.push({ value_title: 'Default', name: 'Default' })
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

    /* Calling api to fetch classes and display selection popup */
    fetchClasses(isShowPopup = false) {
        if (this.state.classDataSource.length > 0 && isShowPopup) {
            this.setState({ showClassPopup: true })
        } else {
            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
            ApiHelper.getWithParam(ApiHelper.Apis.Classes, {}, this, true, authHeader).then((response) => {
                var arrTemp = []
                // arrTemp.push({ value_title: 'Default', name: 'Default' })
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

    /* Calling api to fetch priorities and display selection popup */
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

    /* Hidding(Dismissing) popup screen */
    dismissPopup(option) {
        this.setState({
            showAccountNamePopup: false,
            showUsersPopup: false,
            showLocationPopup: false,
            showClassPopup: false,
            showStatusPopup: false,
            showPriorityPopup: false,
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
            });
        } else if (dropDownName === 'Users') {
            this.setState({ techSelected: selectedData });
        } else if (dropDownName === 'Class') {
            this.setState({ classSelected: selectedData });
        } else if (dropDownName === 'Locations') {
            this.setState({
                locationSelected: selectedData,
                projectSelected: null,
            });
        } else if (dropDownName === 'Status') {
            this.setState({ statusSelected: selectedData });
        } else if (dropDownName === 'Priorities') {
            this.setState({ prioritySelected: selectedData });
        }
        this.dismissPopup();
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
        } else if (this.state.showClassPopup) {
            return (
                <Selection dataSource={this.state.classDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.classSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Class', selected, data); }} />
            )
        } else if (this.state.showLocationPopup) {
            return (
                <Selection dataSource={this.state.locationDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.locationSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Locations', selected, data); }} />
            )
        } else if (this.state.showStatusPopup) {
            return (
                <Selection dataSource={this.state.statusDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.statusSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Status', selected, data); }} />
            )
        } else if (this.state.showPriorityPopup) {
            return (
                <Selection dataSource={this.state.priorityDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.prioritySelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Priorities', selected, data); }} />
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
                    style={styles.backgroundImage} />
                <SafeAreaView>
                    <NavigationBar
                        isTransparent
                        navigation={this.props.navigation}
                        showTitle='Filter'
                        rightImage={Images.reset}
                        hideRightButton={false}
                        rightButton={() => {
                            this.btnResetPressed()
                        }}
                    />
                </SafeAreaView>
                {this.renderDropDownOptions()}
                <View style={[styles.mainContainer, styles.contentContainer]}>
                    <SafeAreaView style={styles.mainContainer}>
                        <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
                        {this.props.configInfo && this.props.configInfo.is_account_manager ?
                            <View>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[styles.inputContainer, this.state.currentEditingField == 'account' ? styles.inputActive : styles.inputInactive]}
                                    onPress={() => { this.fetchAccounts(true) }}>
                                    <Input
                                        pointerEvents={'none'}
                                        editable={false}
                                        style={styles.input}
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
 
                                        }}
                                    />
                                    <Image style={styles.rightIcon} source={Images.rightarrowWhite} />
                                </TouchableOpacity>
                            </View>
                               : null}
                            {this.props.configInfo && this.props.configInfo.is_location_tracking ?
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

                                        }}
                                    />
                                    <Image style={styles.rightIcon} source={Images.rightarrowWhite} />
                                </TouchableOpacity>
                                : null}
                            <View>
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

                                        }}
                                    />
                                    <Image style={styles.rightIcon} source={Images.rightarrowWhite} />
                                </TouchableOpacity>
                            </View>
                            {this.props.configInfo && this.props.configInfo.is_class_tracking ?
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

                                        }}
                                    />
                                    <Image style={styles.rightIcon} source={Images.rightarrowWhite} />
                                </TouchableOpacity>
                                : null}
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[styles.inputContainer, this.state.currentEditingField == 'status' ? styles.inputActive : styles.inputInactive]}
                                    onPress={() => {
                                        if (!this.state.isDisableFields) {
                                            this.setState({ showStatusPopup: true })
                                        }
                                    }}>
                                    <Input
                                        pointerEvents={'none'}
                                        editable={false}
                                        style={[styles.input, this.state.isDisableFields ? { color: Colors.textGray } : {}]}
                                        placeholder='Status'
                                        placeholderTextColor={Colors.placeholder}
                                        autoCapitalize='words'
                                        selectionColor={Colors.mainPrimary}
                                        value={this.state.statusSelected ? this.state.statusSelected.name : ''}
                                        blurOnSubmit={false}
                                        keyboardAppearance='dark'
                                        returnKeyType={"next"}
                                        onFocus={value => {
                                            this.setState({ currentEditingField: 'status' })
                                        }}
                                        onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                        ref={input => {
                                            this.statusRef = input;
                                        }}
                                        onSubmitEditing={() => {

                                        }}
                                    />
                                    <Image style={styles.rightIcon} source={Images.rightarrowWhite} />
                                </TouchableOpacity>
                                {this.props.configInfo && this.props.configInfo.is_priorities_general ?
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[styles.inputContainer, this.state.currentEditingField == 'priority' ? styles.inputActive : styles.inputInactive]}
                                    onPress={() => {
                                        if (!this.state.isDisableFields) {
                                            this.fetchPriorities(true)
                                        }
                                    }}>
                                    <Input
                                        pointerEvents={'none'}
                                        editable={false}
                                        style={[styles.input, this.state.isDisableFields ? { color: Colors.textGray } : {}]}
                                        placeholder='Priority'
                                        placeholderTextColor={Colors.placeholder}
                                        autoCapitalize='words'
                                        selectionColor={Colors.mainPrimary}
                                        value={this.state.prioritySelected ? this.state.projectSelected.name : ''}
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

                                        }}
                                    />
                                    <Image style={styles.rightIcon} source={Images.rightarrowWhite} />
                                </TouchableOpacity>
                                : null}

                        </ScrollView>
                        <TouchableOpacity activeOpacity={0.7} style={styles.buttonContainer} onPress={() => { this.btnApplyPressed(); }}>
                            <Text style={styles.buttonText}>Apply</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>
            </Container >
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
export default connect(mapStateToProps)(FilterTickets);