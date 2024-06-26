/* Imports */
import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../../../Themes'

/* Exporting style sheet */
export default StyleSheet.create({
  ...ApplicationStyles.screen,
  contentContainer: {
    marginTop: Metrics.baseMargin,
    backgroundColor: Colors.contentBg,
    borderTopLeftRadius: Metrics.doubleSection - Metrics.baseMargin,
    borderTopRightRadius: Metrics.doubleSection - Metrics.baseMargin,
    flex: 1,
    overflow: 'hidden'
  },
  flatListTabContainer: {
    marginTop: Metrics.baseMargin + 3,
    marginBottom: Metrics.baseMargin + 3,
  },
  flatListTabPadding: {
    // paddingLeft: Metrics.baseMargin,    
    // paddingRight: Metrics.baseMargin,
  },
  rowTabContainer: {
    marginLeft: Metrics.baseMargin,
    marginRight: Metrics.baseMargin,
    paddingTop: Metrics.smallMargin + 2,
    paddingBottom: Metrics.smallMargin + 2,
    paddingLeft: Metrics.baseMargin + Metrics.smallMargin,
    paddingRight: Metrics.baseMargin + Metrics.smallMargin,
    backgroundColor: Colors.clear,
    borderRadius: Metrics.baseMargin,
  },
  selectedTab: {
    backgroundColor: Colors.snow25,
  },
  tabTitle: {
    ...Fonts.style.mediumText,
    fontSize: Fonts.size.medium + 1,
    color: Colors.softBlue,
  },
  tabSelectedTitle: {
    ...Fonts.style.mediumRegularText,
    fontSize: Fonts.size.medium + 1,
    color: Colors.snow,
  },
  bottomContainer: {
    backgroundColor: Colors.softBlue,
    alignItems: 'center',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  buttonConatiner: {
    marginTop: Metrics.doubleBaseMargin + 3,
    marginBottom: Metrics.doubleBaseMargin + 3,
    backgroundColor: Colors.snow,
    paddingLeft: Metrics.section + 7,
    paddingRight: Metrics.section + 7,
    paddingTop: Metrics.baseMargin + 2,
    paddingBottom: Metrics.baseMargin + 2,
    borderRadius: Metrics.baseMargin,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addIcon: {
    height: Metrics.section + 1,
    width: Metrics.section + 1,
    resizeMode: 'contain'
  },
  buttonTitle: {
    ...Fonts.style.mediumText,
    fontSize: Fonts.size.medium + 1,
    color: Colors.secondary,
    padding: 7,
  }
})
