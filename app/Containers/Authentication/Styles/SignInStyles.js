/* Imports */
import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Fonts, Colors } from '../../../Themes'

/* Exporting style sheet */
export default StyleSheet.create({
  ...ApplicationStyles.screen,

  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  logoMainContainer: {
    backgroundColor: Colors.clear,
    justifyContent: 'flex-end',
    minHeight: Metrics.screenHeight / 2,
  },
  emptyTopDivider: {
    flexGrow: 1,
    minHeight: Metrics.doubleSection - 6,
    backgroundColor: Colors.clear
  },
  logoContainer: {
    backgroundColor: Colors.snow,
    marginTop: (-Metrics.doubleBaseMargin),
    alignItems: 'center',
    flexDirection: 'column',
  },
  welcomeTitle: {
    textAlign: 'center',
    color: Colors.black,
    ...Fonts.style.mediumRegularTitle,
    marginBottom: -Metrics.baseMargin
  },
  logo: {
    height: Metrics.screenWidth * 0.17,
    width: Metrics.screenWidth * 0.67,
    resizeMode: 'contain',
  },
  socialSignInContainer: {
    marginTop: Metrics.doubleSection + Metrics.doubleBaseMargin,
    marginBottom: Metrics.doubleBaseMargin + Metrics.baseMargin,
    justifyContent: 'flex-end',
  },
  socialSignInButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialIcon: {
    height: Metrics.doubleBaseMargin + Metrics.doubleBaseMargin,
    width: Metrics.doubleBaseMargin + Metrics.doubleBaseMargin,
    resizeMode: 'contain',
    marginRight: Metrics.baseMargin + 1,
    marginLeft: Metrics.baseMargin + 1
  },
  loginSpratorContainer: {
    marginTop: Metrics.section + 3,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    opacity: 0.7,
  },
  sprator: {
    height: 2,
    minWidth: 54,
    backgroundColor: Colors.sprator
  },
  spratorTitle: {
    color: Colors.textTwo,
    ...Fonts.style.smallMediumTitle,
  },
  loginMainContainer: {
    minHeight: Metrics.screenHeight / 2,
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.clear,
    height: Metrics.doubleSection,
    justifyContent: 'center'
  },
  forgotPasswordTitle: {
    ...Fonts.style.mediumRegularText,
    color: Colors.snow,
  },
  loginButtonContainer: {
    marginTop: Metrics.baseMargin + 3,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: Metrics.doubleSection - 6,
    borderRadius: Metrics.buttonRadius,
    backgroundColor: Colors.mainPrimary,
  },
  loginButtonText: {
    ...Fonts.style.mediumBoldText,
    color: Colors.snow,
  },
  createAccountContainer: {
    marginTop: Metrics.section,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.clear,
    marginBottom: Metrics.doubleSection - Metrics.doubleBaseMargin,
    height: Metrics.doubleSection - Metrics.doubleBaseMargin,
  },
  dontHaveAccountTitle: {
    ...Fonts.style.mediumRegularText,
    color: Colors.snow,
  },
  createAccountTitle: {
    ...Fonts.style.mediumBoldText,
    color: Colors.snow,
  },
  appVersion: {
    textAlign: 'center',
    color: Colors.snow,
    ...Fonts.style.smallRegularTitle,
    opacity: 0.5,
    bottom: 20
  },
})
