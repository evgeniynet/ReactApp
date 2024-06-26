/* Imports */
import React, { Component } from 'react'
import { Image, View, Platform, SafeAreaView } from 'react-native'
import { Label, CardItem, Text, Button, Toast } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import Moment from 'moment';
import { SwipeListView } from 'react-native-swipe-list-view';

import { Images, Colors, Metrics } from '../../../Themes';
import ApiHelper from '../../../Components/ApiHelper';
import LoaderBar from '../../../Components/LoaderBar';
import CommonFunctions from '../../../Components/CommonFunctions';
import { DateFormat, Messages, UserDataKeys } from '../../../Components/Constants';

// Styless
import styles from './Styles/AccountTimesStyles'

class AccountTimes extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            page: 0,
            isLoadingMore: false,
            canLoadMore: true,
            dataSource: [],
            ticketTitle: 'Ticket',
        };
    }

    componentDidMount() {
        setTimeout(() => {
            CommonFunctions.retrieveData(UserDataKeys.Config)
                .then((response) => {
                    let config = JSON.parse(response)
                    var ticketTitle = 'Ticket'
                    if (config.is_customnames) {
                        ticketTitle = config.names.ticket.s ?? 'Ticket'
                    }
                    this.setState({ ticketTitle: ticketTitle })
                    // Call Apis
                })
                
            if (this.props && this.props.account) {
                this.setState({ account: this.props.account })
                setTimeout(() => {
                    this.viewWillAppear()
                    this.props.mainState.subs = [
                        this.props.mainState.props.navigation.addListener('didFocus', this.viewWillAppear)
                    ];
                }, 100)
            } else if (this.props && this.props.ticket) {
                this.setState({ ticket: this.props.ticket })
                setTimeout(() => {
                    this.viewWillAppear()
                    this.props.mainState.subs = [
                        this.props.mainState.props.navigation.addListener('didFocus', this.viewWillAppear)
                    ];
                }, 100)
            }
        }, 100)
    }

    componentWillUnmount() {
        if (this.props && this.props.mainState && this.props.mainState.sub) {
            this.props.mainState.subs.forEach((sub) => {
                sub.remove();
            });
        }
    }

    /* Calling api to refresh data when view will appears */
    viewWillAppear = () => {
        if (!this.state.loading && this.props && this.props.mainState && this.props.mainState.state && this.props.mainState.state.selectedTab && this.props.mainState.state.selectedTab == 'Time') {
            this.setState({
                page: 0,
                isLoadingMore: false,
                canLoadMore: true,
            })
            setTimeout(() => {
                this.fetchData()
            }, 100)
        }
    }

    //Actions

    /* Calling api to load more data */
    handleLoadMore() {
        if (!this.state.loading && !this.state.isLoadingMore && this.state.canLoadMore) {
            this.setState({ page: this.state.page + 1, isLoadingMore: true })
            setTimeout(() => this.fetchData(), 100)
        }
    }

    /* Calling api to fetch time logs */
    fetchData = async () => {
        var authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
        var objData = {}
        if (this.props.account) {
            objData.account = this.props.account.id
        } else if (this.state.ticket) {
            objData.ticket = this.state.ticket.key
        }

        if (this.state.page == 0) {
            objData.limit = 25
        } else {
            objData.limit = 25
            objData.page = this.state.page
        }
        this.onEndReachedCalledDuringMomentum = false
        ApiHelper.getWithParam(ApiHelper.Apis.Time, objData, this, true, authHeader).then((response) => {
            if (this.state.page !== 0 && response) {
                if (response.length == 0) {
                    this.setState({ page: this.state.page - 1, canLoadMore: false })
                } else if (response.length < 25) {
                    this.setState({ canLoadMore: false })
                }
                var arrDataTemp = []
                let arr = []
                if (this.state.ticket) {
                response.forEach(time => {
                    var timeNew = {...time}
                    timeNew.ticket_subject = this.state.ticket.subject
                    timeNew.ticket_number = this.state.ticket.number
                    timeNew.ticket_id = this.state.ticket.id
                    arrDataTemp.push(timeNew)
                });
                arr = [...this.state.dataSource, ...arrDataTemp]
                }
                else
                arr = [...this.state.dataSource, ...response]

                this.setState({ dataSource: arr, isLoadingMore: false })
            } else {
                if (response) {
                    var arrDataTemp = []
                let arr = []
                if (this.state.ticket) {
                response.forEach(time => {
                    var timeNew = {...time}
                    timeNew.ticket_subject = this.state.ticket.subject
                    timeNew.ticket_number = this.state.ticket.number
                    timeNew.ticket_id = this.state.ticket.id
                    arrDataTemp.push(timeNew)
                });
                this.setState({ dataSource: arrDataTemp, canLoadMore: response.length == 25 })
                }
                else
                this.setState({ dataSource: response, canLoadMore: response.length == 25 })
                }
            }
        })
            .catch((response) => {
                this.setState({ isLoadingMore: false })
                ApiHelper.handleErrorAlert(response)
            })
    }

    /* Calling api to delete time log */
    deleteTime(row) {
        let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
        let objData = { is_project_log: row.item.is_project_log }
        ApiHelper.deleteWithParam(ApiHelper.Apis.Time + `/${row.item.time_id}`, objData, this, true, authHeader).then((response) => {
            const arrSource = this.state.dataSource
            arrSource.splice(row.index, 1)
            this.setState({ dataSource: arrSource });
            Toast.show({
                text: `Time log #${row.item.time_id} has been removed.`,
                position: 'top',
                duration: 3000,
                type: 'success',
                style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
            })
        })
            .catch((response) => {
                ApiHelper.handleErrorAlert(response)
            })
    }

    /* Rendering no data view */
    renderNoData() {
        if (this.state.loading && this.state.dataSource.length == 0 && (this.props.account || this.props.ticket)) {
            return (
                <Animatable.View animation={'fadeIn'} style={styles.noDataContainer}>
                    <Label style={styles.noDataTitleStyle}>
                        Times will appear here.
                    </Label>
                </Animatable.View>
            )
        } else if (!this.state.loading && this.state.dataSource.length == 0) {
            return (
                <Animatable.View animation={'zoomIn'} delay={1000} style={[styles.noDataContainer, { flexGrow: 1, justifyContent: 'flex-end' }]}>
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
        return (
            <Animatable.View animation={'fadeInUpBig'}>
                <CardItem activeOpacity={1} button style={styles.reusableRowContainer} onPress={() => {
                    if (row.item && row.item.ticket_id && row.item.ticket_id != null && row.item.ticket_id != 0) {
                        this.props.mainState.props.navigation.push('TicketDetails', { ticket: { key: row.item.ticket_id, number: row.item.ticket_number, subject: row.item.ticket_subject, status: '' } });
                    }
                }}>
                    <View style={styles.workingHoursContainer}>
                        <View style={[styles.hoursContainer, { alignSelf: 'flex-start' }]}>
                            {row.item.hours && row.item.hours > 0 ?
                                <View style={styles.hoursContainer}>
                                    <Image style={styles.icon} source={Images.workingHours} />
                                    <Label style={styles.workingHoursTitleText}>{`${row.item.hours} Hrs`}</Label>
                                </View>
                                : null}
                            {row.item.hours && row.item.hours > 0 && row.item.non_working_hours && row.item.non_working_hours > 0 ?
                                <Label style={[styles.workingHoursTitleText, { marginLeft: 3, marginRight: 3 }]}>|</Label>
                                : null}
                            {row.item.non_working_hours && row.item.non_working_hours > 0 ?
                                <View style={styles.hoursContainer}>
                                    <Image style={styles.icon} source={Images.nonWorkingHours} />
                                    <Label style={styles.workingHoursTitleText}>{`${row.item.non_working_hours} Hrs+`}</Label>
                                </View>
                                : null}
                        </View>
                        <Label style={styles.titleText}>{row.item.user_name || row.item.name}</Label>
                    </View>
                        {(row.item.contract_name && row.item.contract_name != '') || (row.item.task_type && row.item.task_type != '')  || (row.item.task_type_name && row.item.task_type_name != '')?
                            <Label style={styles.contractTitleText}>{(row.item.contract_name && row.item.contract_name != '') ? row.item.contract_name : (row.item.task_type && row.item.task_type != '' ? row.item.task_type : (row.item.task_type_name && row.item.task_type_name != '' ? row.item.task_type_name : ''))}</Label>
                        : null}
                    {row.item.account_name || (this.props.ticket && this.props.ticket.account_name) ?
                        <Label style={styles.accountTitleText}>{row.item.account_name || (this.props.ticket && this.props.ticket.account_name || '')}</Label>
                        : null}
                    {row.item.note && row.item.note != '' ?
                        <Label numberOfLines={10} selectable style={styles.noteText}>{row.item.note.replace(/<br\/>/g, '\n').trim()}</Label>
                        : null}
                    <View style={styles.dateContainer}>
                        <Image style={styles.dateIcon} source={Images.dateIcon} />
                        <Label style={styles.dateText}>{Moment(row.item.date).format(DateFormat.DDMMMYYYY)}</Label>
                    </View>

                    {row.item.ticket_number && row.item.ticket_number != 0 ?
                        <Label style={[styles.titleText, { marginTop: 10 }]}>{this.state.ticketTitle} <Label style={styles.ticketNuberText}>{`#${row.item.ticket_number} ${row.item.ticket_subject}`}</Label></Label>
                        : null}

                </CardItem>
            </Animatable.View>
        )
    }

    /* What to display on the screen */
    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <View style={styles.mainContainer}>
                    {this.renderNoData()}
                    <SwipeListView
                        ref={(ref) => { this.flatLisRef = ref }}
                        contentContainerStyle={styles.flatListPadding}
                        disableRightSwipe
                        data={this.state.dataSource}
                        renderItem={(row) => this.renderRow(row)}
                        keyExtractor={(item, index) => index.toString()}
                        renderHiddenItem={(data, rowMap) => (
                            <View style={styles.rowBack}>
                                <Animatable.View animation={'zoomIn'} delay={650} style={[styles.backBtnRightContainer, { marginTop: Metrics.doubleBaseMargin, bottom: 0 }]}>
                                    <Button transparent style={styles.backRightBtnRight} onPress={() => {
                                        this.flatLisRef.safeCloseOpenRow();
                                        this.props.mainState.props.navigation.push('AddTime', { timelog: data.item });
                                    }}>
                                        <Image style={styles.swipeActionButtonIcon} source={Images.edit} />
                                        <Text style={[styles.backTextWhite, { color: Colors.green }]} uppercase={false}>Edit</Text>
                                    </Button>
                                    <Button transparent style={styles.backRightBtnRight} onPress={() => {
                                        this.flatLisRef.safeCloseOpenRow();
                                        CommonFunctions.presentAlertWithAction(`Do you really want to remove Time log #${data.item.time_id}`, 'Delete').then((isYes) => {
                                            this.deleteTime(data);
                                        })
                                    }}>
                                        <Image style={styles.swipeActionButtonIcon} source={Images.swipeToDelete} />
                                        <Text style={[styles.backTextWhite, { color: Colors.placeholderError }]} uppercase={false}>{'Delete'}</Text>
                                    </Button>
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
                    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 4 }}>
                        <LoaderBar show={this.state.loading} />
                    </View>
                </View>
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
export default connect(mapStateToProps)(AccountTimes);