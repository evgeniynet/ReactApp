/* Imports */
import React, { Component } from 'react'
import { Image, View, TouchableOpacity, Platform, StatusBar, SafeAreaView, FlatList, Keyboard } from 'react-native'
import { Container, Input, Label, CardItem, Button, Text, Toast } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import Moment from 'moment';
import { SwipeListView } from 'react-native-swipe-list-view';
import { BarCodeScanner } from 'expo-barcode-scanner'

import CommonFunctions from '../../../Components/CommonFunctions';
import { UserDataKeys, Messages, DateFormat } from '../../../Components/Constants';
import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Images, Colors, Metrics } from '../../../Themes';
import LinearGradient from 'react-native-linear-gradient';
import ApiHelper from '../../../Components/ApiHelper';
import LoaderBar from '../../../Components/LoaderBar';

// Styless
import styles from './Styles/AssetsStyles'

class SearchAssets extends Component {

  // Life cycle of class
  /* Initiating state before the component mount. */
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      searchString: '',
      dataSource: [],
      account: null,
      isShowSearch: true,
      dataSourceMain: [],
      showAnimationIndex: -1,
      flotingMenuDataSource: [],
      title: '',
      tickets: 'Tickets',
      config: {},
      screen: 'AddEditAsset',
      page: 0,
      isLoadingMore: false,
      canLoadMore: true,
      hasCameraPermission: null,
      isReaderOpen: false,
    };
  }

  componentDidMount() {
    this.setState({
      loading: false,
      searchString: '',
      dataSource: [],
      dataSourceMain: [],
      isShowSearch: true,
      account: null,
      flotingMenuDataSource: [],
      title: '',
      tickets: 'Tickets',
      config: {},
      screen: 'AddEditAsset',
      page: 0,
      isLoadingMore: false,
      canLoadMore: true,
    });

    CommonFunctions.retrieveData(UserDataKeys.Config)
      .then((response) => {
        let config = JSON.parse(response)
        let arrOptions = CommonFunctions.floatingMenus(config, config.user)
        this.setState({ flotingMenuDataSource: arrOptions })

        var name = 'Assets'
        var tickets = 'Tickets'
        if (config.is_customnames) {
          tickets = config.names.ticket.p ?? 'Tickets'
        }
        this.setState({ title: name, tickets: tickets, config: config })
        // Call Apis
      }).catch(() => {
        this.setState({ title: 'Assets' })
      })

    setTimeout(() => {
      this.setState({
        dataSource: this.state.dataSourceMain
      })
    }, 100)
    
    if (this.props.navigation.state.params !== undefined) {
      if (this.props.navigation.state.params.screen !== undefined) {
        this.setState({ screen: this.props.navigation.state.params.screen })
      }
      if (this.props.navigation.state.params.account !== undefined) {
        this.setState({ account: this.props.navigation.state.params.account })
      }
    }

    this.fetchData()
  }

    /* Calling function for fetch data from page 0 */
    fetchData = () => {
      if (!this.state.loading) {
        this.setState({
          page: 0,
          isLoadingMore: false,
          canLoadMore: true,
        })
        setTimeout(() => {
          this.fetchAssets()
        }, 100)
      }
    }
  
    _requestCameraPermission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      this.setState({
        hasCameraPermission: status === 'granted',
      });
    };
  
    _handleBarCodeRead = ({ type, data }) => {
      this.setState({
        isReaderOpen: false,
      });
  
     this.setState({ searchString: data })
     this.searchNow()
    }; 
  
    openBarCode = () => {
      this.setState({
        isReaderOpen: !this.state.isReaderOpen,
      });
      this._requestCameraPermission();
    }

  componentWillUnmount() {
    Keyboard.dismiss();
  }

  //Actions
  /* Filtering assets based on searched text */
  searchNow() {
    if (this.state.searchString.trim() !== '') {
        this.setState({
          page: 0,
          isLoadingMore: false,
          canLoadMore: true,
        })
        setTimeout(() => {
            this.fetchAssets(true)
        }, 100)
    } else {
      // this.setState({ dataSource: this.state.dataSourceMain })
      this.fetchData()
    }
  }

    /* Calling api to load more data */
    handleLoadMore() {
      if (!this.state.loading && !this.state.isLoadingMore && this.state.canLoadMore) {
          this.setState({ page: this.state.page + 1, isLoadingMore: true })
          setTimeout(() => this.fetchAssets(this.state.searchString.trim().length > 0), 100)
      }
    }

      /* Calling api to fetch assets */ 
  fetchAssets(isSearch=false) {
    let url = ApiHelper.Apis.Assets
    let pageSize = 25
    let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
    var objData = { }
    if (this.state.page == 0) {
      objData.limit = pageSize
    } else {
        objData.limit = pageSize
        objData.page = this.state.page
    }
    if (isSearch) {
      url = ApiHelper.Apis.AssetsSearch
      objData.text = this.state.searchString.trim()//+'*'
      objData.sort_by = 'name'
      objData.sort_order = 'asc'
    }

    if (this.state.config && this.state.config.is_account_manager)
    {
    //objData.accountId= -1;
    if (this.state.account && this.state.account.id != null && this.state.account.id != undefined) {
      objData.account_id = this.state.account.id < 1 ? -1 : this.state.account.id

    }
    }     

    ApiHelper.getWithParam(url, objData, this, true, authHeader).then((response) => {
      if (this.state.page !== 0 && response) {
        if (response.length == 0) {
            this.setState({ page: this.state.page - 1, canLoadMore: false })
        } else if (response.length < pageSize) {
            this.setState({ canLoadMore: false })
        }
        let arr = [...this.state.dataSource, ...response]
        this.setState({ dataSourceMain: arr, dataSource: arr, isLoadingMore: false })
    } else {
        if (response) {
            this.setState({ dataSourceMain: response, dataSource: response, canLoadMore: response.length == pageSize })
        }
    }
    })
      .catch((response) => {
        this.setState({ isLoadingMore: false })
        ApiHelper.handleErrorAlert(response)
      })
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
            this.props.navigation.navigate(this.state.screen, { assetSelected: row.item });
          }}>
          {/* <View style={{ flex: 1 }}> */}
                    {row.item.name ?
                        <Label style={styles.nameText}>{row.item.name}</Label>
                        : null}
                    {row.item.description ? <Label style={styles.descriptionText}>{row.item.description}</Label> : null}
                    <View style={styles.gridContainer}>
                    {row.item.serial_tag_number ?
                        <View style={styles.itemContainer}>
                            <View style={styles.dateContainer}>
                                <Image style={styles.dateIcon} source={Images.assetIcon} />
                                <Label style={[styles.titleText, { marginTop: 0 }]}>Serial Number</Label>
                            </View>
                           <Label style={styles.dateText}>{row.item.serial_tag_number}</Label>
                        </View>
                        : null }
                        { row.item.unique_fields && row.item.unique_fields[0].Value ? 
                        <View style={styles.itemContainer}>
                            <View style={styles.dateContainer}>
                                <Image style={styles.dateIcon} source={Images.assetIcon} />
                                <Label style={[styles.titleText, { marginTop: 0 }]}>{row.item.unique_fields ? row.item.unique_fields[0].Key.split(' (')[0] : 'Bar Code' }</Label>
                            </View>
                           <Label style={styles.dateText}>{row.item.unique_fields ? row.item.unique_fields[0].Value : null }</Label>
                        </View> : null}
                    </View>
                    {row.item.ticket_name ?
                        <Label style={[styles.titleText, { marginTop: 15 }]}>Ticket <Label style={styles.ticketText}>{`#${row.item.ticket_name}`}</Label></Label>
                        : null}
                    {/* </View> */}
                    <View style={styles.gridContainer}>

                        <View style={styles.itemContainer}>
                            <Label style={styles.titleText}>Category</Label>
                            <Label style={styles.valueText}>{row.item.category}</Label>
                        </View>
                        {/* {row.item.tech_name ? */}
                        <View style={styles.itemContainer}>
                            <Label style={styles.titleText}>Make</Label>
                            <Label style={styles.valueText}>{row.item.make}</Label>
                        </View>
                        {/* // : null } */}
                    </View>
                    <View style={styles.gridContainer}>

                        <View style={styles.itemContainer}>
                            <Label style={styles.titleText}>Type</Label>
                            <Label style={styles.valueText}>{row.item.type}</Label>
                        </View>
                        {/* {row.item.tech_name ? */}
                        <View style={styles.itemContainer}>
                            <Label style={styles.titleText}>Model</Label>
                            <Label style={styles.valueText}>{row.item.model}</Label>
                        </View>
                        {/* // : null } */}
                    </View>
                    <View style={styles.gridContainer}>
                    {row.item.checkout_name ?  <View style={styles.itemContainer}>
                                <Label style={styles.titleText}>Checked Out</Label>
                                <Label style={styles.valueText}>{row.item.checkout_name || '-'}</Label>
                            </View>  : null}
                            <View style={styles.itemContainer}>
                            <View style={styles.dateContainer}>
                                <Image style={styles.dateIcon} source={Images.dateIcon} />
                                <Label style={[styles.titleText, { marginTop: 0 }]}>Updated</Label>
                            </View>
                            <Label style={styles.dateText}>{row.item && row.item.updated_date ? Moment(row.item.updated_date).utc().format(DateFormat.DDMMMYYYYHMMA) : Moment().utc().format(DateFormat.DDMMMYYYYHMMA)}</Label>
                        </View>
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
            showTitle={`Select ${this.state.title}`}
            rightImage={this.state.isShowSearch ? Images.close : Images.searchInNav}
            hideRightButton={false}
            rightButton={() => {
              if (this.state.searchString.trim() != "") {
                this.setState({
                  searchString: "",
                })
                this.fetchData()
              } else {
                this.setState({
                  isShowSearch: !(this.state.isShowSearch),
                })
                this.setState({
                  isReaderOpen: false,
                });
                setTimeout(() => this.state.isShowSearch && this.searchRef._root.focus(), 600)
              }
            }}
          />
        </SafeAreaView>
        <LoaderBar show={this.state.loading} />
        {this.state.isShowSearch ? <View><Animatable.View animation={'fadeIn'} style={styles.searchContainer}>
          <Input
            style={styles.searchInput}
            placeholder={`Search by Asset tag / UniqueID`}
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
            this.openBarCode()
          }}>
            <Image style={styles.clearText} source={this.state.isReaderOpen ? Images.close : Images.scanbarcodeIcon} />
          </TouchableOpacity>
        </Animatable.View>
        { this.state.isReaderOpen ? <View style={styles.barcodebox}>
              {this.state.hasCameraPermission === null ?
          <Text>Requesting for camera permission</Text> :
          this.state.hasCameraPermission === false ?
            <Text>Camera permission is not granted</Text> :
            <BarCodeScanner
            onBarCodeScanned={this._handleBarCodeRead}
              style={{ height: 250, width: 400 }}
            />
          }
        </View> : null} 
        </View>: null}
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
                onEndReachedThreshold={0.05}
                onEndReached={() => this.handleLoadMore()}
              />
            </View>
          </SafeAreaView>
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 25 }}>
            <LoaderBar show={this.state.loading} showActivityIndicator />
          </View>
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
export default connect(mapStateToProps)(SearchAssets);