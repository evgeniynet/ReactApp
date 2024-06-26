/* Imports */
import React, { Component } from 'react'
import { Image, View, TouchableOpacity, Platform, StatusBar, SafeAreaView, FlatList, Keyboard } from 'react-native'
import { Container, Input, Label, CardItem } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { FloatingAction } from 'react-native-floating-action';

import { Messages, UserDataKeys } from '../../../Components/Constants';
import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Images, Colors } from '../../../Themes';
import LinearGradient from 'react-native-linear-gradient';
import ApiHelper from '../../../Components/ApiHelper';
import LoaderBar from '../../../Components/LoaderBar';
import CommonFunctions from '../../../Components/CommonFunctions';

// Styless
import styles from './Styles/LocationsStyles'

class Locations extends Component {

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
      title: '',
      locationTitle: 'Location',
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
      title: '',
      locationTitle: 'Location',
    });

    CommonFunctions.retrieveData(UserDataKeys.Config)
      .then((response) => {
        let config = JSON.parse(response)
        let arrOptions = CommonFunctions.floatingMenus(config, config.user)
        this.setState({ flotingMenuDataSource: arrOptions })
        var name = 'Locations'
        if (config.is_customnames) {
          name = config.names.location.p ?? 'Locations'
          locationTitle = config.names.location.s ?? 'Location'
        }
        this.setState({ title: name, locationTitle })
        // Call Apis
      }).catch(() => {
        this.setState({ title: 'Locations' })
      })

    setTimeout(() => {
      this.setState({
        dataSource: this.state.dataSourceMain
      })
    }, 100)

    this.viewWillAppear()
    this.props.navigation.addListener('didFocus', this.viewWillAppear)
  }

  /* Calling api to fetch locations when view will appears */
  viewWillAppear = () => {
    let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
    let objData = {} //limit: 25
    ApiHelper.getWithParam(ApiHelper.Apis.Locations, objData, this, true, authHeader).then((response) => {
      this.setState({ dataSourceMain: response, dataSource: response })
    })
      .catch((response) => {
        ApiHelper.handleErrorAlert(response)
      })
  }

  componentWillUnmount() {
    Keyboard.dismiss();
  }

  //Actions

  /* Filtering location based on searched text */
  searchNow() {
    if (this.state.searchString.trim() !== '') {
      const arrSearchResult = this.state.dataSourceMain.filter((obj) => {
        let strSearch = this.state.searchString.toLocaleLowerCase()
        return obj.name.toLocaleLowerCase().includes(strSearch) //obj.startsWith(value)
      })
      this.setState({ dataSource: arrSearchResult })
    } else {
      this.setState({ dataSource: this.state.dataSourceMain })
    }
  }

  /* Rendering row */
  renderRow(row) {
    return (
      <Animatable.View useNativeDriver={true} animation={this.state.searchString.trim().length == 0 ? 'fadeInUpBig' : 'pulse'}>
        <CardItem
          activeOpacity={0.7}
          style={styles.reusableRowContainer}
          button onPress={() => {
            let data = { location: row.item }
            this.props.navigation.push('LocationTickets', data);
          }}>
          <Label style={styles.titleText}>{row.item.name}</Label>
          <View style={styles.ticketContainer}>
            <Image style={styles.ticktIcon} source={Images.ticketsCount} />
            <Label style={styles.ticketNuberText}>{row.item.tickets_count}</Label>
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
                  dataSource: this.state.dataSourceMain
                })
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
            placeholder={`Search ${this.state.locationTitle}`}
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
              <FlatList
                ref={(ref) => { this.flatLisRef = ref; }}
                contentContainerStyle={styles.flatListPadding}
                data={this.state.dataSource}
                renderItem={(row) => this.renderRow(row)}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </SafeAreaView>
        </View>
        <FloatingAction
          ref={(ref) => { this.floatingAction = ref; }}
          actions={this.state.flotingMenuDataSource}
          color={Colors.green}
          overlayColor={Colors.snow95}
          iconWidth={20}
          iconHeight={20}
          buttonSize={48}
          shadow={{
            shadowColor: Colors.clear,
          }}
          iconColor={Colors.snow}
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
export default connect(mapStateToProps)(Locations);