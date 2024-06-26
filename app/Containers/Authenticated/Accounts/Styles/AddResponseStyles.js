/* Imports */
import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../../../Themes'

/* Exporting style sheet */
export default StyleSheet.create({
  ...ApplicationStyles.screen,
  modelContainer: {
    flex: 1,
    margin: 0,
  },
  backgroundButton: {
    flex: 1,
    backgroundColor: Colors.black25,
    paddingBottom: 0,
  },
  topContainer: {
    backgroundColor: Colors.clear,
    borderTopLeftRadius: Metrics.doubleBaseMargin,
    borderTopRightRadius: Metrics.doubleBaseMargin,
    // height: 50,
    width: '100%',
    flex: 1,
    margin: 20,
    marginBottom: 0,
    alignItems: 'flex-start',
    flexDirection: 'column'
  },
  container: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: Colors.contentBg,
  },
  textViewConatiner: {
    margin: Metrics.doubleBaseMargin,
    padding: Metrics.baseMargin,
    marginTop: Metrics.baseMargin,
    backgroundColor: Colors.snow,
    borderRadius: Metrics.baseMargin,
    height: 126,
  },
  title: {
    ...Fonts.style.mediumRegularTitle,
    color: Colors.mainPrimary,
  },
  subTitle: {
    marginLeft: Metrics.doubleBaseMargin,
    ...Fonts.style.smallRegularTitle,
    color: Colors.textTitle,
  },
  textView: {
    flex: 1,
    ...Fonts.style.mediumRegularText,
    fontSize: Fonts.size.small + 1,
    color: Colors.black,
  },
  bottomContainer: {
    flexDirection: 'row',
    marginLeft: Metrics.baseMargin,
    marginRight: Metrics.baseMargin,
    marginBottom: Metrics.doubleBaseMargin,
  },
  buttonContainer: {
    marginTop: Metrics.baseMargin,
    marginLeft: Metrics.baseMargin,
    marginRight: Metrics.baseMargin,
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
})