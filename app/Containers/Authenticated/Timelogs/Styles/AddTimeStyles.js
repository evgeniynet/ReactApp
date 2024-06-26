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
  topContainer: {
    backgroundColor: Colors.clear,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    marginBottom: Metrics.doubleSection,
    alignItems: 'center',
    borderRadius: Metrics.baseMargin,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: Metrics.section,
    right: 0,
    width: '100%',
    // height: '100%',
    resizeMode: 'cover',
    borderRadius: Metrics.baseMargin,
  },
  buttonDateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
  },
  dateText: {
    ...Fonts.style.mediumRegularText,
    color: Colors.snow,
    fontSize: Fonts.size.regular + 1,
  },
  timeText: {
    ...Fonts.style.mediumBoldText,
    color: Colors.snow,
    fontSize: 54,
  },
  buttonStartStopContainer: {
    marginTop: Metrics.baseMargin,
    height: Metrics.doubleSection,
    // marginBottom: 0,
    backgroundColor: Colors.mainPrimary,
    width: 133,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Metrics.baseMargin
  },
  buttonStartStopText: {
    ...Fonts.style.mediumText,
    color: Colors.snow,
  },
  buttonResetContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    padding: Metrics.baseMargin,
    marginBottom: Metrics.section
  },
  resetIcon: {
    height: Metrics.section + Metrics.smallMargin,
    width: Metrics.section + Metrics.smallMargin,
    resizeMode: 'contain'
  },
  multifieldContainer: {
    flexDirection: 'row',
    flex: 1,
    paddingLeft: Metrics.baseMargin,
    paddingRight: Metrics.baseMargin,
  },
  filedContainer: {
    alignItems: 'center',
    flex: 1,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  buttonAddMinusContainer: {
    padding: Metrics.baseMargin,
    marginBottom: Metrics.doubleBaseMargin,
  },
  buttonAddMinusIcon: {
    height: Metrics.section + 1,
    width: Metrics.section + 1,
    resizeMode: 'contain',
  },
  hoursInput: {
    marginLeft: 0,
    marginRight: 0,
    paddingLeft: 0,
    paddingRight: 0,
    flex: 1
  },
  inputContainer: {
    borderRadius: Metrics.baseMargin,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    marginBottom: Metrics.doubleBaseMargin,
    paddingTop: 0,
    paddingLeft: Metrics.doubleBaseMargin,
    paddingRight: Metrics.doubleBaseMargin,
    paddingBottom: 0,
    height: Metrics.doubleSection,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputTitle: {
    ...Fonts.style.smallRegularTitle,
    color: Colors.textTitle,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    marginBottom: Metrics.baseMargin,
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
  buttonContainer: {
    marginTop: Metrics.baseMargin,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: Metrics.doubleSection - 6,
    borderRadius: Metrics.buttonRadius,
    backgroundColor: Colors.mainPrimary,
  },
  buttonText: {
    ...Fonts.style.mediumBoldText,
    color: Colors.snow,
  },
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