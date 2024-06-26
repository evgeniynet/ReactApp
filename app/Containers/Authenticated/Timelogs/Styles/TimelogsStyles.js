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
  flatListPadding: {
    paddingTop: Metrics.doubleBaseMargin,
    paddingBottom: Metrics.doubleBaseMargin + Metrics.baseMargin,
  },
  reusableRowContainer: {
    flexDirection: "column",
    marginTop: Metrics.doubleBaseMargin,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    paddingTop: 0,
    paddingLeft: Metrics.doubleBaseMargin,
    paddingRight: Metrics.doubleBaseMargin,
    paddingBottom: Metrics.doubleBaseMargin + 3,
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
    alignItems: 'flex-start'
  },
  topContentContainer: {
    flexDirection: "row",
    width: '100%',
    justifyContent: 'space-between',
  },
  workingHoursContainer: {
    flexDirection: "row",
    // marginLeft: Metrics.baseMargin,
    // marginRight: Metrics.baseMargin,
    marginTop: Metrics.doubleBaseMargin - 4,
    alignItems: 'center',
    flex: 1
  },
  hoursContainer: {
    flexDirection: "row",
    alignItems: 'center',
  },
  workingHoursTitleText: {
    ...Fonts.style.mediumRegularTitle,
    color: Colors.secondary,
    marginLeft: Metrics.smallMargin,
    // marginRight: Metrics.baseMargin,
  },
  profileContainer: {
    marginTop: -(Metrics.doubleBaseMargin - Metrics.smallMargin),
    marginBottom: Metrics.smallMargin + 2,
  },
  profilePicture: {
    width: Metrics.doubleSection,
    height: Metrics.doubleSection,
    resizeMode: 'cover',
    borderRadius: Metrics.section,
  },
  dateTitle: {
    ...Fonts.style.smallRegularTitle,
    fontSize: Fonts.size.small + 1,
    color: Colors.textGray,
    color: Colors.secondary,
    // alignSelf: 'flex-end',
    marginLeft: Metrics.baseMargin,
    marginRight: Metrics.baseMargin,
  },
  titleText: {
    ...Fonts.style.smallRegularTitle,
    fontSize: Fonts.size.small + 1,
    color: Colors.textGray,
    textAlign: 'right',
    flex: 1,
  },
  noteText: {
    ...Fonts.style.smallRegularTitle,
    fontSize: Fonts.size.small + 1,
    color: Colors.textGray,
    marginTop: Metrics.smallMargin,
  },
  accountTitleText: {
    ...Fonts.style.mediumRegularText,
    fontSize: Fonts.size.regular + 1,
    color: Colors.mainPrimary,
    marginTop: Metrics.smallMargin,
  },
  ticketContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Metrics.doubleBaseMargin,
    marginBottom: Metrics.baseMargin - 2,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.secondary,
    opacity: 0.10,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  ticketNuberText: {
    paddingLeft: Metrics.smallMargin + 1,
    paddingRight: Metrics.smallMargin + 1,
    marginLeft: Metrics.section,
    marginRight: Metrics.section,
    marginTop: -2,
    ...Fonts.style.mediumText,
    fontSize: Fonts.size.mediumText,
    color: Colors.mainPrimary,
    backgroundColor: Colors.snow,
  },
  ticketTitleText: {
    ...Fonts.style.smallRegularTitle,
    fontSize: Fonts.size.small + 1,
    color: Colors.mainPrimary,
  },
  contractContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    width: Metrics.doubleBaseMargin - 2,
    height: Metrics.doubleBaseMargin - 2,
    resizeMode: 'contain',
  },
  contractTitleText: {
    ...Fonts.style.smallRegularTitle,
    // fontSize: Fonts.size.small + 1,
    // color: Colors.textTwo,
    fontSize: Fonts.size.regular + 1,
    color: Colors.secondary,
    marginTop: Metrics.smallMargin,
    // marginRight: Metrics.baseMargin,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Metrics.baseMargin ,
  },
  dateIcon: {
    height: Metrics.doubleBaseMargin,
    width: Metrics.doubleBaseMargin,
    resizeMode: 'contain',
    marginRight: Metrics.smallMargin,
  },
  dateText: {
    ...Fonts.style.smallRegularTitle,
    color: Colors.textTwo,
  },
})
