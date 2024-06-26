/* Imports */
import React, { Component } from 'react'
import { Image, View, TouchableOpacity, Platform, StatusBar, SafeAreaView, FlatList, Keyboard } from 'react-native'
import { Container, Input, Label, CardItem } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { FloatingAction } from 'react-native-floating-action';

import CommonFunctions from '../../../Components/CommonFunctions';
import { UserDataKeys, Messages } from '../../../Components/Constants';
import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Images, Colors } from '../../../Themes';
import LinearGradient from 'react-native-linear-gradient';
import ApiHelper from '../../../Components/ApiHelper';
import LoaderBar from '../../../Components/LoaderBar';

// Styless
import styles from './Styles/AccountsStyles'

class Accounts extends Component {

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
      showAnimationIndex: -1,
      flotingMenuDataSource: [],
      title: '',
      tickets: 'Tickets',
      config: {},
      page: 0,
      isLoadingMore: false,
      canLoadMore: true,
    };
  }

  componentDidMount() {
    this.setState({
      loading: false,
      searchString: '',
      dataSource: [],
      dataSourceMain: [],
      isShowSearch: false,
      flotingMenuDataSource: [],
      title: '',
      tickets: 'Tickets',
      config: {},
      page: 0,
      isLoadingMore: false,
      canLoadMore: true,
    });

    CommonFunctions.retrieveData(UserDataKeys.Config)
      .then((response) => {
        let config = JSON.parse(response)
        let arrOptions = CommonFunctions.floatingMenus(config, config.user)
        this.setState({ flotingMenuDataSource: arrOptions })

        var name = 'Accounts'
        var tickets = 'Tickets'
        if (config.is_customnames) {
          name = config.names.account.p ?? 'Accounts'
          tickets = config.names.ticket.p ?? 'Tickets'
        }
        this.setState({ title: name, tickets: tickets, config: config })
        // Call Apis
      }).catch(() => {
        this.setState({ title: 'Accounts' })
      })

    setTimeout(() => {
      this.setState({
        dataSource: this.state.dataSourceMain
      })
    }, 100)
    this.viewWillAppear()
    this.props.navigation.addListener('didFocus', this.viewWillAppear)
  }

  /* Calling api to fetch accounts when view will appears */
  viewWillAppear = () => {
      this.setState({
        page: 0,
        isLoadingMore: false,
        canLoadMore: true,
    })
    setTimeout(() => {
        this.fetchData()
    }, 100)
  }
  

  componentWillUnmount() {
    Keyboard.dismiss();
  }

  //Actions

  /* Calling api to fetch accounts */ 
  fetchData(isSearch=false) {
    let pageSize = 50
    let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
    var objData = { is_with_statistics: false, is_open_tickets: true }
    if (this.state.page == 0) {
      objData.limit = pageSize
    } else {
        objData.limit = pageSize
        objData.page = this.state.page
    }
    if (isSearch) {
      objData.search = this.state.searchString.trim()+'*'
      objData.sort_by = 'name'
      objData.sort_order = 'asc'
    }
    objData.is_active = true
    ApiHelper.getWithParam(ApiHelper.Apis.Accounts, objData, this, true, authHeader).then((response) => {
      if (this.state.page !== 0 && response) {
        if (response.length == 0) {
            this.setState({ page: this.state.page - 1, canLoadMore: false })
        } else if (response.length < pageSize) {
            this.setState({ canLoadMore: false })
        }
        let arr = [...this.state.dataSource, ...response]
        var arrDataTemp = []
        arr.forEach(account => {
          var accountNew = { ...account }
          this.state.dataSourceMain.forEach(accountMain => {
            if (accountMain.id == accountNew.id) {
              accountNew.isExpanded = accountMain.isExpanded
            }
          });
          arrDataTemp.push(accountNew)
        });
        this.setState({ dataSourceMain: arrDataTemp, dataSource: arrDataTemp, isLoadingMore: false })
    } else {
        if (response) {
          var arrDataTemp = []
          response.forEach(account => {
          var accountNew = { ...account }
          this.state.dataSourceMain.forEach(accountMain => {
            if (accountMain.id == accountNew.id) {
              accountNew.isExpanded = accountMain.isExpanded
            }
          });
          arrDataTemp.push(accountNew)
        });
            this.setState({ dataSourceMain: arrDataTemp, dataSource: arrDataTemp, canLoadMore: response.length == pageSize })
        }
    }
    })
      .catch((response) => {
        this.setState({ isLoadingMore: false })
        ApiHelper.handleErrorAlert(response)
      })
  }

  /* Calling api to load more data */
  handleLoadMore() {
    if (!this.state.loading && !this.state.isLoadingMore && this.state.canLoadMore) {
        this.setState({ page: this.state.page + 1, isLoadingMore: true })
        setTimeout(() => this.fetchData(this.state.searchString.trim().length > 0), 100)
    }
  }
  /* Filtering accounts based on searched text */
  searchNow() {
    if (this.state.searchString.trim() !== '') {
      if (this.state.searchString.trim().length < 3) {
        const arrSearchResult = this.state.dataSourceMain.filter((obj) => {
          return obj.name.toLowerCase().startsWith(this.state.searchString.toLowerCase()) //obj.startsWith(value)
        })
        this.setState({ dataSource: arrSearchResult })
      } else {
        this.setState({
          page: 0,
          isLoadingMore: false,
          canLoadMore: true,
        })
        setTimeout(() => {
            this.fetchData(true)
        }, 100)
      }
    } else {
      // this.setState({ dataSource: this.state.dataSourceMain })
      this.viewWillAppear()
    }
  }

  debounce = (callback, delay) => { 
    let timeout = -1;
    return (...args) => {
      if (timeout !== -1) { clearTimeout(timeout); }
      timeout = setTimeout(() => callback(...args), delay);
    };
  }
  debouncedLog = this.debounce( e => { this.searchNow() }, 1000)
  handleSearchChange = e => {
    this.setState({ searchString: e })
    this.debouncedLog(e);
  }


  /* Rendering no data view */
  renderNoData() {
    if (this.state.loading && this.state.dataSource.length == 0) {
      return (
        <Animatable.View animation={'fadeIn'} style={styles.noDataContainer}>
          <Label style={styles.noDataTitleStyle}>
            {`${this.state.title} will appear here.`}
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

  /* Rendering row */
  renderRow(row) {
    return (
      <Animatable.View useNativeDriver={true} animation={this.state.searchString.trim().length == 0 ? 'fadeInUpBig' : 'pulse'}>
        <CardItem
          activeOpacity={0.7}
          style={styles.reusableRowContainer}
          button onPress={() => {
            let arrData = this.state.dataSource
            let arrDataMain = this.state.dataSourceMain

            arrData[row.index].isExpanded = row.item.isExpanded ? false : true
            arrData[row.index].isShowDot = false
            for (let index = 0; index < arrDataMain.length; index++) {
              const element = arrDataMain[index];
              if (element.id == row.item.id) {
                arrDataMain[index].isExpanded = arrData[row.index].isExpanded
                arrDataMain[index].isShowDot = false
                break
              }
            }

            this.setState({ dataSource: arrData, dataSourceMain: arrDataMain, showAnimationIndex: row.index })
          }}>
          {row.item.isShowDot ? <View style={styles.unreadDot} /> : null}
          <View>
            <View style={styles.topContainer}>
              <Label style={styles.titleText}>{row.item.name}</Label>
              <Animatable.Image
                // delay={300}
                useNativeDriver
                onAnimationEnd={() => this.setState({ showAnimationIndex: -1 })}
                animation={this.state.showAnimationIndex === row.index ? 'zoomIn' : null}
                style={styles.arrowIcon}
                source={row.item.isExpanded ? Images.uparrow : Images.downarrow}
              />
            </View>
            {row.item.isExpanded ?
              <TouchableOpacity activeOpacity={0.7} onPress={() => {
                let data = { account: row.item }
                this.props.navigation.push('AccountDetails', data);
              }}>
                <View style={styles.separator} />
                <Animatable.View useNativeDriver animation={'pulse'}>
                  <View style={styles.ticketsCounterMainContainer}>
                    <View style={styles.ticketsCounter}>
                      <Image style={styles.ticktIcon} source={Images.tickets} />
                      <Label style={styles.ticketText}>{`Open ${this.state.tickets}`}</Label>
                      <Label style={styles.ticketCountText}>{row.item.account_statistics.ticket_counts.open}</Label>
                    </View>
                    {this.state.config && this.state.config.is_time_tracking ?
                      <View style={styles.ticketsCounter}>
                        <Image style={styles.ticktIcon} source={Images.smTimelogs} />
                        <Label style={styles.ticketText}>Timelogs</Label>
                        <Label style={styles.ticketCountText}>{row.item.account_statistics.timelogs}</Label>
                      </View>
                      : this.state.config && this.state.config.is_expenses ?
                        <View style={styles.ticketsCounter}>
                          <Image style={styles.ticktIcon} source={Images.acExpenses} />
                          <Label style={styles.ticketText}>Expenses</Label>
                          <Label style={styles.ticketCountText}>{row.item.account_statistics.ticket_counts.expense_cost}</Label>
                        </View>
                        : null}
                    <View style={styles.ticketsCounter}>
                    {/* <Image style={styles.ticktIcon} source={Images.todos} />
                      <Label style={styles.ticketText}>Open ToDos</Label>
                      <Label style={styles.ticketCountText}>{row.item.account_statistics.scheduled}</Label> */}
                      <Image style={styles.ticktIcon} source={Images.acContracts} />
                      <Label style={styles.ticketText}>Contracts</Label>
                      <Label style={styles.ticketCountText}>{row.item.account_statistics.contracts}</Label>
                    </View>
                  </View>
                </Animatable.View>
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
            showTitle={this.state.title}
            rightImage={this.state.isShowSearch ? Images.close : Images.searchInNav}
            hideRightButton={false}
            rightButton={() => {
              if (this.state.searchString.trim() != "") {
                this.setState({
                  searchString: "",
                  // dataSource: this.state.dataSourceMain
                })
                this.viewWillAppear()
              } else {
                this.setState({
                  isShowSearch: !(this.state.isShowSearch),
                })
                setTimeout(() => this.state.isShowSearch && this.searchRef._root.focus(), 600)
              }
            }}
          />
        </SafeAreaView>
        <LoaderBar show={this.state.loading} />
        {this.state.isShowSearch ? <Animatable.View animation={'fadeIn'} style={styles.searchContainer}>
          <Input
            style={styles.searchInput}
            placeholder={`Search by ${this.state.title.toLowerCase()} name (min 3 letters)`}
            placeholderTextColor={Colors.placeholder}
            value={this.state.searchString}
            onChangeText={this.handleSearchChange}
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
              <FlatList
                ref={(ref) => { this.flatLisRef = ref; }}
                contentContainerStyle={styles.flatListPadding}
                data={this.state.dataSource}
                renderItem={(row) => this.renderRow(row)}
                keyExtractor={(item, index) => index.toString()}
                keyboardShouldPersistTaps='handled'
                onEndReachedThreshold={0.05}
                onEndReached={() => this.handleLoadMore()}
              />
            </View>
          </SafeAreaView>
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 25 }}>
            <LoaderBar show={this.state.loading} showActivityIndicator />
          </View>
        </View>
        <FloatingAction
          ref={(ref) => { this.floatingAction = ref; }}
          actions={this.state.flotingMenuDataSource}
          color={Colors.green}
          overlayColor={Colors.snow95}
          iconWidth={20}
          iconHeight={20}
          buttonSize={48}
          iconColor={Colors.snow}
          shadow={{
            shadowColor: Colors.clear,
          }}
          onPressItem={name => {
            console.log(`selected button: ${name}`);
            switch (name) {
              case 'bt_AddTicket':
                this.props.navigation.push('AddEditTicket');
                break;
              case 'bt_AddEvent':
                this.props.navigation.push('AddEditEvent');
                break;
              case 'bt_AddTime':
                this.props.navigation.push('AddTime');
                break;
              case 'bt_CreateInvoice':
                break;
              case 'bt_AddToDo':
                this.props.navigation.push('AddEditToDo');
                break;
              case 'bt_AddExpense':
                this.props.navigation.push('AddEditExpense');
                break;
              default:
                break;
            }
          }}
        />
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
export default connect(mapStateToProps)(Accounts);