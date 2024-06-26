/* Imports */
import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../../../Themes'
import TechnicianTicketsStyles from '../../Technicians/Styles/TechnicianTicketsStyles';

/* Exporting style sheet */
export default StyleSheet.create({
  ...ApplicationStyles.screen,
  ...TechnicianTicketsStyles,
  tabBarContainer: {
    margin: Metrics.doubleBaseMargin,
    marginBottom: 0,
    borderRadius: Metrics.baseMargin,
  },
  tabBarSubContainer: {
    margin: 1,
    borderRadius: Metrics.baseMargin,
    height: Metrics.doubleSection,
    flexDirection: 'row',
    backgroundColor: Colors.snow
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabCount: {
    ...Fonts.style.mediumText,
    color: Colors.secondary,
    fontSize: Fonts.size.medium + 1,
    backgroundColor: Colors.snow,
    height: Metrics.doubleBaseMargin,
    minWidth: Metrics.doubleBaseMargin,
    paddingTop: 1,
    paddingLeft: 6,
    paddingRight: 6,
    marginRight: 15,
    borderRadius: Metrics.baseMargin,
    overflow: 'hidden'
  },
  tabTitle: {
    ...Fonts.style.mediumText,
    color: Colors.secondary50,
    fontSize: Fonts.size.medium + 1,
  },
  tabSelectedTitle: {
    color: Colors.snow,
  }
})
