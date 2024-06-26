/* Imports */
import { StyleSheet, Platform } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../../../Themes'

/* Exporting style sheet */
export default StyleSheet.create({
  ...ApplicationStyles.screen,
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
  titleText: {
    flex: 1,
    marginLeft: Metrics.doubleBaseMargin - Metrics.smallMargin,
    marginTop: Metrics.doubleBaseMargin,
    marginBottom: Metrics.doubleBaseMargin,
    ...Fonts.style.mediumRegularTitle,
    color: Colors.secondary,
  },
  topRightContainer: {
    marginTop: Metrics.doubleBaseMargin - Metrics.smallMargin,
    flexDirection: 'row',
    backgroundColor: Colors.mainPrimary,
    marginRight: Metrics.doubleBaseMargin - Metrics.smallMargin,
    borderRadius: Metrics.baseMargin + 6,
    alignItems: 'center',
    alignSelf: 'flex-start'
  },
  arrowIcon: {
    marginLeft: Metrics.smallMargin,
    width: Metrics.doubleBaseMargin + Metrics.baseMargin,
    height: Metrics.doubleBaseMargin + Metrics.baseMargin,
    resizeMode: 'contain',
  },
  completeText: {
    ...Fonts.style.mediumText,
    color: Colors.snow,
    marginLeft: Metrics.baseMargin,
  },
  ticketsCounterMainContainer: {
    flex: 1,
    padding: Metrics.doubleBaseMargin,
    paddingTop: Metrics.smallMargin,
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
    color: Colors.textThree,
  },
  ticketCountText: {
    ...Fonts.style.mediumText,
    fontSize: Fonts.size.medium + 1,
    color: Colors.secondary,
  },

})