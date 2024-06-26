/* Imports */
import Fonts from './Fonts'
import Metrics from './Metrics'
import Colors from './Colors'

// This file is for a reusable grouping of Theme items.
// Similar to an XML fragment layout in Android

/* Global common styles */
const ApplicationStyles = {
  screen: {
    mainContainer: {
      flex: 1,
      backgroundColor: Colors.clear,
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    },
    container: {
      flex: 1,
      paddingTop: Metrics.baseMargin,
      backgroundColor: Colors.clear
    },
    searchContainer: {
      flexDirection: 'row',
      marginTop: Metrics.baseMargin,
      height: Metrics.doubleSection,
      marginLeft: Metrics.doubleBaseMargin,
      marginRight: Metrics.doubleBaseMargin,
      alignItems: 'center',
      borderRadius: Metrics.section,
      backgroundColor: Colors.searchBg,
      paddingRight: Metrics.doubleBaseMargin - 5,
    },
    searchInput: {
      paddingLeft: Metrics.doubleBaseMargin,
      paddingRight: Metrics.baseMargin,
      flex: 1,
      backgroundColor: Colors.clear,
      ...Fonts.style.mediumText,
      color: Colors.snow,
    },
    searchRightIcon: {
      marginLeft: Metrics.smallMargin,
      height: '100%',
      padding: Metrics.baseMargin - 3,
      paddingTop: Metrics.baseMargin + 2,
    },
    barcodebox: {
      marginTop: Metrics.baseMargin,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderRadius: 10,
      flexDirection: 'row',
    },
    clearText: {
      height: Metrics.section,
      width: Metrics.section,
    },
    floatingContainer: {
      position: 'absolute',
      right: Metrics.doubleBaseMargin + Metrics.baseMargin,
      bottom: Metrics.doubleBaseMargin + Metrics.doubleBaseMargin,
    },
    flatListPadding: {
      paddingTop: Metrics.doubleBaseMargin + Metrics.baseMargin,
      paddingBottom: Metrics.doubleSection + Metrics.doubleBaseMargin,
    },
    rowBack: {
      flex: 1,
      paddingLeft: 20,
    },
    backBtnRightContainer: {
      flex: 1,
      flexDirection: 'row',
      bottom: 20,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      width: 226,
      right: 5,
    },
    backRightBtnRight: {
      flex: 1,
      height: '100%',
      borderRadius: 0,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    swipeActionButtonIcon: {
      height: Metrics.doubleSection - Metrics.baseMargin,
      width: Metrics.doubleSection - Metrics.baseMargin,
      resizeMode: 'contain',
    },
    backTextWhite: {
      marginTop: Metrics.smallMargin,
      paddingLeft: 0,
      paddingRight: 0,
      color: Colors.secondary,
      ...Fonts.style.smallMediumTitle,
      textAlign: 'center',
    },
    noDataContainer: {
      padding: Metrics.doubleBaseMargin,
      paddingTop: 30,
      alignItems: 'center'
    },
    noDataIcon: {
      height: 150,
      width: 150,
      resizeMode: 'contain'
    },
    noDataTitleStyle: {
      ...Fonts.style.mediumText,
      color: Colors.secondary50,
      textAlign: 'center',
      padding: Metrics.baseMargin,
    },


    section: {
      margin: Metrics.section,
      padding: Metrics.baseMargin
    },
    sectionText: {
      ...Fonts.style.mediumLargeTitle,
      paddingVertical: Metrics.doubleBaseMargin,
      color: Colors.black,
      marginVertical: Metrics.smallMargin,
      textAlign: 'center'
    },
    subtitle: {
      color: Colors.black,
      padding: Metrics.smallMargin,
      marginBottom: Metrics.smallMargin,
      marginHorizontal: Metrics.smallMargin
    },
    titleText: {
      ...Fonts.style.mediumText,
      fontSize: 14,
      color: Colors.text
    }
  },
  darkLabelContainer: {
    padding: Metrics.smallMargin,
    paddingBottom: Metrics.doubleBaseMargin,
    borderBottomColor: Colors.black,
    borderBottomWidth: 1,
    marginBottom: Metrics.baseMargin
  },
  darkLabel: {
    fontFamily: Fonts.type.bold,
    color: Colors.black
  },
  groupContainer: {
    margin: Metrics.smallMargin,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  }
}

/* Exporting method */
export default ApplicationStyles
