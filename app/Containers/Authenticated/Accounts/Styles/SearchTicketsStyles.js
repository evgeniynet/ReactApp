/* Imports */
import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../../../Themes'

/* Exporting style sheet */
export default StyleSheet.create({
  ...ApplicationStyles.screen,
  contentContainer: {
    marginTop: Metrics.doubleBaseMargin,
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
  separator: {
    marginLeft: Metrics.doubleBaseMargin,
    height: 1,
    flex: 1,
    backgroundColor: Colors.secondary,
    opacity: 0.10
  },
  reusableRowContainer: {
    marginTop: 2,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    marginBottom: 2,
    paddingTop: Metrics.baseMargin,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: Metrics.baseMargin,
    alignItems: 'center',
    backgroundColor: Colors.clear
  },
  titleText: {
    flex: 1,
    marginTop: Metrics.doubleBaseMargin,
    marginBottom: Metrics.doubleBaseMargin,
    ...Fonts.style.mediumText,
    fontSize: Fonts.size.medium + 1,
    color: Colors.softBlue,
  },
  icon: {
    width: Metrics.doubleBaseMargin + 6,
    height: Metrics.doubleBaseMargin + 6,
    resizeMode: 'contain',
  },
})
