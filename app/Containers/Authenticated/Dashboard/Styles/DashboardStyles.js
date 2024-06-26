/* Imports */
import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../../../Themes'

/* Exporting style sheet */
export default StyleSheet.create({
  ...ApplicationStyles.screen,
  topContainer: {
    alignItems: 'center',
    padding: Metrics.doubleBaseMargin,
    paddingTop: Metrics.baseMargin,
    paddingLeft: Metrics.baseMargin,
    paddingRight: Metrics.baseMargin,
  },
  todayText: {
    ...Fonts.style.mediumRegularTitle,
    fontSize: Fonts.size.regular - 1,
    color: Colors.snow,
  },
  hoursContainer: {
    paddingTop: Metrics.doubleBaseMargin + 3,
    paddingBottom: Metrics.baseMargin - 8,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center'
  },
  hoursTitle: {
    ...Fonts.style.smallMediumTitle,
    color: Colors.snow,
    marginLeft: Metrics.section,
    marginRight: Metrics.section,
  },
  hoursText: {
    ...Fonts.style.smalBoldTitle,
    color: Colors.snow,
  },
  contentContainer: {
    marginTop: Metrics.doubleSection + Metrics.baseMargin,
    backgroundColor: Colors.contentBg,
    borderTopLeftRadius: Metrics.doubleSection - Metrics.baseMargin,
    borderTopRightRadius: Metrics.doubleSection - Metrics.baseMargin,
    flex: 1,
  },
  quickHeaderContainer: {
    ...Platform.select({
      ios: {
        marginTop: -(Metrics.doubleSection + Metrics.baseMargin),
      },
      android: {
        marginTop: -(Metrics.baseMargin+18),
      },
    }),
    // marginBottom: Metrics.baseMargin,
    minHeight: 50,
  },
  flatListQuickPadding: {
    paddingLeft: Metrics.baseMargin + 3,
    paddingRight: Metrics.baseMargin + 3,
    // flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
  },
  quickHeaderItemContainer: {
    borderRadius: 40, //36
    height: 115, //105
    width: 82, //72
    backgroundColor: Colors.mainPrimary,
    flexDirection: 'column',
    paddingTop: Metrics.baseMargin,
    paddingLeft: Metrics.baseMargin,
    paddingRight: Metrics.baseMargin,
    paddingBottom: Metrics.doubleBaseMargin,
    marginLeft: Metrics.baseMargin - 3,
    marginRight: Metrics.baseMargin - 3,
  },
  quickHeaderCountContainer: {
    height: Metrics.doubleSection + 10,
    width: Metrics.doubleSection + 10,
    backgroundColor: Colors.snow,
    borderRadius: Metrics.section + 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  quickHeaderTitleCont: {
    ...Fonts.style.mediumLargeTitle,
    color: Colors.textTwo,
  },
  quickHeaderTitle: {
    paddingTop: Metrics.baseMargin,
    ...Fonts.style.smallMediumTitle,
    color: Colors.snow,
  },
  flatListDataPadding: {
    paddingTop: Metrics.doubleBaseMargin,
    paddingBottom: Metrics.doubleBaseMargin + Metrics.baseMargin,
  },
  reusableRowContainer: {
    borderRadius: Metrics.baseMargin,
    marginTop: Metrics.baseMargin,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    marginBottom: Metrics.baseMargin,
    backgroundColor: Colors.snow,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    flexDirection: 'column'
  },
  reusableTitleButton: {
    width: '100%',
    alignItems: 'center',
  },
  reusableRowTitle: {
    ...Fonts.style.smallMediumTitle,
    color: Colors.textTwo,
    margin: Metrics.baseMargin,
    marginTop: Metrics.baseMargin + Metrics.smallMargin,
    flex: 1,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.secondary,
    opacity: 0.10
  },
  subListContainer: {
    flex: 1,
    width: '100%'
  },
  todoRowContainer: {
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
  },
  eventHeaderTitle: {
    ...Fonts.style.mediumText,
    color: Colors.secondary,
    fontSize: Fonts.size.medium + 1,
    flex: 1,
    margin: Metrics.doubleBaseMargin,
    marginTop: Metrics.baseMargin + Metrics.smallMargin,
    marginBottom: Metrics.baseMargin,
  },
  eventRowContainer: {
    borderRadius: Metrics.baseMargin,
    marginTop: Metrics.baseMargin,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    marginBottom: Metrics.baseMargin,
    backgroundColor: Colors.snow,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  eventContainer: {
    flex: 1,
    marginTop: Metrics.baseMargin,
    marginLeft: Metrics.doubleBaseMargin - Metrics.smallMargin,
    marginRight: Metrics.smallMargin,
    marginBottom: Metrics.baseMargin,
  },
  eventDateContainer: {
    flexDirection: 'row',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    height: Metrics.doubleBaseMargin,
    width: Metrics.doubleBaseMargin,
    resizeMode: 'contain',
    marginRight: Metrics.smallMargin,
  },
  eventDateTitleText: {
    ...Fonts.style.smallRegularTitle,
    fontSize: Fonts.size.small + 1,
    color: Colors.textGray,
  },
  eventDateText: {
    marginTop: Metrics.smallMargin,
    ...Fonts.style.smallRegularTitle,
    color: Colors.textTwo,
  },
  leftIcon: {
    height: Metrics.doubleBaseMargin + 2,
    width: Metrics.doubleBaseMargin + 2,
    resizeMode: 'contain',
    marginLeft: Metrics.baseMargin + 4,
    marginRight: Metrics.baseMargin + 3,
    marginTop: Metrics.baseMargin + Metrics.smallMargin + 1,
    marginBottom: Metrics.baseMargin + 2,
  },
  todoTitle: {
    ...Fonts.style.mediumRegularText,
    color: Colors.textTwo,
    marginRight: Metrics.baseMargin,
    flex: 1,
    alignSelf: 'center',
    marginTop: Metrics.doubleBaseMargin,
    marginBottom: Metrics.baseMargin + 3,
  },
  rightIcon: {
    height: Metrics.baseMargin + Metrics.smallMargin,
    width: Metrics.baseMargin + Metrics.smallMargin,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: Metrics.baseMargin + 3
  },
  eventTitle: {
    ...Fonts.style.mediumText,
    color: Colors.secondary,
    marginLeft: Metrics.baseMargin + Metrics.smallMargin,
    marginTop: Metrics.baseMargin,
    marginRight: Metrics.doubleBaseMargin,
    flex: 1
  },
  eventNameText: {
    ...Fonts.style.mediumText,
    marginLeft: Metrics.baseMargin + Metrics.smallMargin,
    marginTop: Metrics.smallMargin,
    marginRight: Metrics.doubleBaseMargin,
    marginBottom: -Metrics.smallMargin,
    flex: 1,
    color: Colors.mainPrimary,
  },
  seeAll: {
    ...Fonts.style.mediumText,
    color: Colors.mainPrimary,
    alignSelf: 'flex-end',
    marginLeft: Metrics.baseMargin + Metrics.smallMargin,
    marginRight: Metrics.doubleBaseMargin,
    marginBottom: Metrics.doubleBaseMargin - Metrics.smallMargin,
    flex: 1
  },
  quickFooterContainer: {
    paddingTop: Metrics.baseMargin,
    paddingBottom: Metrics.baseMargin,
    paddingLeft: Metrics.doubleBaseMargin,
    paddingRight: Metrics.doubleBaseMargin,
    backgroundColor: Colors.clear,
  },
  quickFooterCountContainer: {
    borderRadius: Metrics.baseMargin,
    backgroundColor: Colors.mainPrimary,
    height: Metrics.doubleSection,
    width: Metrics.doubleSection,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickFooterTitleContainer: {
    backgroundColor: Colors.snow,
    height: Metrics.doubleSection,
    marginLeft: Metrics.baseMargin,
    borderRadius: Metrics.baseMargin,
    justifyContent: 'center',
    padding: Metrics.baseMargin,
    paddingLeft: Metrics.doubleBaseMargin + 3,
    flex: 1
  },
  quickFooterTitleCont: {
    ...Fonts.style.mediumText,
    color: Colors.snow,
  },
  quickFooterTitle: {
    ...Fonts.style.smallMediumTitle,
    color: Colors.textTwo,
  },

  reusableRowContainerToDos: {
    borderRadius: Metrics.baseMargin,
    marginTop: Metrics.baseMargin,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    marginBottom: Metrics.baseMargin,
    backgroundColor: Colors.snow,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: Metrics.doubleBaseMargin - Metrics.smallMargin,
    flexDirection: 'column'
  },
  todoRowContainerToDos: {
    flexDirection: 'row',
  },
  leftIconToDos: {
    height: Metrics.doubleBaseMargin + 2,
    width: Metrics.doubleBaseMargin + 2,
    resizeMode: 'contain',
    marginLeft: Metrics.baseMargin + 4,
    marginRight: Metrics.baseMargin + 3,
    marginTop: Metrics.doubleBaseMargin - Metrics.smallMargin,
  },
  todoHeaderTitleToDos: {
    ...Fonts.style.mediumText,
    color: Colors.secondary,
    fontSize: Fonts.size.medium + 1,
    marginRight: Metrics.baseMargin,
    flex: 1,
    margin: Metrics.doubleBaseMargin,
    marginTop: 0,
    marginBottom: Metrics.baseMargin,
  },
  ticketTitleToDos: {
    ...Fonts.style.smalBoldTitle,
    color: Colors.mainPrimary,
    fontSize: Fonts.size.small + 1,
    marginRight: Metrics.baseMargin,
    flex: 1,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    marginBottom: Metrics.baseMargin,
  },
  ticketNameTitleToDos: {
    ...Fonts.style.smallRegularTitle,
    color: Colors.mainPrimary,
    fontSize: Fonts.size.small + 1,
  },
  todoTitleToDos: {
    ...Fonts.style.smallRegularTitle,
    color: Colors.textGray,
    fontSize: Fonts.size.small + 1,
    marginRight: Metrics.baseMargin,
    marginTop: Metrics.doubleBaseMargin - Metrics.smallMargin,
  },
  rightIconToDos: {
    height: Metrics.baseMargin + Metrics.smallMargin,
    width: Metrics.baseMargin + Metrics.smallMargin,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: Metrics.baseMargin + 3
  },
  toDoContainerToDos: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center'
  },
  dateContainerToDos: {
    marginTop: Metrics.smallMargin,
    marginRight: Metrics.doubleBaseMargin - Metrics.smallMargin,
    flexDirection: 'row',
  },
  dateTextToDos: {
    ...Fonts.style.smallRegularTitle,
    color: Colors.textTwo,
    flex: 1,
    textAlign: 'right'
  },
})
