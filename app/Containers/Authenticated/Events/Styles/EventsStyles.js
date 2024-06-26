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
    fontSize: Fonts.size.large,
    color: Colors.textGray,
    marginBottom: Metrics.smallMargin,
  },
  ticketText: {
    marginTop: Metrics.baseMargin + Metrics.smallMargin,
    flex: 1,
    marginRight: Metrics.baseMargin,
    ...Fonts.style.mediumText,
    fontSize: Fonts.size.mediumText,
    color: Colors.mainPrimary,
    marginBottom: Metrics.smallMargin,
  },
  titleNameText: {
    ...Fonts.style.mediumText,
    fontSize: Fonts.size.regular + 1,
    color: Colors.secondary,
    marginBottom: Metrics.smallMargin,
  },
  gridContainer: {
    flexDirection: 'row',
    flex: 1,
    marginTop: Metrics.baseMargin + Metrics.smallMargin,
  },
  itemContainer: {
    flex: 1
  },
  valueText: {
    ...Fonts.style.smallMediumTitle,
    fontSize: Fonts.size.small + 1,
    color: Colors.softBlue,
  },
  titleText: {
    marginBottom: Metrics.smallMargin,
    ...Fonts.style.smallRegularTitle,
    fontSize: Fonts.size.small + 1,
    color: Colors.textGray,
  },
  descriptionText: {
    ...Fonts.style.smallRegularTitle,
    fontSize: Fonts.size.small + 1,
    color: Colors.textGray,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dateIcon: {
    height: Metrics.doubleBaseMargin,
    width: Metrics.doubleBaseMargin,
    resizeMode: 'contain',
    marginRight: Metrics.smallMargin,
  },
  dateText: {
    marginTop: Metrics.smallMargin,
    ...Fonts.style.smallRegularTitle,
    color: Colors.textTwo,
  },
})
