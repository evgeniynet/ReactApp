/* Imports */
import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../../../Themes'
import CloseTicketStyles from '../../Accounts/Styles/CloseTicketStyles';

/* Exporting style sheet */
export default StyleSheet.create({
  ...ApplicationStyles.screen,
  ...CloseTicketStyles,
  switchContainer: {
    flexDirection: 'row',
    flex: 1,
    paddingLeft: Metrics.baseMargin,
    paddingRight: Metrics.baseMargin,
    alignItems: 'center',
    marginBottom: Metrics.doubleBaseMargin,
  },
  switchTitle: {
    ...Fonts.style.smallRegularTitle,
    color: Colors.black,
    fontSize: Fonts.size.small + 1,
    paddingLeft: Metrics.baseMargin,
    paddingRight: Metrics.baseMargin,
  },
  switchIcon: {
    height: Metrics.section - 1,
    width: Metrics.doubleSection + 1,
    resizeMode: 'contain',
  },
})