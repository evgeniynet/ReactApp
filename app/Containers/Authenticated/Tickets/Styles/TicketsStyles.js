/* Imports */
import { StyleSheet, Platform } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../../../Themes'
import TechnicianTicketsStyles from '../../Technicians/Styles/TechnicianTicketsStyles';

/* Exporting style sheet */
export default StyleSheet.create({
  ...ApplicationStyles.screen,
  ...TechnicianTicketsStyles,
  contentContainer: {
    marginTop: Metrics.baseMargin,
    backgroundColor: Colors.contentBg,
    borderTopLeftRadius: Metrics.doubleSection - Metrics.baseMargin,
    borderTopRightRadius: Metrics.doubleSection - Metrics.baseMargin,
    flex: 1,
    overflow: 'hidden'
  },
  flatListPadding: {
    paddingTop: Metrics.doubleBaseMargin,    
    paddingBottom: Metrics.doubleBaseMargin + Metrics.baseMargin,
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
    borderRadius:  Metrics.baseMargin,
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
  
})
