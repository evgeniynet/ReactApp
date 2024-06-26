/* Imports */
import { StyleSheet, Platform } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../../../Themes'

/* Exporting style sheet */
export default StyleSheet.create({
  ...ApplicationStyles.screen,
  backgroundEmptyContainer: {
    backgroundColor: Colors.contentBg,
    position: 'absolute',
    height: Metrics.screenHeight * 0.5,
    left: 0,
    bottom: 0,
    right: 0
  },
  profilePicture: {
    marginTop: Metrics.doubleBaseMargin,
    alignSelf: 'center',
    width: Metrics.doubleSection + Metrics.baseMargin,
    height: Metrics.doubleSection + Metrics.baseMargin,
    resizeMode: 'cover',
    borderRadius: Metrics.section + Metrics.smallMargin,
  },
  userNameText: {
    alignSelf: 'center',
    marginTop: Metrics.baseMargin,
    marginBottom: Metrics.smallMargin,
    ...Fonts.style.mediumLargeTitle,
    fontSize: Fonts.size.large - 2,
    color: Colors.snow,
  },
  userEmailText: {
    alignSelf: 'center',
    ...Fonts.style.mediumRegularText,
    color: Colors.snow,
    marginBottom: Metrics.section + 7,
  },
  inputContainer: {
    borderRadius: Metrics.baseMargin,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    marginBottom: Metrics.doubleBaseMargin,
    paddingTop: Metrics.doubleBaseMargin - 3,
    paddingLeft: Metrics.doubleBaseMargin,
    paddingRight: Metrics.doubleBaseMargin,
    paddingBottom: Metrics.doubleBaseMargin - 3,
  },
  inputTitle: {
    flex: 1,
    ...Fonts.style.mediumText,
    color: Colors.text,
  },
  contentContainer: {
    backgroundColor: Colors.contentBg,
    borderTopLeftRadius: Metrics.doubleSection - Metrics.baseMargin,
    borderTopRightRadius: Metrics.doubleSection - Metrics.baseMargin,
    // height: 40,
    flex: 1,
    overflow: 'hidden',
  },
  flatListPadding: {
    paddingTop: Metrics.doubleBaseMargin + Metrics.baseMargin,
    backgroundColor: Colors.contentBg,
    paddingBottom: Metrics.doubleBaseMargin + Metrics.baseMargin,
  },
  rowContainer: {
    backgroundColor: Colors.contentBg,
  },
  titleText: {
    ...Fonts.style.smallRegularTitle,
    color: Colors.textTitle,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    marginBottom: Metrics.baseMargin,
  },
  reusableRowContainer: {
    flexDirection: "column",
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    marginBottom: Metrics.doubleBaseMargin,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    borderRadius: Metrics.baseMargin,
    shadowRadius: Metrics.baseMargin,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.5,
        shadowColor: Colors.shadow,
        shadowOffset: {
          width: 0,
          height: Metrics.baseMargin + 3
        },
      },
      android: {
        shadowColor: Colors.black30,
        elevation: Metrics.baseMargin + 3
      },
    }),
    backgroundColor: Colors.veryLightBlue,
  },
  queueContentContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
    // paddingBottom: Metrics.baseMargin,
    borderTopLeftRadius: Metrics.baseMargin,
    borderTopRightRadius: Metrics.baseMargin,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
  },
  queueTitleText: {
    ...Fonts.style.mediumText,
    color: Colors.text,
    flex: 1,
    marginTop: Metrics.doubleBaseMargin - 5,
    // marginLeft: Metrics.doubleBaseMargin,
    // marginRight: Metrics.doubleBaseMargin,
    marginBottom: Metrics.doubleBaseMargin - 5,
  },
  arrowIcon: {
    height: Metrics.doubleBaseMargin - 2,
    width: Metrics.doubleBaseMargin - 2,
    resizeMode: 'contain',
    alignSelf: 'center',
    // marginRight: Metrics.doubleBaseMargin,
    paddingBottom: Metrics.baseMargin,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: Colors.snow,
    height: Metrics.doubleSection,
    borderRadius: Metrics.baseMargin,
    width: '100%',
  },
  badgeTitleText: {
    flex: 1,
    height: Metrics.section,
    ...Fonts.style.mediumRegularText,
    fontSize: Fonts.size.medium + 1,
    color: Colors.softBlue,
    marginTop: Metrics.doubleBaseMargin - 3,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    marginBottom: Metrics.doubleBaseMargin - 3,
  },
  switchContainer: {
    marginRight: Metrics.doubleBaseMargin,
  },
  switchIcon: {
    height: Metrics.section - 1,
    width: Metrics.doubleSection + 1,
    resizeMode: 'contain',
  },
  footerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.contentBg,
    height: Metrics.doubleBaseMargin + Metrics.doubleBaseMargin,
  },
  buttonContainer: {
    marginTop: Metrics.baseMargin,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    marginBottom: Metrics.baseMargin,
    alignItems: 'center',
    justifyContent: 'center',
    height: Metrics.doubleSection - 6,
    borderRadius: Metrics.buttonRadius,
    backgroundColor: Colors.mainPrimary,
    height: Metrics.doubleSection,
  },
  buttonText: {
    ...Fonts.style.mediumBoldText,
    color: Colors.snow,
  },
  noteText: {
    ...Fonts.style.smallRegularTitle,
    fontSize: Fonts.size.small,
    color: Colors.textGray,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    marginBottom: Metrics.doubleBaseMargin,
    marginBottom: Platform.OS == 'ios' ? Metrics.doubleBaseMargin : Metrics.section,
  },
})