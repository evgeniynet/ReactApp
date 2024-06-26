/* Imports */
import React, { Component } from 'react'
import { Image, View, TouchableOpacity, Platform, StatusBar, SafeAreaView, FlatList, Keyboard } from 'react-native'
import { Container, Input, Label, CardItem, Text } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { BarCodeScanner } from 'expo-barcode-scanner'

import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Images, Colors } from '../../../Themes';
import LinearGradient from 'react-native-linear-gradient';
import CommonFunctions from '../../../Components/CommonFunctions';
import { UserDataKeys } from '../../../Components/Constants';
import ApiHelper from '../../../Components/ApiHelper';
import LoaderBar from '../../../Components/LoaderBar';

// Styless
import styles from '../Technicians/Styles/SearchTechniciansStyles';

class SearchUsers extends Component {

  // Life cycle of class
  /* Initiating state before the component mount. */
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      searchString: '',
      dataSource: [],
      isShowSearch: true,
      dataSourceMain: [],
      account: null,
      title: '',
      technician: 'User',
      techTitle: 'End User',
      config: {},
      screen: 'AddEditTicket',
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
      title: '',
      technician: 'User',
      techTitle: 'End User',
      config: {},
      screen: 'AddEditTicket',
      page: 0,
      isLoadingMore: false,
      canLoadMore: true,
    });

    CommonFunctions.retrieveData(UserDataKeys.Config)
      .then((response) => {
        let config = JSON.parse(response)
        var title = 'Users'
        var techTitle = 'End User'
        var technician = 'User'
        if (config.is_customnames) {
          title = config.names.user.p ?? 'Users'
          technician = config.names.user.s ?? 'User'
          techTitle = config.names.user.a ?? 'End User'
        }
        this.setState({ title: title, technician: technician, techTitle: techTitle, config: config })
        // Call Apis
      }).catch(() => {
        this.setState({ title: 'Users' })
      })

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

  componentWillUnmount() {
    Keyboard.dismiss();
  }

  //Actions

  /* Filtering technician based on searched text */
  searchNow() {
    if (this.state.searchString.trim() !== '') {
      if (this.state.searchString.trim().length > 3) {
        this.setState({
          page: 0,
          isLoadingMore: false,
          canLoadMore: true,
        })
        setTimeout(() => {
          this.fetchTech(true)
        }, 100)
      } else {
        const arrSearchResult = this.state.dataSourceMain.filter((obj) => {
          return obj.value_title.includes(this.state.searchString) //obj.startsWith(value)
        })
        this.setState({ dataSource: arrSearchResult })
      }
    } else {
       this.fetchData()
    }
  }

  //Class Methods
  /* Calling function for fetch data from page 0 */
  fetchData = () => {
    if (!this.state.loading) {
      this.setState({
        page: 0,
        isLoadingMore: false,
        canLoadMore: true,
      })
      setTimeout(() => {
        this.fetchTech()
      }, 100)
    }
  }

  /* Calling api to load more data */
  handleLoadMore() {
    if (!this.state.loading && !this.state.isLoadingMore && this.state.canLoadMore && this.state.searchString.trim() == '') {
      setTimeout(() => {
        this.setState({ page: this.state.page + 1, isLoadingMore: true })
        setTimeout(() => this.fetchTech(), 100)
      }, 100)
    }
  }

  /* Calling api to fetch technicians */
  fetchTech(isSearch = false) {
    let pageLimit = 25
    let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
    var objData = { }
    if (this.state.page == 0) {
      objData.limit = pageLimit
    } else {
      objData.limit = pageLimit,
      objData.page = this.state.page
    }
    if (isSearch) {
      objData.search = this.state.searchString
    }

    if (this.state.config && this.state.config.is_account_manager)
    {
    //objData.accountId= -1;
    if (this.state.account && this.state.account.id != null && this.state.account.id != undefined) {
      objData.account = this.state.account.id

    }
    } 

    ApiHelper.getWithParam(ApiHelper.Apis.Users, objData, this, true, authHeader).then((response) => {
      if (this.state.page !== 0 && response) {
        if (response.length == 0) {
          this.setState({ page: this.state.page - 1, canLoadMore: false })
        } else if (response.length < pageLimit) {
          this.setState({ canLoadMore: false })
        }
        var arr = [...this.state.dataSourceMain, ...response]
        var arrAccounts = []
        for (const key in arr) {
          if (Object.hasOwnProperty.call(arr, key)) {
            var obj = arr[key];
            obj.value_title = obj.firstname + ' ' + obj.lastname + (obj.type == 'queue' ? '' : ` (${obj.email})`)
            arrAccounts.push(obj)
          }
        }
        this.setState({ dataSource: arrAccounts, dataSourceMain: arrAccounts, isLoadingMore: false })        
      } else {
        if (response) {
          var arrAccounts = []
          for (const key in response) {
            if (Object.hasOwnProperty.call(response, key)) {
              var obj = response[key];
              obj.value_title = obj.firstname + ' ' + obj.lastname + (obj.type == 'queue' ? '' : ` (${obj.email})`)
              arrAccounts.push(obj)
            }
          }
          this.setState({ dataSource: arrAccounts, dataSourceMain: arrAccounts })
        }
      }
    })
      .catch((response) => {
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

  _requestCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };


  _handleBarCodeRead = ({ type, data }) => {
    /*Alert.alert(
      'Scantrez5rhzg successful!',
      JSON.stringify(data)
    );*/
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

  /* Rendering row */
  renderRow(row) {
    return (
      <Animatable.View useNativeDriver={true} activeOpacity={0.8} animation={this.state.searchString.trim().length == 0 ? 'fadeIn' : 'pulse'}>
        <CardItem button activeOpacity={0.7} style={styles.reusableRowContainer} onPress={() => {
          this.props.navigation.navigate(this.state.screen, { userSelected: row.item });
        }}>
          <Label style={styles.titleText}>{row.item.value_title}</Label>
        </CardItem>
      </Animatable.View>
    )
  }

  /* Rendering header view */
  renderHeader() {
    return (
      <Animatable.View animation={this.state.searchString.trim().length == 0 && this.state.dataSource.length != 0 ? 'fadeIn' : 'pulse'}>
        <CardItem button style={styles.reusableRowContainer} onPress={() => {
          this.props.navigation.push('AddTechnician', { screen: this.state.screen, isUser: true });
        }}>
          <Label style={styles.titleText}>{`Invite New ${this.state.techTitle}`}</Label>
          <Image style={styles.icon} source={Images.addTech} />
        </CardItem>
        <View style={styles.separator} />
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
               })
                this.fetchData()
              } else {
                this.setState({
                  isShowSearch: !(this.state.isShowSearch)
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
            placeholder={`Search ${this.state.technician} / UniqueID`}
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
              <FlatList
                ref={(ref) => { this.flatLisRef = ref; }}
                contentContainerStyle={styles.flatListPadding}
                data={this.state.dataSource}
                renderItem={(row) => this.renderRow(row)}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={this.renderHeader()}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                onEndReachedThreshold={0.05}
                onEndReached={() => this.handleLoadMore()}
              />
            </View>
            <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 4 }}>
                <LoaderBar show={this.state.loading} />
            </View>
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
export default connect(mapStateToProps)(SearchUsers);