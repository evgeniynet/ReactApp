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
import styles from './Styles/FilterExpenseStyles'

class FilterExpenses extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            accountSelected: null,
            techSelected: null,
            account: null,
            projectSelected: null,
            showProjectPopup: false,
            projectDataSource: [],
            typeSelected: null,
            typeDataSource: [],
            showTypePopup: false,
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
            projectSelected: null,
            showProjectPopup: false,
            projectDataSource: [],
            typeSelected: null,
            typeDataSource: [{ value_title: 'Recent', name: 'Recent', id: 1, api_value: 'recent' },
                             { value_title: 'Linked FreshBooks', name: 'Linked FreshBooks', id: 4, api_value: 'linked_fb'  },
                             { value_title: 'Unlinked FreshBooks', name: 'Unlinked FreshBooks', id: 2, api_value: 'unlinked_fb'  },
                             { value_title: 'Unlinked FreshBooks And Billable', name: 'Unlinked FreshBooks And Billable', id: 3, api_value: 'unlinked_fb_billable'  },
                             { value_title: 'Invoiced', name: 'Invoiced', id: 5, api_value: 'invoiced'  },
                             { value_title: 'Not Invoiced', name: 'Not Invoiced', id: 6, api_value: 'not_invoiced'  },
                             { value_title: 'Not Invoiced And Billable', name: 'Not Invoiced And Billable', id: 7, api_value: 'not_invoiced_billable'  },
                             { value_title: 'Not Invoiced And Non Billable', name: 'Not Invoiced And Non Billable', id: 8, api_value: 'not_invoiced_nonbillable'  },
                             { value_title: 'Linked QuickBooks', name: 'Linked QuickBooks', id: 10, api_value: 'linked_qb'  },
                             { value_title: 'Unlinked QuickBooks', name: 'Unlinked QuickBooks', id: 9, api_value: 'unlinked_qb'  },
                             { value_title: 'Unlinked QuickBooks And Billable', name: 'Unlinked QuickBooks And Billable', id: 11, api_value: 'unlinked_qb_billable'  },
                             { value_title: 'Recent Hidden From Invoice', name: 'Recent Hidden From Invoice', id: 12, api_value: 'hidden_from_invoice'  },
                            ],
            showTypePopup: false,
            showAccountNamePopup: false,
            accountDataSource: [],
            showUsersPopup: false,
            userDataSource: [],
            ticketsTitle: 'Tickets',
            ticketTitle: 'Ticket',
            accountTitle: 'Account',
            accountsTitle: 'Accounts',
            techTitle: 'Technician',
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
                var techTitle = 'Technician'
                var techsTitle = 'Technicians'
                var locationsTitle = 'Locations'
                var locationTitle = 'Location'
                if (config.is_customnames) {
                    ticketsTitle = config.names.ticket.p ?? 'Tickets'
                    ticketTitle = config.names.ticket.s ?? 'Ticket'
                    accountsTitle = config.names.account.p ?? 'Accounts'
                    accountTitle = config.names.account.s ?? 'Account'
                    techsTitle = config.names.tech.p ?? 'Technicians'
                    techTitle = config.names.tech.s ?? 'Technician'
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

            if (this.props.navigation.state.params.selected.project !== undefined) {
                this.setState({ projectSelected: this.props.navigation.state.params.selected.project })
            }           

            if (this.props.navigation.state.params.selected.type !== undefined) {
                this.setState({ typeSelected: this.props.navigation.state.params.selected.type })
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
        this.props.navigation.navigate('Expenses', { selected: { 
                                                    account: this.state.accountSelected, 
                                                    tech: this.state.techSelected,
                                                    project: this.state.projectSelected,
                                                    type: this.state.typeSelected, 
                                                } })
    }

    /* Setting filter to defaults settings */
    btnResetPressed() {
        this.setState({
            accountSelected: null,//{ value_title: `All ${this.state.accountsTitle}`, name: `All ${this.state.accountsTitle}` },
            techSelected: null, //{ value_title: `All ${this.state.techTitle}`, firstname: 'All', lastname: this.state.techTitle },
            projectSelected: null,
            typeSelected: null,
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
/*
        if (this.state.userDataSource.length > 0 && isShowPopup) {
            this.setState({ showUsersPopup: true })
        } else {
            let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
            ApiHelper.get(ApiHelper.Apis.Users, this, authHeader).then((response) => {
                var arrAccounts = []
                // arrAccounts.push({ value_title: `All ${this.state.techTitle}`, firstname: 'All', lastname: this.state.techTitle })
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
            // arrProjects.push({ value_title: 'Default', name: 'Default' })
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

    // /* Calling api to fetch type and display selection popup */
    // fetchType(isShowPopup = false) {
    //     if (this.state.typeDataSource.length > 0 && isShowPopup) {
    //         this.setState({ showTypePopup: true })
    //     } else {
    //         let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
    //         ApiHelper.getWithParam(ApiHelper.Apis.Products, {}, this, true, authHeader).then((response) => {
    //             var arrTemp = []
    //             // arrTemp.push({ value_title: 'Default', name: 'Default' })
    //             for (const key in response) {
    //                 if (Object.hasOwnProperty.call(response, key)) {
    //                     var obj = response[key];
    //                     obj.value_title = obj.name
    //                     arrTemp.push(obj)
    //                 }
    //             }
    //             this.setState({ typeDataSource: arrTemp })
    //             if (isShowPopup) {
    //                 this.setState({ showTypePopup: true })
    //             }
    //         })
    //             .catch((response) => {
    //                 ApiHelper.handleErrorAlert(response)
    //             })
    //     }
    // }

    /* Hidding(Dismissing) popup screen */
    dismissPopup(option) {
        this.setState({
            showAccountNamePopup: false,
            showUsersPopup: false,
            showProjectPopup: false,
            showTypePopup: false,
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
        } else if (dropDownName === 'Project') {
            this.setState({ projectSelected: selectedData });
        } else if (dropDownName === 'Type') {
            this.setState({ typeSelected: selectedData });
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
        } else if (this.state.showProjectPopup) {
            return (
                <Selection dataSource={this.state.projectDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.projectSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Project', selected, data); }} />
            )
        } else if (this.state.showTypePopup) {
            return (
                <Selection dataSource={this.state.typeDataSource} dismissPopup={() => this.dismissPopup()} selectedData={this.state.typeSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Type', selected, data); }} />
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
                            : null }
                            {this.props.configInfo && this.props.configInfo.is_project_tracking ?
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
                                        placeholder={'Project'}
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

                                        }}
                                    />
                                    <Image style={styles.rightIcon} source={Images.rightarrowWhite} />
                                </TouchableOpacity>
                                : null}
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[styles.inputContainer, this.state.currentEditingField == 'type' ? styles.inputActive : styles.inputInactive]}
                                    onPress={() => {
                                        if (!this.state.isDisableFields) {
                                           this.setState({ showTypePopup: true })
                                        }
                                    }}>
                                    <Input
                                        pointerEvents={'none'}
                                        editable={false}
                                        style={[styles.input, this.state.isDisableFields ? { color: Colors.textGray } : {}]}
                                        placeholder='Type'
                                        placeholderTextColor={Colors.placeholder}
                                        autoCapitalize='words'
                                        selectionColor={Colors.mainPrimary}
                                        value={this.state.typeSelected ? this.state.typeSelected.name : ''}
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

                                        }}
                                    />
                                    <Image style={styles.rightIcon} source={Images.rightarrowWhite} />
                                </TouchableOpacity>
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
export default connect(mapStateToProps)(FilterExpenses);