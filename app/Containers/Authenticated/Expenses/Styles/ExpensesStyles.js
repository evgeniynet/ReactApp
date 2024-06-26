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
  reusableRowContainer: {
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    marginBottom: Metrics.doubleBaseMargin,
    paddingTop: Metrics.doubleBaseMargin,
    paddingLeft: Metrics.doubleBaseMargin,
    paddingRight: Metrics.doubleBaseMargin,
    paddingBottom: Metrics.doubleBaseMargin,
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
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start'
  },
  nameAndPriceContainer: {
    flexDirection: 'row',
  },
  nameText: {
    flex: 1,
    marginRight: Metrics.baseMargin,
    ...Fonts.style.mediumText,
    fontSize: Fonts.size.regular + 1,
    color: Colors.mainPrimary,
    marginBottom: Metrics.smallMargin,
  },
  categoryText: {
    flex: 1,
    marginRight: Metrics.baseMargin,
    ...Fonts.style.mediumText,
    // fontSize: Fonts.size.large,
    // color: Colors.textGray,
    fontSize: Fonts.size.regular + 1,
    color: Colors.secondary,
    marginBottom: Metrics.smallMargin,
  },
  ticketText: {
    flex: 1,
    marginRight: Metrics.baseMargin,
    ...Fonts.style.mediumText,
    fontSize: Fonts.size.mediumText,
    color: Colors.mainPrimary,
    marginBottom: Metrics.smallMargin,
    marginTop: Metrics.baseMargin + Metrics.smallMargin,
  },
  priceText: {
    ...Fonts.style.mediumLargeTitle,
    // fontSize: Fonts.size.medium + 1,
    color: Colors.secondary,
  },
  gridCenterContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: Metrics.baseMargin ,
    justifyContent: 'space-around',
  },
  itemCenterContainer: {
    // flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flex: 1,
    marginTop: Metrics.baseMargin + Metrics.smallMargin,
  },
  itemContainer: {
    flex: 1,
  },
  valueText: {
    ...Fonts.style.smallMediumTitle,
    fontSize: Fonts.size.small + 1,
    color: Colors.softBlue,
  },
  titleText: {
    marginTop: Metrics.smallMargin,
    ...Fonts.style.smallRegularTitle,
    fontSize: Fonts.size.small + 1,
    color: Colors.textGray,
  },
  descriptionText: {
    // marginTop: Metrics.baseMargin + Metrics.smallMargin,
    ...Fonts.style.smallRegularTitle,
    fontSize: Fonts.size.small + 1,
    color: Colors.textGray,
    marginBottom: Metrics.smallMargin,
  },
  dateContainer: {
    marginTop: Metrics.baseMargin + Metrics.smallMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  dateText: {
    ...Fonts.style.smallRegularTitle,
    color: Colors.textTwo,
  },
})
