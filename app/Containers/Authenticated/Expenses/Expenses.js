/* Imports */
import React, { Component } from 'react'
import { Image, View, TouchableOpacity, Platform, StatusBar, SafeAreaView, Keyboard } from 'react-native'
import { Container, Input, Label, CardItem, Button, Text, Toast } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';

import { Messages, DateFormat, UserDataKeys } from '../../../Components/Constants';
import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Images, Colors, Metrics } from '../../../Themes';
import LinearGradient from 'react-native-linear-gradient';
import ApiHelper from '../../../Components/ApiHelper';
import LoaderBar from '../../../Components/LoaderBar';
import CommonFunctions from '../../../Components/CommonFunctions';

// Styless
import styles from './Styles/ExpensesStyles'

class Expenses extends Component {

  // Life cycle of class
  /* Initiating state before the component mount. */
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      searchString: '',
      dataSource: [],
      isShowSearch: false,
      dataSourceMain: [],
      page: 0,
      isLoadingMore: false,
      canLoadMore: true,
      flotingMenuDataSource: [],
      ticketTitle: 'Ticket',
    };
  }

  componentDidMount() {
    this.setState({
      loading: true,
      searchString: '',
      dataSource: [],
      dataSourceMain: [],
      isShowSearch: false,
      page: 0,
      isLoadingMore: false,
      canLoadMore: true,
      flotingMenuDataSource: [],
      ticketTitle: 'Ticket',
    });

    CommonFunctions.retrieveData(UserDataKeys.Config)
      .then((response) => {
        let config = JSON.parse(response)
        let arrOptions = CommonFunctions.floatingMenus(config, config.user)
        var ticketTitle = 'Ticket'
        if (config.is_customnames) {
          ticketTitle = config.names.ticket.s ?? 'Ticket'
        }
        this.setState({ ticketTitle, flotingMenuDataSource: arrOptions })
      })
      .catch((err) => {
        console.log('Error====================================', err);
      })

    setTimeout(() => {
      this.setState({
        dataSource: this.state.dataSourceMain
      })
    }, 100)

    CommonFunctions.retrieveData(UserDataKeys.ExpensesSwipeToDelete)
      .then((result) => {
        if (result === null || result !== '1') {
          this.setState({ showSwipwToDeletePreview: true })
          setTimeout(() => CommonFunctions.storeData(UserDataKeys.ExpensesSwipeToDelete, '1'), 3000)
        }
      })

    this.viewWillAppear()
    this.props.navigation.addListener('didFocus', this.viewWillAppear)
  }

  /* Calling api to fetch expenses when view will appears */
  viewWillAppear = () => {

    if (this.props.navigation.state.params !== undefined) {
      if (this.props.navigation.state.params.selected !== undefined) {
        if (this.props.navigation.state.params.selected.account !== undefined) {
          this.setState({ account: this.props.navigation.state.params.selected.account })
        }
        if (this.props.navigation.state.params.selected.tech !== undefined) {
          this.setState({ selectedTech: this.props.navigation.state.params.selected.tech })
        }
        if (this.props.navigation.state.params.selected.type !== undefined) {
          this.setState({ selectedType: this.props.navigation.state.params.selected.type })
        }
        if (this.props.navigation.state.params.selected.project !== undefined) {
          this.setState({ selectedProject: this.props.navigation.state.params.selected.project })
        }
      }
    }
    setTimeout(() => {
      let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
      var objData = {}

      if (this.state.account && this.state.account.id != undefined) {
        objData.account = this.state.account ? this.state.account.id : 0
      }
      if (this.state.selectedTech && this.state.selectedTech.id != undefined) {
        objData.tech = this.state.selectedTech ? this.state.selectedTech.id : 0
      }

      objData.type = 'recent';

      if (this.state.selectedType && this.state.selectedType.api_value != undefined && this.state.selectedType.api_value != '') {
        objData.type = this.state.selectedType ? this.state.selectedType.api_value : 0
      }

      if (this.state.selectedProject && this.state.selectedProject.id != undefined) {
        objData.project = this.state.selectedProject ? this.state.selectedProject.id : 0
      }

      ApiHelper.getWithParam(ApiHelper.Apis.Products, objData, this, true, authHeader).then((response) => {
        this.setState({ dataSourceMain: response, dataSource: response })
      })
        .catch((response) => {
          ApiHelper.handleErrorAlert(response)
        })
    }, 100);

  }

  componentWillUnmount() {
    Keyboard.dismiss();
  }

  //Actions

  /* Filtering expense based on searched text */
  searchNow() {
    if (this.state.searchString.trim() !== '') {
      const arrSearchResult = this.state.dataSourceMain.filter((obj) => {
        let strSearch = this.state.searchString.toLocaleLowerCase()
        return obj.ticket_subject.toLocaleLowerCase().includes(strSearch) || obj.account_name.toLocaleLowerCase().includes(strSearch) //obj.startsWith(value)
      })
      this.setState({ dataSource: arrSearchResult })
    } else {
      this.setState({ dataSource: this.state.dataSourceMain })
    }
  }

  //Class Methods

  /* Calling api to delete expense */
  deleteExpense(row) {
    let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
    let objData = {}
    ApiHelper.deleteWithParam(ApiHelper.Apis.Products + `/${row.item.expense_id}`, objData, this, true, authHeader).then((response) => {
      const arrSource = this.state.dataSource
      arrSource.splice(row.index, 1)
      this.setState({ dataSource: arrSource });
      Toast.show({
        text: `Expense has been removed.`,
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

  /* Rendering row */
  renderRow(row) {
    let units = (row.item.units && row.item.units != '' ? row.item.units : 0)
    let cost = (row.item.amount && row.item.amount != '' ? row.item.amount : 0)
    let markup = (row.item.markup_value && row.item.markup_value != '' ? row.item.markup_value : 0)
    var totolAmount = ((markup * units) + (cost * units)).toFixed(2)

    return (
      <Animatable.View useNativeDriver={true} animation={this.state.searchString.trim().length == 0 ? 'fadeInUpBig' : 'pulse'} >
        <CardItem button activeOpacity={1} style={styles.reusableRowContainer} onPress={() => {
          if (row.item && row.item.ticket_id && row.item.ticket_id != null && row.item.ticket_id != 0) {
            this.props.navigation.push('TicketDetails', { ticket: { key: row.item.ticket_id, number: row.item.ticket_number, subject: row.item.ticket_subject, status: '' } });
          }
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

  /* Rendering no data view */
  renderNoData() {
    if (this.state.loading && this.state.dataSource.length == 0) {
      return (
        <Animatable.View animation={'fadeIn'} style={styles.noDataContainer}>
          <Label style={styles.noDataTitleStyle}>
            Expenses will appear here.
          </Label>
        </Animatable.View>
      )
    } else if (!this.state.loading && this.state.searchString.trim() !== '' && this.state.dataSource.length == 0) {
      return (
        <Animatable.View animation={'zoomIn'} style={styles.noDataContainer}>
          <Image style={styles.noDataIcon} source={Images.nosearch} />
          <Label style={styles.noDataTitleStyle}>
            {Messages.NoResultFound}
          </Label>
        </Animatable.View>
      )
    } else if (!this.state.loading && this.state.searchString.trim() == '' && this.state.dataSource.length == 0 && this.state.dataSourceMain.length == 0) {
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

  /* What to display on the screen */
  render() {
    return (
      <Container>
        {StatusBar.setBarStyle('light-content', true)}
        {Platform.OS === 'ios' ? null : StatusBar.setBackgroundColor(Colors.mainPrimary)}
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
            showTitle='Expenses'
            rightImage={Images.filter}
            hideRightButton={false}
            rightButton={() => {
              this.props.navigation.push('FilterExpenses', { selected: { 
                                                                          account: this.state.account, 
                                                                          tech: this.state.selectedTech,
                                                                          project: this.state.selectedProject,
                                                                          type: this.state.selectedType, 
                                                                        } });
            }}
          // rightImage={this.state.isShowSearch ? Images.close : Images.searchInNav}
          // hideRightButton={false}
          // rightButton={() => {
          //   if (this.state.searchString.trim() != "") {
          //     this.setState({
          //       searchString: "",
          //       dataSource: this.state.dataSourceMain
          //     })
          //   } else {
          //     this.setState({
          //       isShowSearch: !(this.state.isShowSearch),
          //     })
          //     setTimeout(() => this.state.isShowSearch && this.searchRef._root.focus(), 600)
          //   }
          // }}
          />
        </SafeAreaView>
        <LoaderBar show={this.state.loading} />
        {this.state.isShowSearch ? <Animatable.View animation={'fadeIn'} style={styles.searchContainer}>
          <Input
            style={styles.searchInput}
            placeholder={'Search expenses'}
            placeholderTextColor={Colors.placeholder}
            value={this.state.searchString}
            onChangeText={value => {
              this.setState({
                searchString: value
              })
              setTimeout(() => {
                this.searchNow()
              }, 100)
            }}
            autoCapitalize='sentences'
            autoCorrect={false}
            returnKeyType={'search'}
            onSubmitEditing={() => {
              this.searchNow()
            }}
            selectionColor={Colors.snow}
            blurOnSubmit={false}
            keyboardAppearance='dark'
            ref={input => {
              this.searchRef = input;
            }}
          />
          <TouchableOpacity style={styles.searchRightIcon} onPress={() => {
            this.searchNow()
          }}>
            <Image style={styles.clearText} source={Images.searchInNav} />
          </TouchableOpacity>
        </Animatable.View> : null}
        <View style={styles.contentContainer}>
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
                    <Animatable.View animation={'zoomIn'} delay={650} style={[styles.backBtnRightContainer]}>
                      <Button transparent style={styles.backRightBtnRight} onPress={() => {
                        this.flatLisRef.safeCloseOpenRow();
                        this.props.navigation.push('AddEditExpense', { expense: data.item });
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
              // onEndReachedThreshold={0.05}
              // onEndReached={() => this.handleLoadMore()}
              />
            </View>
            <TouchableOpacity activeOpacity={0.7} style={styles.floatingContainer} onPress={() => {
              this.props.navigation.push('AddEditExpense');
            }}>
              <Image style={styles.loginButtonText} source={Images.floatinOption} />
            </TouchableOpacity>
          </SafeAreaView>
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
  return { authToken, org, user }
};

/* Connecting to redux store and exporting class */
export default connect(mapStateToProps)(Expenses);