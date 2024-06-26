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
    paddingTop: Metrics.doubleBaseMargin + Metrics.baseMargin,
    paddingBottom: Metrics.doubleBaseMargin + Metrics.baseMargin,
  },
  reusableRowContainer: {
    flexDirection: "column",
    marginBottom: Metrics.doubleBaseMargin,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    paddingTop: Metrics.doubleBaseMargin - Metrics.smallMargin,
    paddingLeft: Metrics.doubleBaseMargin - Metrics.smallMargin,
    paddingRight: Metrics.doubleBaseMargin - Metrics.smallMargin,
    paddingBottom: Metrics.doubleBaseMargin - Metrics.smallMargin,
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
  ticketNumberText: {
    ...Fonts.style.mediumText,
    fontSize: Fonts.size.medium + 1,
    color: Colors.mainPrimary,
  },
  titleText: {
    marginTop: Metrics.smallMargin,
    marginBottom: Metrics.smallMargin,
    ...Fonts.style.mediumRegularTitle,
    color: Colors.secondary,
  },
  ticketDescriptionText: {
    ...Fonts.style.smallRegularTitle,
    fontSize: Fonts.size.small + 1,
    color: Colors.textGray,
  },
  userContainer: {
    flexDirection: "row",
    marginTop: Metrics.baseMargin,
    alignItems: 'center',
  },
  profilePicture: {
    width: Metrics.doubleSection,
    height: Metrics.doubleSection,
    resizeMode: 'cover',
    borderRadius: Metrics.section,
  },
  userInfoContainer: {
    flex: 1,
    // marginLeft: Metrics.baseMargin,
    marginRight: Metrics.baseMargin,
  },
  nameText: {
    ...Fonts.style.smallMediumTitle,
    fontSize: Fonts.size.small + 1,
    color: Colors.softBlue,
  },
  possitionText: {
    marginTop: Metrics.smallMargin,
    ...Fonts.style.smallRegularTitle,
    fontSize: Fonts.size.small + 1,
    color: Colors.textGray,
  },
  imageContainer: {
    paddingTop: Metrics.doubleBaseMargin,
    paddingLeft: Metrics.baseMargin,
    alignSelf: 'flex-end'
  },
  icon: {
    width: Metrics.doubleBaseMargin + 4,
    height: Metrics.doubleBaseMargin - 2,
    resizeMode: 'contain',
    alignSelf: 'flex-end'
  },
})
