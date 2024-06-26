/* Imports */
import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Fonts, Colors } from '../../../Themes'

/* Exporting style sheet */
export default StyleSheet.create({
  ...ApplicationStyles.screen,

  container: {
    flex: 1,
    position: 'absolute',
    top: Metrics.navBarHeight,
    left: 0,
    height: '50%',
    // bottom: 0,
    right: 0,
  },
  logoMainContainer: {
    backgroundColor: Colors.clear,
    justifyContent: 'center',
    // minHeight: Metrics.screenWidth,
    flex: 1,
  },
  logoContainer: {
    backgroundColor: Colors.snow,
    // marginTop: (-Metrics.doubleBaseMargin),
    alignItems: 'center',
    flexDirection: 'column',
  },
  logo: {
    height: 200,
    width: 200,
    resizeMode: 'contain',
  },
  loginMainContainer: {
    // flex: 1,
    // minHeight: Metrics.screenHeight / 2,
    borderTopLeftRadius: Metrics.doubleBaseMargin + Metrics.doubleBaseMargin,
    borderTopRightRadius: Metrics.doubleBaseMargin + Metrics.doubleBaseMargin,
  },
  loginItemsContainer: {
    marginTop: Metrics.doubleBaseMargin,
    marginLeft: Metrics.section,
    marginRight: Metrics.section
  },
  inputTitle: {
    margin: Metrics.baseMargin - 2,
    marginTop: Metrics.section,
    ...Fonts.style.smallRegularTitle,
    color: Colors.snow,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputIcon: {
    height: Metrics.doubleBaseMargin - 2,
    width: Metrics.doubleBaseMargin - 2,
    resizeMode: 'contain',
    marginLeft: Metrics.doubleBaseMargin - 1,
    marginRight: Metrics.doubleBaseMargin - 3
  },
  input: {
    ...Fonts.style.mediumText,
    color: Colors.text,
  },
  textErrorColor: {
    color: Colors.placeholderError
  },
  textColor: {
    color: Colors.text
  },
  resetButtonContainer: {
    marginTop: Metrics.doubleSection + Metrics.doubleBaseMargin,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: Metrics.doubleSection - 6,
    borderRadius: Metrics.buttonRadius,
    backgroundColor: Colors.mainPrimary,
  },
  resetButtonText: {
    ...Fonts.style.mediumBoldText,
    color: Colors.snow,
  },
  loginAccountContainer: {
    marginTop: Metrics.section,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.clear,
    marginBottom: Metrics.doubleSection,
    height: Metrics.doubleSection - Metrics.doubleBaseMargin,
  },
  iHaveAccountTitle: {
    ...Fonts.style.mediumRegularText,
    color: Colors.snow,
  },
  loginTitle: {
    ...Fonts.style.mediumBoldText,
    color: Colors.snow,
  }
})
