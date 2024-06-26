/* Imports */
import React, { Component } from 'react'
import { Image, View, TouchableOpacity, Platform, SafeAreaView, } from 'react-native'
import { Label, CardItem, Button, Text, Toast } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { SwipeListView } from 'react-native-swipe-list-view';

import { Messages, UserDataKeys } from '../../../Components/Constants';
import { Images, Colors, Metrics } from '../../../Themes';
import CommonFunctions from '../../../Components/CommonFunctions';
import ApiHelper from '../../../Components/ApiHelper';
import LoaderBar from '../../../Components/LoaderBar';
import AddResponse from './AddResponse';

// Styless
import styles from './Styles/AccountTicketsStyles'

class AccountTickets extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            dataSourceOpen: [],
            dataSourceClose: [],
            activeTicketsTab: 'Open Tickets',
            canRightSwipe: false,
            pageOpen: 0,
            isLoadingMoreOpen: false,
            canLoadMoreOpen: true,
            pageClose: 0,
            isLoadingMoreClose: false,
            canLoadMoreClose: true,
            showAddResponsePopup: false,
            addResponseRow: {},
            tickets: 'Tickets',
            ticketTitle: 'Ticket',
            config: {}
        };
    }

    componentDidMount() {
        CommonFunctions.retrieveData(UserDataKeys.Config)
            .then((response) => {
                let config = JSON.parse(response)
                var ticketTitle = 'Ticket'
                var tickets = 'Tickets'
                if (config.is_customnames) {
                    tickets = config.names.ticket.p ?? 'Tickets'
                    ticketTitle = config.names.ticket.s ?? 'Ticket'
                }
                this.setState({ ticketTitle: ticketTitle, tickets: tickets, config: config, activeTicketsTab: `Open ${tickets}` })
                // Call Apis
            })

        CommonFunctions.retrieveData(UserDataKeys.AccountTicketSwipeToDelete)
            .then((result) => {
                if (result === null || result !== '1') {
                    this.setState({ showSwipwToDeletePreview: true })
                    setTimeout(() => CommonFunctions.storeData(UserDataKeys.AccountTicketSwipeToDelete, '1'), 3000)
                }
            })
        this.viewWillAppear()
        this.props.mainState.subs = [
            this.props.mainState.props.navigation.addListener('didFocus', this.viewWillAppear)
        ]
    }

    /* Calling api to fetch tickets when view will appears */
    viewWillAppear = () => {
        if (!this.state.loading && this.props.mainState && this.props.mainState.state.selectedTab == this.state.tickets) {
            this.setState({
                pageOpen: 0,
                isLoadingMoreOpen: false,
                canLoadMoreOpen: true,
                pageClose: 0,
                isLoadingMoreClose: false,
                canLoadMoreClose: true,
            })
            setTimeout(() => {
                if (this.props.account) {
                    this.fetchOpenTicket()
                    this.fetchCloseTickets()
                }
            }, 100)
        }
    }

    componentWillUnmount() {
        if (this.props.mainState && this.props.mainState.sub) {
            this.props.mainState.subs.forEach((sub) => {
                sub.remove();
            });
        }
    }
    //Actions

    /* Calling api to load more data */
    handleLoadMore() {
        if (!this.state.loading) {
            setTimeout(() => {
                if (this.props.account) {
                    if (this.props.activeTicketsTab == `Open ${this.state.tickets}` && !this.state.isLoadingMoreOpen && this.state.canLoadMoreOpen) {
                        this.setState({ pageOpen: this.state.pageOpen + 1, isLoadingMoreOpen: true })
                        this.fetchOpenTicket()
                    } else if (this.props.activeTicketsTab == `Closed ${this.state.tickets}` && !this.state.isLoadingMoreClose && this.state.canLoadMoreClose) {
                        this.setState({ pageClose: this.state.pageClose + 1, isLoadingMoreClose: true })
                        this.fetchCloseTickets()
                    }
                }
            }, 100)
        }
    }

    /* Hidding(Dismissing) popup screen */
    dismissPopup(option) {
        this.setState({ showAddResponsePopup: false })
    }

    /* Setting state on drop down selection change */
    selectionDidChange(dropDownName, selected) {
        if (dropDownName === 'AddResponse') {
            setTimeout(() => {
                this.addReponseTicket(this.state.addResponseRow, selected);
            }, 600)
        }
        this.dismissPopup();
    }

    //Class Methods

    /* Calling api to fetch open tickets */
    fetchOpenTicket = async () => {
        var authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
        var objData = {}
        if (this.state.pageOpen == 0) {
            objData = { limit: 6, status: 'open,onhold', account: this.props.account.id }
        } else {
            objData = { limit: 6, page: this.state.pageOpen, status: 'open,onhold', account: this.props.account.id }
        }
        this.onEndReachedCalledDuringMomentum = false
        ApiHelper.getWithParam(ApiHelper.Apis.Tickets, objData, this, true, authHeader).then((response) => {
            if (this.state.pageOpen !== 0) {
                if (response.length == 0) {
                    this.setState({ pageOpen: this.state.pageOpen - 1, canLoadMoreOpen: false })
                } else if (response.length < 6) {
                    this.setState({ canLoadMoreOpen: false })
                }
                let arr = [...this.state.dataSourceOpen, ...response]
                this.setState({ dataSourceOpen: arr, isLoadingMoreOpen: false })
            } else {
                this.setState({ dataSourceOpen: response })
            }
        })
            .catch((response) => {
                this.setState({ isLoadingMoreOpen: false })
                ApiHelper.handleErrorAlert(response)
            })
    }

    /* Calling api to fetch closed tickets */
    fetchCloseTickets = async () => {
        var authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
        var objData = {}
        if (this.state.pageClose == 0) {
            objData = { limit: 6, status: 'closed', account: this.props.account.id }
        } else {
            objData = { limit: 6, page: this.state.pageClose, status: 'closed', account: this.props.account.id }
        }
        this.onEndReachedCalledDuringMomentum = false
        ApiHelper.getWithParam(ApiHelper.Apis.Tickets, objData, this, true, authHeader).then((response) => {
            if (this.state.pageClose !== 0) {
                if (response.length == 0) {
                    this.setState({ pageClose: this.state.pageClose - 1, canLoadMoreClose: false })
                } else if (response.length < 6) {
                    this.setState({ canLoadMoreClose: false })
                }
                let arr = [...this.state.dataSourceClose, ...response]
                this.setState({ dataSourceClose: arr, isLoadingMoreClose: false })
            } else {
                this.setState({ dataSourceClose: response })
            }
        })
            .catch((response) => {
                this.setState({ isLoadingMoreClose: false })
                ApiHelper.handleErrorAlert(response)
            })
    }

    /* Calling api to reopen ticket */
    reopenTicket(row) {
        // CommonFunctions.presentAlertWithAction(Messages.AskReopen + ` #${row.item.number}?`, Messages.ReOpen)
        //     .then((respose) => {
        let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
        let objData = { status: 'open', note_text: '' }
        ApiHelper.putWithParam(ApiHelper.Apis.Tickets + `/${row.item.key}`, objData, this, true, authHeader).then((response) => {
            const arrCloseSource = this.state.dataSourceClose
            arrCloseSource.splice(row.index, 1)
            var arrOpenSource = this.state.dataSourceOpen
            arrOpenSource.unshift(row.item)
            this.setState({ dataSourceClose: arrCloseSource, dataSourceOpen: arrOpenSource });

            Toast.show({
                text: `${this.state.ticketTitle} has been reopened #${row.item.number}`,
                position: 'top',
                duration: 3000,
                type: 'success',
                style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
            })
        })
            .catch((response) => {
                ApiHelper.handleErrorAlert(response)
            })
        // })
    }

    /* Calling api to add user response */
    addReponseTicket(row, note) {
        // CommonFunctions.presentAlertWithAction(Messages.AskReopen + ` #${row.item.number}?`, Messages.ReOpen)
        //     .then((respose) => {
        let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
        let objData = { action: 'response', note_text: note, files: [] }
        ApiHelper.postWithParam(ApiHelper.Apis.Tickets + `/${row.item.id}`, objData, this, true, authHeader).then((response) => {
            Toast.show({
                text: `Note added to #${this.state.addResponseRow.item.number}`,
                position: 'top',
                duration: 3000,
                type: 'success',
                style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
            })
        })
            .catch((response) => {
                ApiHelper.handleErrorAlert(response)
            })
        // })
    }

    /* Rendering popup screen */
    renderAddResponse() {
        if (this.state.showAddResponsePopup) {
            return (
                <AddResponse isShowAsModal={true} number={this.state.addResponseRow.item.number} canDismiss={true} dismissPopup={() => this.dismissPopup()} selectionDidChange={(selected) => { this.selectionDidChange('AddResponse', selected); }} />
            )
        } else {
            return null
        }
    }

    /* Rendering no data view */
    renderNoData() {
        if (this.state.loading && ((this.state.pageOpen == 0 && (this.props.activeTicketsTab == `Open ${this.state.tickets}`) && this.state.dataSourceOpen.length == 0) || this.state.pageClose == 0 && ((this.props.activeTicketsTab == `Closed ${this.state.tickets}`) && this.state.dataSourceClose.length == 0))) {
            return (
                <Animatable.View animation={'fadeIn'} style={styles.noDataContainer}>
                    <Label style={styles.noDataTitleStyle}>
                        {`${this.state.tickets} will appear here.`}
                    </Label>
                </Animatable.View>
            )
        } else if (!this.state.loading && (((this.props.activeTicketsTab == `Open ${this.state.tickets}`) && this.state.dataSourceOpen.length == 0) || ((this.props.activeTicketsTab == `Closed ${this.state.tickets}`) && this.state.dataSourceClose.length == 0))) {
            return (
                <Animatable.View animation={'zoomIn'} delay={100} style={[styles.noDataContainer, { flex: 1, justifyContent: 'flex-end' }]}>
                    <Image style={styles.noDataIcon} source={Images.nodata} />
                    <Label style={styles.noDataTitleStyle}>
                        {Messages.NoData}
                    </Label>
                </Animatable.View>
            )
        }
        return (null)
    }

    /* Rendering row */
    renderRow(row) {
        var dec = row.item.initial_post
        dec = dec.replace('\r\n\r\n ', '\n').trim()
        let isShowImgIcon = dec.includes('Following file was uploaded:')
        return (
            <Animatable.View useNativeDriver animation={'fadeInUpBig'} >
                <CardItem button activeOpacity={1} style={styles.reusableRowContainer} onPress={() => {
                    const objData = { ticket: row.item }
                    this.props.mainState.props.navigation.push('TicketDetails', objData);
                }}>
                    <Label style={styles.ticketNumberText}>{`#${row.item.number}`}</Label>
                    <Label style={styles.titleText}>{row.item.subject}</Label>
                    <Label numberOfLines={3} style={styles.ticketDescriptionText}>{row.item.plain_initial_post}</Label>
                    <View style={styles.userContainer}>
                        <View style={styles.userInfoContainer}>
                            <Label style={styles.nameText}>{row.item.user_firstname + ' ' + row.item.user_lastname}</Label>
                            <Label style={styles.possitionText}>{row.item.class_name}</Label>
                        </View>
                        {isShowImgIcon ?
                            <TouchableOpacity style={styles.imageContainer}>
                                <Image style={styles.icon} source={Images.image} />
                            </TouchableOpacity>
                            : null}
                    </View>
                </CardItem>
            </Animatable.View>
        )
    }

    /* What to display on the screen */
    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>

                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={
                        [Colors.mainPrimary,
                        Colors.secondary]}
                    style={styles.tabBarContainer}>

                    <View style={styles.tabBarSubContainer}>
                        <TouchableOpacity activeOpacity={0.7} style={styles.tabButton} onPress={() => {
                            if (!this.state.loading) {

                                this.props.mainState.setState({
                                    activeTicketsTab: `Open ${this.state.tickets}`,
                                })
                                setTimeout(() => {
                                    if (this.props.account && this.state.dataSourceOpen.length == 0) {
                                        this.fetchOpenTicket()
                                    }
                                }, 100)
                            }
                        }}>
                            {this.props.activeTicketsTab == `Open ${this.state.tickets}` ?
                                <Animatable.View style={[styles.backgroundImage, { borderRadius: Metrics.baseMargin, overflow: 'hidden' }]} animation={'pulse'}>
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        colors={
                                            [Colors.mainPrimary,
                                            Colors.secondary]}
                                        style={{ flex: 1 }}
                                    />
                                </Animatable.View>
                                : null}
                            {this.props.activeTicketsTab == `Open ${this.state.tickets}` ?
                                <Animatable.View animation={'pulse'}>
                                    <Label style={styles.tabCount}>{this.props.account && this.props.account.account_statistics && this.props.account.account_statistics.ticket_counts.open ? this.props.account.account_statistics.ticket_counts.open : this.state.dataSourceOpen.length }</Label>
                                </Animatable.View>
                                : null}
                            <Label style={[styles.tabTitle, this.props.activeTicketsTab == `Open ${this.state.tickets}` ? styles.tabSelectedTitle : {}]}>{`Open ${this.state.tickets}`}</Label>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} style={styles.tabButton} onPress={() => {
                            if (!this.state.loading) {
                                this.props.mainState.setState({
                                    activeTicketsTab: `Closed ${this.state.tickets}`,
                                })
                                setTimeout(() => {
                                    if (this.props.account && this.state.dataSourceClose.length == 0) {
                                        this.fetchCloseTickets()
                                    }
                                }, 100)
                            }
                        }}>
                            {this.props.activeTicketsTab == `Closed ${this.state.tickets}` ?
                                <Animatable.View style={[styles.backgroundImage, { borderRadius: Metrics.baseMargin, overflow: 'hidden' }]} animation={'pulse'}>
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        colors={
                                            [Colors.mainPrimary,
                                            Colors.secondary]}
                                        style={{ flex: 1 }}
                                    />
                                </Animatable.View>
                                : null}
                            <Label style={[styles.tabTitle, this.props.activeTicketsTab == `Closed ${this.state.tickets}` ? styles.tabSelectedTitle : {}]}>{`Closed ${this.state.tickets}`}</Label>
                        </TouchableOpacity>
                    </View>

                </LinearGradient>
                <View style={styles.mainContainer}>
                    {this.renderNoData()}
                    {this.renderAddResponse()}
                    <SwipeListView
                        ref={(ref) => { this.flatLisRef = ref }}
                        contentContainerStyle={styles.flatListPadding}
                        disableRightSwipe
                        data={this.props.activeTicketsTab == `Open ${this.state.tickets}` ? this.state.dataSourceOpen : this.state.dataSourceClose}
                        renderItem={(row) => this.renderRow(row)}
                        keyExtractor={(item, index) => index.toString()}
                        renderHiddenItem={(data, rowMap) => (
                            <View style={styles.rowBack}>
                                <Animatable.View animation={'zoomIn'} delay={650} style={styles.backBtnRightContainer}>
                                    <Button transparent style={styles.backRightBtnRight} onPress={() => {
                                        this.flatLisRef.safeCloseOpenRow();
                                        this.setState({ showAddResponsePopup: true, addResponseRow: data })
                                    }}>
                                        <Image style={styles.swipeActionButtonIcon} source={Images.addResponse} />
                                        <Text style={[styles.backTextWhite, { color: Colors.green }]} uppercase={false}>Add Response</Text>
                                    </Button>
                                    {this.props.activeTicketsTab == `Open ${this.state.tickets}` ?
                                        <Button transparent style={styles.backRightBtnRight} onPress={() => {
                                            this.flatLisRef.safeCloseOpenRow();
                                            const objData = { ticket: data.item }
                                            this.props.mainState.props.navigation.push('CloseTicket', objData);
                                        }}>
                                            <Image style={styles.swipeActionButtonIcon} source={Images.closeTicket} />
                                            <Text style={[styles.backTextWhite, { color: Colors.placeholderError }]} uppercase={false}>{`Close ${this.state.ticketTitle}`}</Text>
                                        </Button>
                                        : <Button transparent style={styles.backRightBtnRight} onPress={() => {
                                            this.flatLisRef.safeCloseOpenRow();
                                            this.reopenTicket(data);
                                        }}>
                                            <Image style={styles.swipeActionButtonIcon} source={Images.reopenticket} />
                                            <Text style={[styles.backTextWhite, { color: Colors.green }]} uppercase={false}>{`ReOpen ${this.state.ticketTitle}`}</Text>
                                        </Button>}
                                </Animatable.View>
                            </View>
                        )}
                        leftOpenValue={226}
                        rightOpenValue={-226}
                        previewRowKey={this.state.showSwipwToDeletePreview ? '0' : ''}
                        previewOpenValue={-170}
                        previewOpenDelay={1000}
                        onEndReachedThreshold={0.05}
                        onEndReached={() => this.handleLoadMore()}
                    />
                </View>
                <LoaderBar show={this.state.loading} />
            </SafeAreaView>
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
export default connect(mapStateToProps)(AccountTickets);