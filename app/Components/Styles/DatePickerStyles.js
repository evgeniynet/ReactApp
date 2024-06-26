/* Imports */
import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../Themes'

/* Exporting style sheet */
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
    backgroundColor: Colors.white,
    borderTopLeftRadius: Metrics.doubleBaseMargin,
    borderTopRightRadius: Metrics.doubleBaseMargin,
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  closeButtonIcon: {
    height: Metrics.doubleBaseMargin + 10,
    width: Metrics.doubleBaseMargin + 10,
    marginRight: Metrics.baseMargin + 2,
    resizeMode: 'contain'
  },
  pickerContainer: {
    flex: 1,
    alignSelf: 'flex-end',
    borderTopLeftRadius: Metrics.doubleBaseMargin,
    borderTopRightRadius: Metrics.doubleBaseMargin,
    backgroundColor: Colors.snow,
  },
  picker: {
    // flex: 1, 
    // // backgroundColor: Colors.white,
    // alignSelf: 'flex-end'
  }
})