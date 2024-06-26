/* Imports */
import { StyleSheet, Platform } from 'react-native'
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
  reusableRowContainer: {
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    marginBottom: Metrics.doubleBaseMargin,
    paddingTop: 0,
    paddingLeft: Metrics.doubleBaseMargin,
    paddingRight: Metrics.doubleBaseMargin,
    paddingBottom: 0,
    borderRadius: Metrics.baseMargin,
    shadowRadius: Metrics.baseMargin,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.5,
        shadowColor: Colors.shadow,
        shadowOffset: {
          width: 0,
          height: Metrics.baseMargin + 3
        },
      },
      android: {
        shadowColor: Colors.black30,
        elevation: Metrics.baseMargin + 3
      },
    }),
    alignItems: 'center',
  },
  titleText: {
    flex: 1,
    marginTop: Metrics.doubleBaseMargin,
    marginBottom: Metrics.doubleBaseMargin,
    ...Fonts.style.mediumText,
    color: Colors.softBlue,
  },
  ticketContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Metrics.doubleBaseMargin,
    marginBottom: Metrics.doubleBaseMargin,
  },
  ticktIcon: {
    width: Metrics.doubleBaseMargin,
    height: Metrics.doubleBaseMargin,
    resizeMode: 'contain',
  },
  ticketNuberText: {
    paddingLeft: Metrics.baseMargin,
    ...Fonts.style.smalBoldTitle,
    fontSize: Fonts.size.small + 1,
    color: Colors.mainPrimary,
  },
})
