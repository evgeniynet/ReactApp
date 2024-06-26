/* Imports */
import { StyleSheet, Platform } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../../../Themes'
import TicketsStyles from './TicketsStyles';
import AddEditTicketStyles from './AddEditTicketStyles';

/* Exporting style sheet */
export default StyleSheet.create({
  ...ApplicationStyles.screen,
  ...TicketsStyles,
  ...AddEditTicketStyles,
  statusContainer: {
    marginTop: Metrics.smallMargin,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  actionButton: {
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Metrics.baseMargin - 2,
    paddingLeft: Metrics.baseMargin,
    paddingRight: Metrics.baseMargin,
    paddingTop: Metrics.smallMargin,
    paddingBottom: Metrics.smallMargin,

  },
  actionButtonText: {
    ...Fonts.style.mediumText,
    color: Colors.snow,
  },
  topContainer: {
    borderRadius: Metrics.baseMargin,
    backgroundColor: Colors.searchBg,
    marginTop: Metrics.baseMargin + Metrics.smallMargin,
    margin: Metrics.doubleBaseMargin,
    padding: Metrics.doubleBaseMargin,
  },
  titleContainer: {
    flexDirection: 'row'
  },
  titleInfoContainer: {
    flex: 1,
    marginRight: Metrics.smallMargin,
    justifyContent: 'center',
  },
  subjectText: {
    ...Fonts.style.mediumRegularTitle,
    color: Colors.snow,
  },
  nextStepText: {
    marginTop: Metrics.smallMargin + 2,
    ...Fonts.style.smallRegularTitle,
    fontSize: Fonts.size.small + 1,
    color: Colors.snow,
  },
  infoExpandCollIcon: {
    // margin: Metrics.doubleBaseMargin,
    height: Metrics.doubleBaseMargin,
    width: Metrics.doubleBaseMargin,
    resizeMode: 'contain'
  },
  editIcon: {
    height: Metrics.doubleSection - Metrics.baseMargin,
    width: Metrics.doubleSection - Metrics.baseMargin,
    resizeMode: 'contain'
  },
  infoParentContainer: {
    marginTop: Metrics.doubleBaseMargin - 7,
  },
  infoContainer: {
    flexDirection: 'row'
  },
  infoTitleText: {
    marginTop: Metrics.smallMargin + 2,
    ...Fonts.style.smallRegularTitle,
    fontSize: Fonts.size.small + 1,
    width: 80,
    color: Colors.snow,
  },
  infoDecriptionText: {
    marginTop: Metrics.smallMargin + 2,
    ...Fonts.style.smallRegularTitle,
    fontSize: Fonts.size.small + 1,
    color: Colors.snow,
  },
  rowLogContainer: {
    flexDirection: "column",
    marginTop: Metrics.doubleBaseMargin,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    paddingTop: Metrics.doubleBaseMargin,
    // paddingLeft: 0,
    // paddingRight: 0,
    paddingBottom: Metrics.baseMargin,
    borderRadius: Metrics.baseMargin,
    shadowRadius: Metrics.baseMargin,
    alignItems: 'flex-start',
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
  },
  userNameText: {
    flex: 1,
    ...Fonts.style.mediumText,
    fontSize: Fonts.size.small + 1,
    color: Colors.softBlue,
    marginBottom: Metrics.baseMargin,
  },
  decriptionText: {
    ...Fonts.style.smallRegularTitle,
    fontSize: Fonts.size.small + 1,
    color: Colors.textGray,
    marginBottom: Metrics.baseMargin,
  },
  decriptionTextGreen: {
    ...Fonts.style.smallRegularTitle,
    fontSize: Fonts.size.small + 1,
    color: Colors.green,
    marginBottom: Metrics.baseMargin,
  },
  messageInputContainer: {
    // minHeight: 95,
    // maxHeight: 160,
    height: 170,
    backgroundColor: Colors.snow,
    padding: Metrics.baseMargin + Metrics.smallMargin,
    zIndex: 1,
  },
  messageInputSubContainer: {
    marginLeft: -Metrics.smallMargin,
    flexDirection: 'row',
    flex: 1,
  },
  messageInputText: {
    ...Fonts.style.smallRegularTitle,
    fontSize: Fonts.size.small + 1,
    color: Colors.textGray,
  },
  responseButtonsConatiner: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  responseOptionsConatiner: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  optionButton: {
    paddingTop: Metrics.smallMargin,
    paddingBottom: Metrics.smallMargin,
    paddingLeft: Metrics.baseMargin,
    paddingRight: Metrics.baseMargin,
    backgroundColor: Colors.veryLightGray,
    borderRadius: Metrics.baseMargin + 2,
    marginRight: Metrics.baseMargin + 2,
  },
  selectedOptionButton: {
    backgroundColor: Colors.secondary,
  },
  responseOptionText: {
    ...Fonts.style.smallRegularTitle,
    fontSize: Fonts.size.small + 1,
    color: Colors.textGray,
  },
  selectedOptionText: {
    color: Colors.snow,
  },
  removeFileIcon: {
    margin: Metrics.baseMargin,
    marginTop: 0,
    marginBottom: 0,
    width: Metrics.section - 1,
    height: Metrics.section,
    resizeMode: 'contain',
  },
  sendIcon: {
    margin: Metrics.baseMargin,
    width: Metrics.section - 1,
    height: Metrics.section,
    resizeMode: 'contain',
  },
  responseMediaButtonsConatiner: {
    flexDirection: 'row'

  },
  rowAsignContainer: {
    flexDirection: "column",
    // marginTop: Metrics.doubleBaseMargin,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    alignItems: 'flex-start',
  },
  asignContainer: {
    flexDirection: 'row',
  },
  asignNameText: {
    ...Fonts.style.mediumText,
    fontSize: Fonts.size.medium + 1,
    color: Colors.secondary,
    marginBottom: Metrics.baseMargin,
    flex: 1,
  },
  primaryText: {
    ...Fonts.style.smallRegularTitle,
    color: Colors.textGray,
    // marginBottom: Metrics.baseMargin,
  },
  asignDateText: {
    ...Fonts.style.smallRegularTitle,
    color: Colors.textTwo,
    marginBottom: Metrics.baseMargin + Metrics.smallMargin,
  },
  emailButtonContainer: {
    padding: Metrics.doubleBaseMargin,
  },
  emailText: {
    ...Fonts.style.smallRegularTitle,
    color: Colors.textGray,
  },
  editButtonContainer: {
    marginTop: Metrics.doubleBaseMargin - Metrics.smallMargin,
    padding: Metrics.baseMargin,
    backgroundColor: Colors.mainPrimary,
    borderRadius: Metrics.baseMargin,
    alignItems: 'center'
  },
  editContainer: {
    flexDirection: 'row',
  },
  editButtonText: {
    marginLeft: Metrics.baseMargin,
    ...Fonts.style.mediumText,
    fontSize: Fonts.size.medium + 1,
    color: Colors.snow,
  }
})