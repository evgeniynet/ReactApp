/* Imports */
import * as React from 'react'
import { BackHandler, Platform, ToastAndroid } from 'react-native'
import {
  createReactNavigationReduxMiddleware,
  createReduxContainer
} from 'react-navigation-redux-helpers'
import { connect } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen'

import AppNavigation from './AppNavigation'
import { UserDataKeys } from '../Components/Constants';
import ApiHelper from '../Components/ApiHelper';
import CommonFunctions from '../Components/CommonFunctions';
import NavigationService from '../Components/NavigationService';

import { Linking } from "react-native";

/* Exporting app navigator middleware */
export const appNavigatorMiddleware = createReactNavigationReduxMiddleware(
  (state) => state.nav,
  'root'
)

/* Global Variables */
/* Creating redux container */
const ReduxAppNavigator = createReduxContainer(AppNavigation, 'root')
let backPressed = 0;

class ReduxNavigation extends React.Component {

  //Class Methods
  constructor() {
    super();
    this.state = {
      backPressed: 1
    }
  }

  /* Adding event listener(BackPress) for prevent go back (pop screen) to launch screen */
  componentDidMount() {

    /* Setting root of based on user loged in or not */
    this.fetchUserDataAndSetNavigation()

    if (Platform.OS === 'ios') return
    BackHandler.addEventListener('hardwareBackPress', () => {
      const { dispatch, nav } = this.props
      var value = nav.routes && nav.routes.length > 0 ? (nav.routes[0].routes && nav.routes[0].routes.length > 0 ? (nav.routes[0].routes[0].routes && nav.routes[0].routes[0].routes.length > 0 ? nav.routes[0].routes[0].routes.length : 0) : 0) : 0
      if (nav.routes && nav.routes.length > 0 ? (nav.routes[0].routeName !== 'dashboardStack' && nav.routes[0].routeName !== 'ticketStack') : false) {
        value = nav.routes && nav.routes.length > 0 ? nav.routes[0].routes.length : 0
      }
      if (value == 1) {
        if (nav.routes && nav.routes.length > 0 ? (nav.routes[0].isDrawerOpen) : false) {
          console.log(nav.routes[0].isDrawerOpen);
          dispatch({ type: 'Navigation/BACK' })
          return true
        }
        if (backPressed > 0) {
          BackHandler.exitApp();
          backPressed = 0;
        } else {
          backPressed++;
          ToastAndroid.show("Press Again To Exit", ToastAndroid.SHORT);
          setTimeout(() => { backPressed = 0 }, 2000);
          return true;
        }
      }
      // change to whatever is your first screen, otherwise unpredictable results may occur
      if (nav.routes.length === 1 && ((nav.routes[0].routeName === 'SignIn') || (nav.routes[0].routeName === 'Dashboard'))) {
        return false
      }

      // if (shouldCloseApp(nav)) return false
      dispatch({ type: 'Navigation/BACK' })
      return true
    })
  }

  componentDidUpdate() {
    // SplashScreen.hide()
  }

  /* Romving event(BackPress) listener */
  componentWillUnmount() {
    Linking.removeAllListeners('url');
    if (Platform.OS === 'ios') return
    BackHandler.removeEventListener('hardwareBackPress', undefined)
  }

  //Class Methods
  /* Setting root of based on user loged in or not */
  fetchUserDataAndSetNavigation = async () => {
    try {

      // console.log('fetchUserDataAndSetNavigation ====================================');
      const value = await AsyncStorage.getItem(UserDataKeys.User)
      console.log('fetchUserDataAndSetNavigation ====================================', value);
      if (value !== '' && value !== null) {
        // value previously stored
        var user = JSON.parse(value);
        // this.props.myInfo(user);
        console.log('AsyncStorage Result For Dashboard ====================================');
        console.log(value);
        console.log('AsyncStorage Result For Dashboard  ====================================');

        try {
          const value = await AsyncStorage.getItem(UserDataKeys.Config)
          if (value !== '' && value !== null) {
            let config = JSON.parse(value);
            let objUser = config.user
            const resetAction = StackActions.reset({
              index: 0, // <-- currect active route from actions array
              actions: [
                NavigationActions.navigate({ routeName: objUser.is_techoradmin ? 'dashboardStack' : 'ticketStack' }),
                // NavigationActions.navigate({ routeName: 'dashboardStack' }),
              ],
            });
            this.props.dispatch(resetAction);
            SplashScreen.hide()
          }
        } catch (e) {
        }

      } else {
        console.log('AsyncStorage Empty Result For Auth ====================================');
        this.navigateToAuthModule()
      }
    } catch (e) {
      // error reading value
      console.log('AsyncStorage Error ====================================');
      console.log(e);
      console.log('AsyncStorage Error====================================');
      this.navigateToAuthModule()
    }
  }

  /* Setting login screen (authentication module) to root view */
  navigateToAuthModule() {
    const resetAction = StackActions.reset({
      index: 0, // <-- currect active route from actions array
      actions: [
        NavigationActions.navigate({ routeName: 'authStack' }),
      ],
    });
    this.props.dispatch(resetAction);
    SplashScreen.hide()
  }

  /* What are displaying on the screen */
  render() {
    return <ReduxAppNavigator ref={(navigatorRef) => { NavigationService.setTopLevelNavigator(navigatorRef, this.props.dispatch); }} dispatch={this.props.dispatch} state={this.props.nav} />
  }
}

/* Subscribing to redux store for updates */
const mapStateToProps = state => ({
  nav: state.nav
})

/* Connecting to redux store and exporting class */
export default connect(mapStateToProps)(ReduxNavigation)
