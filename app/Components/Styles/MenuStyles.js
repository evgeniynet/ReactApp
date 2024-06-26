import { StyleSheet, Platform } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../Themes'

/* Exporting style sheet */
export default StyleSheet.create({
  ...ApplicationStyles.screen,

  container: {
    backgroundColor: Colors.snow,
    opacity: 0.96,
    flex: 1,
  },
  topBottonsContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginRight: Metrics.baseMargin
  },
  buttonIcon: {
    margin: Metrics.baseMargin,
    width: Metrics.section + Metrics.baseMargin,
    height: Metrics.section + Metrics.baseMargin,
  },
  userConatiner: {
    flexDirection: 'row',
    marginTop: Metrics.doubleBaseMargin,
    marginBottom: Metrics.section + 2,
    marginLeft: Metrics.section,
    marginRight: Metrics.doubleBaseMargin,
    alignItems: 'center',
  },
  profilePicture: {
    width: Metrics.doubleSection,
    height: Metrics.doubleSection,
    resizeMode: 'cover',
    borderRadius: Metrics.section,
  },
  userName: {
    marginLeft: Metrics.baseMargin, // + Metrics.smallMargin
    color: Colors.secondary,
    ...Fonts.style.mediumText,
    fontSize: 20,
  },
  menuListContainer: {
    paddingLeft: Metrics.baseMargin + 4,
    paddingRight: Metrics.baseMargin + 4,
    paddingBottom: Metrics.doubleBaseMargin
  },
  menuItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: Metrics.baseMargin,
    marginRight: Metrics.baseMargin,
    marginTop: Metrics.baseMargin,
    marginBottom: Metrics.baseMargin,
    backgroundColor: Colors.snow,
    paddingTop: Metrics.baseMargin,
    paddingLeft: Metrics.baseMargin + 2,
    paddingRight: Metrics.baseMargin + 2,
    paddingBottom: Metrics.baseMargin + 2,
    borderRadius: Metrics.buttonRadius,
    shadowRadius: Metrics.baseMargin,
    ...Platform.select({
      ios: {
        shadowOpacity: 1,
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
    // flex: 1,
    width: (Metrics.screenWidth - 72) / 2
  },
  menuIconStyle: {
    width: Metrics.section + Metrics.smallMargin,
    height: Metrics.section + Metrics.smallMargin,
    resizeMode: 'contain'
  },
  menuTitleStyle: {
    marginTop: Metrics.smallMargin,
    color: Colors.textThree,
    ...Fonts.style.mediumRegularText,
  },
  appVersion: {
    textAlign: 'center',
    color: Colors.black,
    ...Fonts.style.smallRegularTitle,
    opacity: 0.8,
    bottom: 40
  },
  appVersionMenu: {
    textAlign: 'center',
    color: Colors.black,
    ...Fonts.style.smallRegularTitle,
    opacity: 0.8,
    bottom: -15
  },
})