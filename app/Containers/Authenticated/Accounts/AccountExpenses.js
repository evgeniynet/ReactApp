/* Imports */
import React, { Component } from 'react'
import { Image, View, } from 'react-native'
import { Label, CardItem, Button, Text, Toast } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';

import { DateFormat, Messages, UserDataKeys } from '../../../Components/Constants';
import { Images, Colors, Metrics } from '../../../Themes';
import ApiHelper from '../../../Components/ApiHelper';
import LoaderBar from '../../../Components/LoaderBar';
import CommonFunctions from '../../../Components/CommonFunctions';

// Styless
import styles from './Styles/AccountExpensesStyles'

class AccountExpenses extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            dataSource: [],
            ticketTitle: 'Ticket',
        };
    }

    componentDidMount() {
        CommonFunctions.retrieveData(UserDataKeys.Config)
        .then((response) => {
            let config = JSON.parse(response)
            var ticketTitle = 'Ticket'
            if (config.is_customnames) {
                ticketTitle = config.names.ticket.s ?? 'Ticket'
            }
            this.setState({ ticketTitle })
        })
        .catch((err) => {
            console.log('Error====================================', err);
        })

    // setTimeout(() => {
    if (this.props.account) {
        this.setState({ account: this.props.account })
        setTimeout(() => {
            this.fetchExpenses()
            this.props.mainState.subs = [
                this.props.mainState.props.navigation.addListener('didFocus', this.viewWillAppear)
            ]
        }, 100)
    } else if (this.props.ticket) {
        this.setState({ ticket: this.props.ticket })
        setTimeout(() => {
            this.fetchExpenses()
            this.props.mainState.subs = [
                this.props.mainState.props.navigation.addListener('didFocus', this.viewWillAppear)
            ]
        }, 100)
    }
    // }, 100)
    }

    /* Calling api to fetch expenses when view will appears */
    viewWillAppear = () => {
        if (!this.state.loading && this.props.mainState && (this.props.mainState.state.selectedTab == 'Expenses' || this.props.mainState.state.selectedTab == 'Expenses')) {
            this.fetchExpenses()
        }
    }

    componentWillUnmount() {
        if (this.props.mainState && this.props.mainState.sub) {
            this.props.mainState.subs.forEach((sub) => {
                sub.remove();
            });
        }
    }

    //Class Methods

    /* Calling api to fetch expenses */
    fetchExpenses = async () => {
        let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
        var objData = {}
        if (this.props.account) {
            objData.account = this.props.account.id
            objData.limit = 100
        } else if (this.props.ticket) {
            objData.ticket = this.props.ticket.key
            objData.limit = 100
        }
        ApiHelper.getWithParam(ApiHelper.Apis.Products, objData, this, true, authHeader).then((response) => {
            /*if (this.props.ticket) {
                var arrTemp = []
                response.forEach(element => {
                    if (element && element.ticket_id && element.ticket_id != null && element.ticket_id != 0 && element.ticket_id == this.props.ticket.id) {
                        arrTemp.push(element)
                    }
                  });
                this.setState({ dataSource: arrTemp })

            } else {
                this.setState({ dataSource: response })
            }*/
            this.setState({ dataSource: response })
        })
            .catch((response) => {
                ApiHelper.handleErrorAlert(response)
            })
    }

    /* Calling api to delete expense */
    deleteExpense(row) {
        let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
        let objData = {}
        ApiHelper.deleteWithParam(ApiHelper.Apis.Products + `/${row.item.expense_id}`, objData, this, true, authHeader).then((response) => {
            const arrSource = this.state.dataSource
            arrSource.splice(row.index, 1)
            this.setState({ dataSource: arrSource });
            Toast.show({
                text: `Product has been removed.`,
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
                        Expenses will appear here.
                    </Label>
                </Animatable.View>
            )
        } else if (!this.state.loading && this.state.dataSource.length == 0) {
            return (
                <Animatable.View animation={'zoomIn'} delay={100} style={[styles.noDataContainer, { flexGrow: 1, justifyContent: 'flex-end' }]}>
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
        let units = (row.item.units && row.item.units != '' ? row.item.units : 0)
        let cost = (row.item.amount && row.item.amount != '' ? row.item.amount : 0)
        let markup = (row.item.markup_value && row.item.markup_value != '' ? row.item.markup_value : 0)
        var totolAmount = ((markup * units) + (cost * units)).toFixed(2)

        return (
            <Animatable.View useNativeDriver={true} animation={'fadeInUpBig'} >
                <CardItem button activeOpacity={1} style={styles.reusableRowContainer} onPress={() => {
                    // if (row.item && row.item.ticket_id && row.item.ticket_id != null && row.item.ticket_id != 0) {
                    //     this.props.mainState.props.navigation.push('TicketDetails', { ticket: { key: row.item.ticket_id, number: row.item.ticket_number, subject: row.item.ticket_subject, status: '' } });
                    // }
                }}>
                    <View style={styles.nameAndPriceContainer}>
                        <View style={{ flex: 1 }}>
                            {row.item.category ?
                                <Label style={styles.categoryText}>{row.item.category}</Label>
                                : null}
                            {row.item.account_name ?
                                <Label style={styles.nameText}>{row.item.account_name}</Label>
                                : null}
                        </View>
                        <Label style={styles.priceText}>{`$${totolAmount}`}</Label>
                    </View>
                    {/* {row.item.category ?
                        <Label style={styles.categoryText}>{row.item.category}</Label>
                        : <View style={{ paddingBottom: Metrics.smallMargin }} />} */}
                    {row.item.note ? <Label style={styles.descriptionText}>{row.item.note}</Label> : null}
                    {row.item.ticket_subject ?
                        <Label style={[styles.ticketText, { marginTop: 0 }]}><Label style={[styles.titleText, { marginTop: 0 }]}>{`${this.state.ticketTitle} `}</Label>{`#${row.item.ticket_number} ${row.item.ticket_subject}`}</Label>
                        : null}
                    <View style={styles.gridCenterContainer}>
                        <View style={styles.itemCenterContainer}>
                            <Label style={styles.valueText}>{row.item.units}</Label>
                            <Label style={styles.titleText}>Units</Label>
                        </View>

                        <View style={styles.itemCenterContainer}>
                            <Label style={styles.valueText}>{`$${row.item.amount}`}</Label>
                            <Label style={styles.titleText}>Cost</Label>
                        </View>
                        <View style={styles.itemCenterContainer}>
                            <Label style={styles.valueText}>{row.item.billable ? 'Yes' : 'No'}</Label>
                            <Label style={styles.titleText}>Billable</Label>
                        </View>
                    </View>
                    {/* <View style={styles.gridContainer}>
                        {row.item.vendor ?
                            <View style={styles.itemContainer}>
                                <Label style={styles.valueText}>{row.item.vendor}</Label>
                                <Label style={styles.titleText}>Vendor</Label>
                            </View>
                            : null}
                        <View style={styles.itemContainer}>
                            <Label style={styles.valueText}>{row.item.is_technician_payment ? 'Yes' : 'No'}</Label>
                            <Label style={styles.titleText}>Technical Payment</Label>
                        </View>
                    </View> */}
                    <View style={styles.dateContainer}>
                        <Label style={styles.dateText}>{CommonFunctions.utcToLocalTimeZone(row.item.date, DateFormat.DDMMMYYYY)}</Label>
                        <Label style={styles.dateText}>{CommonFunctions.utcToLocalTimeZone(row.item.date, DateFormat.HMMA)}</Label>
                    </View>
                </CardItem>
            </Animatable.View>
        )
    }

    /* What to display on the screen */
    render() {
        return (
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
                            <Animatable.View animation={'zoomIn'} delay={650} style={[styles.backBtnRightContainer]}>
                                <Button transparent style={styles.backRightBtnRight} onPress={() => {
                                    this.flatLisRef.safeCloseOpenRow();
                                    this.props.mainState.props.navigation.push('AddEditExpense', { expense: data.item });
                                }}>
                                    <Image style={styles.swipeActionButtonIcon} source={Images.edit} />
                                    <Text style={[styles.backTextWhite, { color: Colors.green }]} uppercase={false}>Edit</Text>
                                </Button>
                                <Button transparent style={styles.backRightBtnRight} onPress={() => {
                                    this.flatLisRef.safeCloseOpenRow() //.safeCloseOpenRow();
                                    CommonFunctions.presentAlertWithAction(`Do you really want to remove expense`, 'Delete').then((isYes) => {
                                        this.deleteExpense(data);
                                    })
                                }}>
                                    <Image style={styles.swipeActionButtonIcon} source={Images.swipeToDelete} />
                                    <Text style={[styles.backTextWhite, { color: Colors.placeholderError }]} uppercase={false}>Delete</Text>
                                </Button>
                            </Animatable.View>
                        </View>
                    )}
                    leftOpenValue={226}
                    rightOpenValue={-226}
                    previewRowKey={this.state.showSwipwToDeletePreview ? '0' : ''}
                    previewOpenValue={-170}
                    previewOpenDelay={1000}
                />
                <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 4 }}>
                    <LoaderBar show={this.state.loading} />
                </View>
            </View>
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
export default connect(mapStateToProps)(AccountExpenses);