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
    overflow: 'hidden',
  },
  multifieldContainer: {
    flexDirection: 'row',
    flex: 1,
    paddingLeft: Metrics.baseMargin,
    paddingRight: Metrics.baseMargin,
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