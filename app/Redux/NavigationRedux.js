/* Imports */
import { StatusBar } from 'react-native'
import AppNavigation from '../Navigation/AppNavigation'
import { Colors } from '../Themes';

/* Changing status bar color based on side open and close */
async function setStatusBar(type, state) {
  if (type == 'Navigation/OPEN_DRAWER') {
    setTimeout(() => {
      Platform.OS === 'ios' ? null : StatusBar.setBackgroundColor(Colors.snow)
      StatusBar.setBarStyle('dark-content', false)
    }, 200)
  }
  else if (type == 'Navigation/CLOSE_DRAWER') {
    StatusBar.setBarStyle('light-content', false)
    setTimeout(() => {
      Platform.OS === 'ios' ? null : StatusBar.setBackgroundColor(Colors.mainPrimary)
    }, 50)
  } else if (type == 'Navigation/BACK') {
    // if (state.routes.length > 0 ) {
    //   if (state.routes[0].isDrawerOpen) {
    StatusBar.setBarStyle('light-content', false)
    setTimeout(() => {
      Platform.OS === 'ios' ? null : StatusBar.setBackgroundColor(Colors.mainPrimary)
    }, 50)
    //   }
    // }
  }
}

/* Exporting reducer */
export const reducer = (state, action) => {
  const newState = AppNavigation.router.getStateForAction(action, state)
  setStatusBar(action.type, state)
  return newState || state
}
