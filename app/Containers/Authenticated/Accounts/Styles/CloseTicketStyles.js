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
  inputContainer: {
    borderRadius: Metrics.baseMargin,
    // marginLeft: Metrics.doubleBaseMargin,
    // marginRight: Metrics.doubleBaseMargin,
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
    // marginLeft: Metrics.doubleBaseMargin,
    // marginRight: Metrics.doubleBaseMargin,
    marginBottom: Metrics.baseMargin,
  },
  input: {
    ...Fonts.style.mediumText,
    color: Colors.text,
  },
  textErrorColor: {
    color: Colors.placeholderError
  },
  buttonContainer: {
    marginTop: Metrics.baseMargin,
    // marginLeft: Metrics.doubleBaseMargin,
    // marginRight: Metrics.doubleBaseMargin,
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
  rowContainer: {
    paddingTop: Metrics.smallMargin,
    paddingLeft: Metrics.baseMargin,
    paddingRight: Metrics.smallMargin,
    paddingBottom: Metrics.smallMargin,

    marginTop: Metrics.smallMargin,
    marginBottom: Metrics.smallMargin,
    marginLeft: 0,
    marginRight: Metrics.baseMargin,
    backgroundColor: Colors.mainPrimary,
    borderRadius: Metrics.smallMargin + 1,
    overflow: 'hidden',
    maxWidth: '50%',
  },
  flatListContainer: {
    paddingTop: Metrics.doubleBaseMargin + Metrics.baseMargin,
    paddingBottom: Metrics.doubleBaseMargin,
    paddingLeft: Metrics.doubleBaseMargin,
    paddingRight: Metrics.doubleBaseMargin,
  },
  closeIcon: {
    height: Metrics.doubleBaseMargin,
    width: Metrics.doubleBaseMargin,
    resizeMode: 'contain',
  },
  titleText: {
    ...Fonts.style.mediumText,
    color: Colors.snow,
    fontSize: Fonts.size.medium - 1,
    flexShrink: 1,
  }
})
