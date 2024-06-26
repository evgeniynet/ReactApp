/* Imports */
import React, { Component } from 'react'
import { View, StatusBar, Platform } from 'react-native'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import { connect } from 'react-redux'
import KeyboardManager from 'react-native-keyboard-manager';

import StartupActions from '../Redux/StartupRedux'
import { Colors } from '../Themes'

// Styles
import styles from './Styles/RootContainerStyles'

class RootContainer extends Component {

  // Life cycle of class
  componentDidMount() {
    this.props.startup()
    if (Platform.OS === 'ios') {
      KeyboardManager.setEnable(true);
      KeyboardManager.setEnableDebugging(false);
      // KeyboardManager.setKeyboardDistanceFromTextField(10);
      // KeyboardManager.setPreventShowingBottomBlankSpace(true);
      KeyboardManager.setEnableAutoToolbar(true);
      KeyboardManager.setToolbarDoneBarButtonItemText("Close");
      KeyboardManager.setToolbarManageBehaviourBy("subviews"); // "subviews" | "tag" | "position"
      // KeyboardManager.setToolbarManageBehaviour(0);
      KeyboardManager.setToolbarTintColor(Colors.mainPrimary)
      KeyboardManager.setToolbarPreviousNextButtonEnable(true);
      KeyboardManager.setShouldToolbarUsesTextFieldTintColor(true);
      // KeyboardManager.setShouldShowTextFieldPlaceholder(true); // deprecated, use setShouldShowToolbarPlaceholder
      KeyboardManager.setShouldShowToolbarPlaceholder(true);
      KeyboardManager.setOverrideKeyboardAppearance(false);
      KeyboardManager.setShouldResignOnTouchOutside(true);
      KeyboardManager.setShouldPlayInputClicks(true);
      KeyboardManager.setKeyboardAppearance('dark')
      KeyboardManager.resignFirstResponder();

    }
  }

  /* What are displaying on the screen */
  render() {
    return (
      <View style={styles.applicationView}>
        {/* <StatusBar barStyle='default' /> */}
        <ReduxNavigation />
      </View>
    )
  }
}

// wraps dispatch to create nicer functions to call within our component
/* A connected component receives props */
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup())
})

/* Connecting to redux store and exporting class */
export default connect(null, mapDispatchToProps)(RootContainer)
