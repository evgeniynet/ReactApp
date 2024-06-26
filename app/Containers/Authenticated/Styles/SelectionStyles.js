/* Imports */
import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../../Themes'

/* Exporting class */
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
    backgroundColor: Colors.clear,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
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
    // maxHeight: Metrics.screenHeight * 0.6,
    // height: '100%',
    flex: 1,
    alignSelf: 'flex-end',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: Colors.contentBg,
    marginTop: 50
  },
  flatListContainer: {
    paddingTop: Metrics.doubleBaseMargin,
    paddingBottom: Metrics.doubleBaseMargin,
  },
  rowContainer: {
    borderRadius: 8,
    paddingTop: Metrics.baseMargin + 1,
    paddingLeft: Metrics.doubleBaseMargin,
    paddingRight: Metrics.doubleBaseMargin,
    paddingBottom: Metrics.baseMargin + 1,
    backgroundColor: Colors.contentBg
  },
  titleContainer: {
    flexDirection: 'row',
    marginLeft: 0,
    marginRight: 0,
  },
  slectionIcon: {
    height: Metrics.doubleBaseMargin + 2,
    width: Metrics.doubleBaseMargin + 2,
    resizeMode: 'contain',
    marginRight: Metrics.baseMargin + 3,
    alignSelf: 'center'
  },
  title: {
    ...Fonts.style.mediumText,
    color: Colors.softBlue,
    alignSelf: 'center'
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
  searchContainer: {
    flexDirection: 'row',
    marginTop: Metrics.baseMargin,
    height: Metrics.doubleSection,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    alignItems: 'center',
    borderRadius: Metrics.baseMargin,
    backgroundColor: Colors.snow,
    paddingRight: Metrics.doubleBaseMargin - 5,
  },
  searchInput: {
    paddingLeft: Metrics.doubleBaseMargin,
    paddingRight: Metrics.baseMargin,
    flex: 1,
    backgroundColor: Colors.clear,
    ...Fonts.style.mediumRegularText,
    color: Colors.black,
  },
  searchRightIcon: {
    marginLeft: Metrics.smallMargin,
    height: '100%',
    padding: Metrics.baseMargin - 3,
    paddingTop: Metrics.baseMargin + 2,
  },
  clearText: {
    height: Metrics.section,
    width: Metrics.section,
  },
  buttonContainer: {
    marginTop: Metrics.baseMargin,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    // flex: 1,
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