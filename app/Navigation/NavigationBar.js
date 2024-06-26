/* Imports */
import React from 'react'
import { Image, View, TouchableOpacity, Text, Keyboard, ActivityIndicator } from 'react-native'
import { DrawerActions } from 'react-navigation-drawer'

import { Images, Metrics, Colors } from '../Themes'
import { Input, Button } from 'native-base';

// Styles
import styles from './Styles/NavigationStyles'
// import Icon from 'react-native-vector-icons/FontAwesome';

/* Variables */
const menuRootViewList = ['Dashboard', 'Tickets', 'Events', 'Timelogs', 'Accounts', 'Locations', 'Technicians', 'Expenses', 'Queues', 'ToDos', 'Assets', 'Switch Org', 'Profile']

//Class Methods
/* Rndering navigation bar left side button icon */
renderHeaderLeftIcon = (navigation, leftIcon, isTransparent) => {
  if (isRoot(navigation)) {
    return <Image source={leftIcon === undefined ? Images.menu : leftIcon} style={styles.imageStyle} />
  } else {
    return <Image source={leftIcon === undefined ? (isTransparent ? Images.backWhite : Images.back) : leftIcon} style={styles.imageStyle} />
  }
}

/* Returns current screen is root screen or not (to show menu icon)*/
isRoot = (navigation) => {
  if (navigation.state.routeName == 'Tickets' && navigation.state.params && navigation.state.params.isFromDashbord) {
    return false
  }

  if (navigation.state.routeName == 'Timelogs' && navigation.state.params && navigation.state.params.isFromDashbord) {
    return false
  }

  if (navigation.state.routeName == 'Events' && navigation.state.params && navigation.state.params.isFromDashbord) {
    return false
  }

  if (navigation.state.routeName == 'ToDos' && navigation.state.params && navigation.state.params.isFromDashbord) {
    return false
  }

  if (menuRootViewList.some(item => item === navigation.state.routeName)) {
    return true
  }
  return false
}

/* Rndering navigation bar left side button */
renderLeftButton = (navigation, leftButton, leftIcon, isTransparent) => {
  return (
    <TouchableOpacity
      activeOpacity={0.2} style={styles.navLeftIcon}
      onPress={() => {
        Keyboard.dismiss()
        if (leftButton != null) {
          leftButton()
        }
        if (this.isRoot(navigation)) {
          // leftButton()
          // navigation.navigate('DrawerOpen')
          navigation.dispatch(DrawerActions.openDrawer());
          // navigation.dispatch(NavigationActions.navigate({ routeName: 'DrawerOpen' }));
        } else {
          console.log('navigation state route', navigation.state.routeName);
          navigation.goBack();
        }
      }}>
      {this.renderHeaderLeftIcon(navigation, leftIcon, isTransparent)}
    </TouchableOpacity>
  )
}

/* Rndering search bar in navigation bar */
renderSearchBar = (navigation, other) => {
  return (
    <TouchableOpacity
      activeOpacity={0.2} style={styles.searchBarMainContainer}
      onPress={other}>
      <View style={styles.searchBarContainer}>
        {/* <Icon name='search' size={Metrics.icons.tiny} style={styles.searchIcon} /> */}
        <Text style={styles.searchInput} >Search</Text>
      </View>
    </TouchableOpacity>
  )
}

/* Rndering search bar with navigation title in navigation bar */
renderSearchBarWithInput = (navigation, showTitle, other, value, searchString, searchPlaceholder, onCancel, onSearch, showClearButton, searchRef) => {

  return (
    <View style={styles.searchBarMainContainer}>
      <View style={styles.searchBarContainer}>
        <Input
          style={styles.searchInput}
          placeholder={searchPlaceholder != '' ? searchPlaceholder : showTitle != '' ? showTitle : 'Search...'}
          placeholderTextColor={Colors.placeholder}
          value={value}
          onChangeText={searchString}
          autoCapitalize='sentences'
          autoCorrect={false}
          returnKeyType={'search'}
          onSubmitEditing={other}
          selectionColor={Colors.snow}
          blurOnSubmit={false}
          keyboardAppearance='dark'
          ref={input => {
            searchRef !== undefined ? searchRef(input) : null
          }}
          onSubmitEditing={onSearch}
        />
        {showClearButton ? <TouchableOpacity style={styles.rightIcon} onPress={onCancel}>
          <Image style={styles.clearText} source={Images.close} />
        </TouchableOpacity> : <TouchableOpacity style={styles.rightIcon} onPress={onSearch}>
          <Image style={styles.clearText} source={Images.searchInNav} />
        </TouchableOpacity>}
      </View>

    </View>
  )
}

/* Rndering navigation title for navigation bar */
renderTitleBar = (navigation, title, isWithSearchInput = false, isTransparent) => {
  return (
    <Text style={[styles.titleTextStyle, (isWithSearchInput ? styles.searchTitleTextStyle : {}), (isTransparent ? { color: Colors.snow } : {})]} numberOfLines={1} ellipsizeMode='tail' >{title}</Text>
  )
}

