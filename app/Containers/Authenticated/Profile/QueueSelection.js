/* Imports */
import React, { Component } from 'react'
import { Image, View, TouchableOpacity, Platform, StatusBar, SafeAreaView, FlatList } from 'react-native'
import { Container, Input, Label, CardItem } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';

import { userInfo } from '../../../Redux/Actions';
import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Images, Colors } from '../../../Themes';
import LinearGradient from 'react-native-linear-gradient';

// Styless
import styles from './Styles/QueueSelectionStyles'

class QueueSelection extends Component {

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
    };
  }

  componentDidMount() {
    this.setState({
      loading: false,
      searchString: '',
      dataSource: [],
      dataSourceMain: [{
        id: 1,
        title: 'Default',
        isBadgeOn: false,
      }, {
        id: 2,
        title: 'New Tickets',
        isBadgeOn: false,
      }, {
        id: 3,
        title: 'Fault Resolution',
        isBadgeOn: false,
      }, {
        id: 4,
        title: 'Problem Management',
        isBadgeOn: false,
      }, {
        id: 5,
        title: 'Level 1 All Classes',
        isBadgeOn: false,
      }, {
        id: 6,
        title: 'Level 6 All Classes',
        isBadgeOn: false,
      }, {
        id: 7,
        title: 'Payroll',
        isBadgeOn: false,
      }],
      selectedData: {},
      isShowSearch: false,
    });

    if (this.props.navigation.state.params !== undefined) {
      if (this.props.navigation.state.params.selected !== undefined) {
        this.setState({ selectedData: this.props.navigation.state.params.selected })
      }
    }

    setTimeout(() => {
      this.setState({
        dataSource: this.state.dataSourceMain
      })
    }, 100)

    this.viewWillAppear()
    this.props.navigation.addListener('didFocus', this.viewWillAppear)
  }

  viewWillAppear = () => {

  }

  //Actions

  /* Filtering queues based on searched text */
  searchNow() {
    if (this.state.searchString.trim() !== '') {
      const arrSearchResult = this.state.dataSourceMain.filter((obj) => {
        return obj.title.includes(this.state.searchString) //obj.startsWith(value)
      })
      this.setState({ dataSource: arrSearchResult })
    } else {
      this.setState({ dataSource: this.state.dataSourceMain })
    }
  }

  /* Rendering row */
  renderRow(row) {
    return (
      <CardItem button onPress={() => {
        this.setState({
          selectedData: row.item
        })
        setTimeout(() => {
          this.props.navigation.goBack();
        }, 100)
      }} activeOpacity={0.7} style={styles.rowContainer}>
        <Label style={[styles.titleText, this.state.selectedData.id == row.item.id ? { color: Colors.mainPrimary } : {}]}>{row.item.title}</Label>
      </CardItem>
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
            showTitle='Queue'
            rightImage={this.state.isShowSearch ? Images.close : Images.searchInNav}
            hideRightButton={false}
            rightButton={() => {
              if (this.state.searchString.trim() != "") {
                this.setState({
                  searchString: ""
                })
              } else {
                this.setState({
                  isShowSearch: !(this.state.isShowSearch)
                })
              }
            }}
          />
        </SafeAreaView>
        {this.state.isShowSearch ? <View style={styles.searchContainer}>
          <Input
            style={styles.searchInput}
            placeholder={'Search Queue'}
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
        </View> : null}
        <View style={styles.contentContainer}>
          <SafeAreaView style={styles.mainContainer}>
            <View style={styles.mainContainer}>
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
      </Container>
    )
  }
}

/* Subscribing to redux store for updates */
const mapStateToProps = (state) => {
  const { deviceToken } = state.deviceToken
  return { deviceToken }
};

/* Connecting to redux store and exporting class */
export default connect(mapStateToProps, { userInfo })(QueueSelection);