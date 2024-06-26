/* Imports */
import React, { Component } from 'react'
import { ScrollView, Image, View, TouchableOpacity, Platform, StatusBar, SafeAreaView, Text, Keyboard } from 'react-native'
import { Container, Input, } from 'native-base';
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
import styles from './Styles/FilterTimelogsStyles'

class FilterTimelogs extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            accountSelected: null,
            techSelected: null,
            account: null,
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
        };
    }

    componentDidMount() {
        this.setState({
            loading: false,
            accountSelected: { value_title: `All ${this.state.accountsTitle}`, name: `All ${this.state.accountsTitle}` },
            techSelected: { value_title: `All ${this.state.techsTitle}`, firstname: 'All', lastname: this.state.techsTitle, type: 'queue' },
            account: null,
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

        if (this.props.navigation.state.params !== undefined) {
            if (this.props.navigation.state.params.selected.account !== undefined) {
                this.setState({ accountSelected: this.props.navigation.state.params.selected.account })
            }
            if (this.props.navigation.state.params.selected.tech !== undefined) {
                this.setState({ techSelected: this.props.navigation.state.params.selected.tech })
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
        this.props.navigation.navigate('Timelogs', { selected: { account: this.state.accountSelected, tech: this.state.techSelected } })
    }

    /* Setting filter to defaults settings */
    btnResetPressed() {
        this.setState({
            accountSelected: { value_title: `All ${this.state.accountsTitle}`, name: `All ${this.state.accountsTitle}` },
            techSelected: { value_title: `All ${this.state.techsTitle}`, firstname: 'All', lastname: this.state.techsTitle, type: 'queue' },
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
                arrAccounts.push({ value_title: `All ${this.state.accountsTitle}`, name: `All ${this.state.accountsTitle}` })
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
        /*
        if (this.state.userDataSource.length > 0 && isShowPopup) {
            this.setState({ showUsersPopup: true })
        } else {
            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
            ApiHelper.get(ApiHelper.Apis.Users, this, authHeader).then((response) => {
                var arrAccounts = []
                arrAccounts.push({ value_title: `All ${this.state.techsTitle}`, firstname: 'All', lastname: this.state.techsTitle })
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

    /* Hidding(Dismissing) popup screen */
    dismissPopup(option) {
        this.setState({
            showAccountNamePopup: false,
            showUsersPopup: false,
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
        }
        this.dismissPopup();
    }

    /* Rendering popup screen */
    renderDropDownOptions() {
        if (this.state.showAccountNamePopup) {
            return (
                <AccountSelectionWithLoadMore dataSource={this.state.accountDataSource} defaultOption={{ value_title: `All ${this.state.accountsTitle}`, name: `All ${this.state.accountsTitle}` }} dismissPopup={() => this.dismissPopup()} selected={this.state.accountName} selectedData={this.state.accountSelected} selectionDidChange={(selected, selectedData) => { this.selectionDidChange('Account', selected, selectedData); }} />
            )
        } else if (this.state.showUsersPopup) {
            return (
                <TechSelectionWithLoadMore dataSource={this.state.userDataSource} defaultOption={{ value_title: `All ${this.state.techsTitle}`, firstname: 'All', lastname: this.state.techsTitle, type: 'queue' }} dismissPopup={() => this.dismissPopup()} selectedData={this.state.techSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Users', selected, data); }}  account={this.state.accountSelected} />
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
                                            this.projectRef._root.focus();
                                        }}
                                    />
                                    <Image style={styles.rightIcon} source={Images.rightarrowWhite} />
                                </TouchableOpacity>
                            </View>
                            : null }
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
                                            this.taskTypeRef._root.focus();
                                        }}
                                    />
                                    <Image style={styles.rightIcon} source={Images.rightarrowWhite} />
                                </TouchableOpacity>
                            </View>

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
export default connect(mapStateToProps)(FilterTimelogs);