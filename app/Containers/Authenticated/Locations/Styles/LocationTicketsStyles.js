/* Imports */
import { StyleSheet, Platform } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../../../Themes'
import TechnicianTicketsStyles from '../../Accounts/Styles/AccountTicketsStyles';

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

})
