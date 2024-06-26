/* Imports */
import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Fonts, Colors } from '../../../Themes'

/* Exporting style sheet */
export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    // marginTop: Metrics.doubleBaseMargin, 
    marginLeft: Metrics.section,
    marginRight: Metrics.section
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: Metrics.smallMargin,
  },
  profilePicture: {
    height: Metrics.doubleSection + Metrics.baseMargin,
    width: Metrics.doubleSection + Metrics.baseMargin,
    resizeMode: 'cover',
    borderRadius: Metrics.doubleBaseMargin + Metrics.baseMargin
  },
  urlContainer: {
    flexDirection: 'row',
    marginTop: Metrics.section,
  },
  urlInputTitle: {
    alignSelf: 'center',
    ...Fonts.style.smallRegularTitle,
    color: Colors.textTwo,
  },
  inputTitle: {
    margin: Metrics.baseMargin - 2,
    marginTop: Metrics.section,
    ...Fonts.style.smallRegularTitle,
    color: Colors.textTwo,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputInactive: {
    borderColor: Colors.border,
  },
  inputActive: {
    borderColor: Colors.mainPrimary,
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
    color: Colors.textTwo
  },
  signUpButtonContainer: {
    marginTop: Metrics.section + Metrics.smallMargin,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: Metrics.doubleSection - 6,
    borderRadius: Metrics.buttonRadius,
    backgroundColor: Colors.mainPrimary,
  },
  signUpButtonText: {
    ...Fonts.style.mediumBoldText,
    color: Colors.snow,
  },
  loginAccountContainer: {
    marginTop: Metrics.section + Metrics.smallMargin,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.clear,
    marginBottom: Metrics.doubleSection - Metrics.doubleBaseMargin,
    height: Metrics.doubleSection - Metrics.doubleBaseMargin,
  },
  iHaveAccountTitle: {
    ...Fonts.style.mediumRegularText,
    color: Colors.textTwo,
  },
  loginTitle: {
    ...Fonts.style.mediumBoldText,
    color: Colors.textTwo,
  },
  termsOfUseContainer: {
    marginTop: Metrics.doubleBaseMargin,

    flexDirection: 'row'
  },
  iAgreeBtnContainer: {
    flexDirection: 'row'
  },
  tickUntickIcon: {
    height: Metrics.doubleBaseMargin - 2,
    width: Metrics.doubleBaseMargin - 2,
    resizeMode: 'contain',
    marginRight: Metrics.doubleBaseMargin - 3
  }
})