/* Rndering navigation title with button in navigation bar */
renderTitleWithButtom = (other) => {
  return (
    <Button transparent style={styles.buttonInfoContainer} onPress={() => other()}>
      <Image style={styles.imageStyle} source={Images.information} />
    </Button>
  )
}

/* Rndering navigation bar right side button */
renderRightButton = (navigation, rightButton, rightImage, isBigRightButton) => {
  return (
    <TouchableOpacity activeOpacity={0.2} style={[isBigRightButton ? styles.rightBigIcon : {}, styles.rightIcon]}
      onPress={() => rightButton()}>
      <Image source={(rightImage === undefined) ? Images.notifications : rightImage} style={isBigRightButton ? styles.bigImageStyle : styles.imageStyle, { width: 30, height: 30 }} />
    </TouchableOpacity>
  )
}

/* Rndering navigation bar */
const NavigationBar = ({
  value,
  searchString,
  navigation,
  hideRightButton = true,
  isTransparent = false,
  searchPlaceholder,
  isEditableSerach = false,
  leftButton,
  showTitle,
  rightImage,
  rightSecondImage,
  rightButton,
  rightSecondButton,
  other,
  onCancel,
  onSearch,
  showClearButton = false,
  isShowTwoRightButtons = false,
  isTitleWithButton = false,
  leftIcon,
  searchRef,
  showLoader,
  isBigRightButton = false
}) => {
  if (isTransparent) {
    if (isShowTwoRightButtons && !hideRightButton) {
      /* Returns navigation bar with two buttons in right side */
      return (
        <View style={styles.containerTransparent}>
          <View style={styles.subContainer}>
            <View style={{ flexDirection: 'row', flex: 1, width: '100%' }}>
              {this.renderLeftButton(navigation, leftButton, leftIcon, isTransparent)}
              {this.renderTitleBar(navigation, showTitle, false, isTransparent)}
              {this.renderRightButton(navigation, rightButton, rightImage, isBigRightButton)}
              {this.renderRightButton(navigation, rightSecondButton, rightSecondImage, isBigRightButton)}
            </View>
          </View>
        </View>
      )
    }
    /* Returns transparent navigation bar */
    return (
      <View style={[styles.containerTransparent,]}>
        <View style={styles.subContainer}>
          {this.renderLeftButton(navigation, leftButton, leftIcon, isTransparent)}
          {this.renderTitleBar(navigation, showTitle, false, isTransparent)}
        </View>
        {hideRightButton ? <View style={[styles.imageStyle, styles.rightIcon]} /> : this.renderRightButton(navigation, rightButton, rightImage, isBigRightButton)}
      </View>
    )
  }
  else if (isEditableSerach) {
    /* Returns search bar navigation bar */
    return (
      <View style={styles.containerTransparent}>
        <View style={styles.subContainer}>
          {this.renderLeftButton(navigation, leftButton, leftIcon, isTransparent)}
          {this.renderSearchBarWithInput(navigation, showTitle, other, value, searchString, searchPlaceholder, onCancel, onSearch, showClearButton, searchRef)}
        </View>
      </View>
    )
  } else if (isShowTwoRightButtons) {
    /* Returns navigation bar with two buttons in right side */
    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <View style={{ flexDirection: 'row', flex: 1, width: '100%' }}>
            {this.renderLeftButton(navigation, leftButton, leftIcon, isTransparent)}
            {this.renderTitleBar(navigation, showTitle, false, isTransparent)}
            {this.renderRightButton(navigation, rightButton, rightImage, isBigRightButton)}
            {this.renderRightButton(navigation, rightSecondButton, rightSecondImage, isBigRightButton)}
          </View>
        </View>
      </View>
    )
  } else if (isTitleWithButton) {
    /* Returns navigation bar with button in right side */
    return (
      <View style={[styles.containerTransparent]}>
        <View style={styles.subContainer}>
          {this.renderLeftButton(navigation, leftButton, leftIcon, true)}
          <Text style={styles.titleTextWithButtonStyle} numberOfLines={1} ellipsizeMode='tail' >{showTitle}</Text>
          {this.renderTitleWithButtom(other, showLoader)}
        </View>
        {hideRightButton ? null : this.renderRightButton(navigation, rightButton, rightImage, isBigRightButton)}
      </View>
    )
  }
  return (
    /* Returns navigation bar */
    <View style={[styles.container,]}>
      <View style={styles.subContainer}>
        {this.renderLeftButton(navigation, leftButton, leftIcon, isTransparent)}
        {showTitle !== '' ? this.renderTitleBar(navigation, showTitle, false, isTransparent) : this.renderSearchBar(navigation, other)}
      </View>
      {hideRightButton ? <View style={[styles.imageStyle, styles.rightIcon]} /> : this.renderRightButton(navigation, rightButton, rightImage, isBigRightButton)}
    </View>
  )
};

/* Exporting navigation bar */
export { NavigationBar };