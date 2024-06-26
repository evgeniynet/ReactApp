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
  reusableRowContainer: {
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    marginBottom: Metrics.doubleBaseMargin,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
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
    flexDirection: 'column',
    flex: 1,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  unreadDot: {
    backgroundColor: Colors.mainPrimary,
    height: 6,
    width: 6,
    borderRadius: 3,
    position: 'absolute',
    left: 8,
    top: 8,
  },
  titleText: {
    flex: 1,
    marginLeft: Metrics.doubleBaseMargin,
    marginTop: Metrics.doubleBaseMargin,
    marginBottom: Metrics.doubleBaseMargin,
    ...Fonts.style.mediumText,
    color: Colors.softBlue,
  },
  arrowIcon: {
    marginRight: Metrics.doubleBaseMargin,
    width: Metrics.doubleBaseMargin,
    height: Metrics.doubleBaseMargin,
    resizeMode: 'contain',
  },
  separator: {
    width: '100%',
    backgroundColor: Colors.separatorSecondary10,
    height: 1,
  },
  ticketsCounterMainContainer: {
    flex: 1,
    padding: Metrics.doubleBaseMargin,
    borderBottomLeftRadius: Metrics.baseMargin,
    borderBottomRightRadius: Metrics.baseMargin,
    flexDirection: 'row',
    alignContent: 'space-between'
  },
  ticketsCounter: {
    alignItems: 'center',
    flex: 1,
  },
  ticktIcon: {
    width: Metrics.doubleBaseMargin + Metrics.baseMargin,
    height: Metrics.doubleBaseMargin + Metrics.baseMargin,
    resizeMode: 'contain',
  },
  ticketText: {
    marginTop: 7,
    marginBottom: 3,
    ...Fonts.style.smallRegularTitle,
    color: Colors.softBlue,
  },
  ticketCountText: {
    ...Fonts.style.mediumText,
    fontSize: Fonts.size.medium + 1,
    color: Colors.secondary,
  },
})
