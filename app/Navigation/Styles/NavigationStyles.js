/* Imports */
import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts } from '../../Themes'

/* Exporting style sheet */
export default StyleSheet.create({
  header: {
    backgroundColor: Colors.snow
  },
  container: {
    backgroundColor: Colors.snow,
    height: 44,
    flexDirection: 'row',
  },
  subContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  containerTransparent: {
    backgroundColor: Colors.clear,
    flexDirection: 'row',
    height: 44,
    zIndex: 1,
    alignItems: 'center',
    paddingRight: Metrics.baseMargin,
  },
  searchBarMainContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    width: Metrics.screenWidth - 120,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.searchBg,
    borderRadius: Metrics.doubleBaseMargin + 2,
    height: 42,
  },
  navLeftIcon: {
    width: 60,
    height: '100%',
    padding: Metrics.baseMargin,
    paddingLeft: Metrics.doubleBaseMargin,
  },
  rightIcon: {
    marginLeft: Metrics.smallMargin,
    height: '100%',
    padding: Metrics.baseMargin - 3,
  },
  rightBigIcon: {
    paddingRight: 0
  },
  searchInput: {
    textAlign: 'left',
    marginLeft: 0,
    backgroundColor: Colors.clear,
    ...Fonts.style.mediumText,
    color: Colors.snow,
    height: 40,
    paddingLeft: Metrics.doubleBaseMargin + 2,
    paddingRight: Metrics.doubleBaseMargin + 2,
  },
  searchIcon: {
    left: Metrics.baseMargin,
    alignSelf: 'center',
    color: '#8E8E93',
    backgroundColor: Colors.clear
  },
  imageStyle: {
    width: Metrics.section,
    height: Metrics.section,
    resizeMode: 'contain',
  },
  bigImageStyle: {
    marginTop: Metrics.smallMargin,
    width: 82,
    height: Metrics.section,
    resizeMode: 'contain',
  },
  titleTextStyle: {
    flex: 1,
    backgroundColor: Colors.clear,
    alignSelf: 'center',
    ...Fonts.style.mediumRegularTitle,
    color: Colors.black,
  },
  buttonInfoContainer: {
    paddingLeft: Metrics.baseMargin,
    paddingRight: Metrics.baseMargin,
  },
  titleTextWithButtonStyle: {
    flexShrink: 1,
    backgroundColor: Colors.clear,
    alignSelf: 'center',
    ...Fonts.style.mediumRegularTitle,
    color: Colors.snow,
  },
  searchTitleTextStyle: {
    marginTop: -2,
  },
  clearText: {
    height: Metrics.section,
    width: Metrics.section,
  },
})
