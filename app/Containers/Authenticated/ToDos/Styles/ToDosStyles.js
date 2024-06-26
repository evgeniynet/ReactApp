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
    flexDirection: 'column',
  },
  todoRowContainer: {
    flexDirection: 'row',
  },
  leftIcon: {
    height: Metrics.doubleBaseMargin + 2,
    width: Metrics.doubleBaseMargin + 2,
    resizeMode: 'contain',
    marginLeft: Metrics.baseMargin + 4,
    marginRight: Metrics.baseMargin + 3,
    marginTop: Metrics.doubleBaseMargin - Metrics.smallMargin,
  },
  todoHeaderTitle: {
    ...Fonts.style.mediumText,
    color: Colors.secondary,
    fontSize: Fonts.size.medium + 1,
    marginRight: Metrics.baseMargin,
    flex: 1,
    margin: Metrics.doubleBaseMargin,
    marginBottom: Metrics.baseMargin,
  },
  ticketTitle: {
    ...Fonts.style.smalBoldTitle,
    color: Colors.mainPrimary,
    fontSize: Fonts.size.small + 1,
    marginRight: Metrics.baseMargin,
    flex: 1,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    marginBottom: Metrics.baseMargin,
  },
  ticketNameTitle: {
    ...Fonts.style.smallRegularTitle,
    color: Colors.mainPrimary,
    fontSize: Fonts.size.small + 1,
  },
  todoTitle: {
    ...Fonts.style.smallRegularTitle,
    color: Colors.textGray,
    fontSize: Fonts.size.small + 1,
    marginRight: Metrics.baseMargin,
    marginTop: Metrics.doubleBaseMargin - Metrics.smallMargin,
  },
  rightIcon: {
    height: Metrics.baseMargin + Metrics.smallMargin,
    width: Metrics.baseMargin + Metrics.smallMargin,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: Metrics.baseMargin + 3
  },
  toDoContainer: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center'
  },
  dateContainer: {
    marginTop: Metrics.smallMargin,
    marginRight: Metrics.doubleBaseMargin - Metrics.smallMargin,
    flexDirection: 'row',
  },
  dateText: {
    ...Fonts.style.smallRegularTitle,
    color: Colors.textTwo,
    flex: 1,
    textAlign: 'right'
  },
})
