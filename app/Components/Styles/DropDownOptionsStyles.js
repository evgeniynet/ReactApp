/* Imports */
import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../Themes'

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
  closeButtonContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Metrics.doubleBaseMargin,
    borderTopRightRadius: Metrics.doubleBaseMargin,
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',

  },
  closeButtonIcon: {
    height: Metrics.doubleBaseMargin + 10,
    width: Metrics.doubleBaseMargin + 10,
    marginTop: Metrics.baseMargin,
    marginRight: Metrics.doubleBaseMargin,
    resizeMode: 'contain'
  },
  container: {
    maxHeight: Metrics.screenHeight * 0.6,
    flex: 1,
    alignSelf: 'flex-end',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: Colors.snow,
  },
  flatListContainer: {
    paddingBottom: Metrics.doubleBaseMargin,
  },
  rowContainer: {
    borderRadius: 8,
    paddingTop: Metrics.baseMargin,
    paddingLeft: Metrics.doubleBaseMargin,
    paddingRight: Metrics.doubleBaseMargin,
    paddingBottom: Metrics.baseMargin,
  },
  title: {
    ...Fonts.style.mediumText,
    color: Colors.softBlue,
  },
  selected: {
    ...Fonts.style.mediumText,
    fontSize: Fonts.size.medium + 3,
    color: Colors.mainPrimary,
  },
  listTitle: {
    ...Fonts.style.mediumRegularTitle,
    color: Colors.mainPrimary,
    paddingTop: Metrics.baseMargin-10,
    paddingBottom: Metrics.baseMargin-10,
    paddingLeft: Metrics.doubleBaseMargin,
    paddingRight: Metrics.doubleBaseMargin,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // height: Metrics.screenHeight*0.4,
    flex: 1,
    // flexDirection: 'column',
  },
  logo: {
    height: Metrics.screenWidth * 0.17,
    width: Metrics.screenWidth * 0.67,
    resizeMode: 'contain',
  },
  switchOrgIcon: {
    marginTop: Metrics.doubleBaseMargin,
    marginBottom: Metrics.doubleSection,
    height: Metrics.doubleBaseMargin + Metrics.baseMargin,
    width: Metrics.doubleBaseMargin + Metrics.baseMargin,
    resizeMode: 'contain',
  },
  titleDarkBg: {
    ...Fonts.style.mediumRegularText,
    color: Colors.snow75,
    fontSize: Fonts.size.medium + 3,
  },
  selectedDarkBg: {
    ...Fonts.style.mediumBoldText,
    fontSize: Fonts.size.medium + 3,
    color: Colors.snow,
  },
})