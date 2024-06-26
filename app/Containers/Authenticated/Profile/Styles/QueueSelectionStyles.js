/* Imports */
import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../../../Themes'

/* Exporting style sheet */
export default StyleSheet.create({
  ...ApplicationStyles.screen,
  contentContainer: {
    backgroundColor: Colors.contentBg,
    marginTop: Metrics.doubleBaseMargin + Metrics.baseMargin,
    borderTopLeftRadius: Metrics.doubleSection - Metrics.baseMargin,
    borderTopRightRadius: Metrics.doubleSection - Metrics.baseMargin,
    flex: 1,
    overflow: 'hidden',
  },
  flatListPadding: {
    paddingTop: Metrics.doubleBaseMargin,
    backgroundColor: Colors.contentBg,
    paddingBottom: Metrics.doubleBaseMargin + Metrics.baseMargin,
  },
  rowContainer: {
    backgroundColor: Colors.clear,
    paddingTop: Metrics.doubleBaseMargin,
    paddingBottom: Metrics.doubleBaseMargin,
  },
  titleText: {
    flex: 1,
    ...Fonts.style.mediumText,
    color: Colors.softBlue,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    // marginBottom: Metrics.baseMargin,
  },
})
