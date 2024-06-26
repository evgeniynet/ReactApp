/* Imports */
import { Dimensions, Platform, StatusBar } from 'react-native'

/* Variables */
const { width, height } = Dimensions.get('window')
const sHeight = Dimensions.get('screen').height;
const wHeight = Dimensions.get('window').height;

// Used via Metrics.baseMargin
/* Common static value used for margin, padding, height and width */
const metrics = {
  marginHorizontal: 10,
  marginVertical: 10,
  section: 25,
  baseMargin: 10,
  doubleBaseMargin: 20,
  smallMargin: 5,
  doubleSection: 50,
  horizontalLineHeight: 1,
  screenWidth: width < height ? width : height,
  screenHeight: sHeight,
  windowHeight: wHeight,
  // navBarHeight: (sHeight - wHeight) + StatusBar.currentHeight, //44
  // screenHeight: width < height ? height : width,
  navBarHeight: (Platform.OS === 'ios') ? 64 : 54,
  buttonRadius: 8,
  icons: {
    tiny: 15,
    small: 20,
    medium: 30,
    large: 45,
    xl: 50
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 200
  }
}

/* Exporting method */
export default metrics
