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

// Styless
import styles from './Styles/FilterToDosStyles'

class FilterToDos extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            toDoTypeSelected: null,
            techSelected: null,
            account: null,
            showToDoTypePopup: false,
            toDoTypeDataSource: [],
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
            toDoTypeSelected: { value_title: 'All', name: 'All', id: 1 },
            techSelected: { value_title: `All ${this.state.techsTitle}`, firstname: 'All', lastname: this.state.techsTitle, type: 'queue' },
            account: null,
            showToDoTypePopup: false,
            toDoTypeDataSource: [{ value_title: 'All', name: 'All', id: 1 },
            { value_title: 'Completed', name: 'Completed', id: 2 },
            { value_title: 'Not Completed', name: 'Not Completed', id: 3 }],
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
                this.setState({ account: this.props.navigation.state.params.selected.account })
            }
            if (this.props.navigation.state.params.selected.toDoTypeSelected !== undefined) {
                this.setState({ toDoTypeSelected: this.props.navigation.state.params.selected.toDoTypeSelected })
            }
            if (this.props.navigation.state.params.selected.tech !== undefined) {
                this.setState({ techSelected: this.props.navigation.state.params.selected.tech })
            }
        }

        this.viewWillAppear()
        this.props.navigation.addListener('didFocus', this.viewWillAppear)
    }

    viewWillAppear = () => {

    }

    componentWillUnmount() {
        Keyboard.dismiss();
    }

    //Actions

    /* Applying new filter and returns to todos screen */
    btnApplyPressed() {
        this.props.navigation.navigate('ToDos', { selected: { toDoTypeSelected: this.state.toDoTypeSelected, tech: this.state.techSelected } })
    }

    /* Setting filter to defaults settings */
    btnResetPressed() {
        this.setState({
            toDoTypeSelected: { value_title: 'All', name: 'All', id: 1 },
            techSelected: { value_title: `All ${this.state.techsTitle}`, firstname: 'All', lastname: this.state.techsTitle, type: 'queue' },
        })
    }

    //Class Methods

    /* Calling api to fetch users and display user selection popup */
    fetchUsers(isShowPopup = false) {
        this.setState({ showUsersPopup: true })
    }

    /* Hidding(Dismissing) popup screen */
    dismissPopup(option) {
        this.setState({
            showToDoTypePopup: false,
            showUsersPopup: false,
        })
    }

    /* Setting state on drop down selection change */
    selectionDidChange(dropDownName, selected, selectedData) {
        if (dropDownName === 'ToDo') {
            this.setState({
                toDoTypeSelected: selectedData,
            });
        } else if (dropDownName === 'Users') {
            this.setState({ techSelected: selectedData });
        }
        this.dismissPopup();
    }

    /* Rendering popup screen */
    renderDropDownOptions() {
        if (this.state.showToDoTypePopup) {
            return (
                <Selection dataSource={this.state.toDoTypeDataSource} dismissPopup={() => this.dismissPopup()} selected={this.state.to} selectedData={this.state.toDoTypeSelected} selectionDidChange={(selected, selectedData) => { this.selectionDidChange('ToDo', selected, selectedData); }} />
            )
        } else if (this.state.showUsersPopup) {
            return (
                <TechSelectionWithLoadMore dataSource={this.state.userDataSource} defaultOption={{ value_title: `All ${this.state.techsTitle}`, firstname: 'All', lastname: this.state.techsTitle, type: 'queue' }} dismissPopup={() => this.dismissPopup()} selectedData={this.state.techSelected} selectionDidChange={(selected, data) => { this.selectionDidChange('Users', selected, data); }}  account={this.state.account} />
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
                            <View>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[styles.inputContainer, this.state.currentEditingField == 'todo' ? styles.inputActive : styles.inputInactive]}
                                    onPress={() => { this.setState({ showToDoTypePopup: true }) }}>
                                    <Input
                                        pointerEvents={'none'}
                                        editable={false}
                                        style={styles.input}
                                        placeholder={'All'}
                                        placeholderTextColor={Colors.placeholder}
                                        autoCapitalize='words'
                                        selectionColor={Colors.mainPrimary}
                                        value={this.state.toDoTypeSelected ? this.state.toDoTypeSelected.name : ''}
                                        // onChangeText={value => this.setState({ toDoType: value })}
                                        blurOnSubmit={false}
                                        keyboardAppearance='dark'
                                        returnKeyType={"next"}
                                        onFocus={value => {
                                            this.setState({ currentEditingField: 'todo' })
                                        }}
                                        onEndEditing={value => { this.setState({ currentEditingField: null }) }}
                                        ref={input => {
                                            this.todoRef = input;
                                        }}
                                        onSubmitEditing={() => {
                                            this.projectRef._root.focus();
                                        }}
                                    />
                                    <Image style={styles.rightIcon} source={Images.rightarrowWhite} />
                                </TouchableOpacity>
                            </View>

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
    return { authToken, org, user }
};

/* Connecting to redux store and exporting class */
export default connect(mapStateToProps)(FilterToDos);