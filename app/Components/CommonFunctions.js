/* Imports */
import { Alert, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Moment from 'moment';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';

import { Colors, Images, Fonts } from '../Themes';

//Common Alerts

/* Alert with default ok button */
const presentAlert = (msg) => {
  Alert.alert(
    '',
    msg,
    [{ text: 'OK' }],
    { cancelable: false }
  )
}

/* Alert with default ok button with action */
const presentAlertWithOkAction = (msg) => {
  return new Promise(resolve => {
    Alert.alert(
      '',
      msg,
      [
        { text: 'OK', onPress: () => resolve(true) },
      ],
      { cancelable: false }
    )
  });
}

/* Alert with custom buttons with actions */
const presentAlertWithAction = (msg, okButton = 'OK') => {
  return new Promise(resolve => {
    Alert.alert(
      '',
      msg,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: okButton, onPress: () => resolve(true) },
      ],
      { cancelable: false }
    )
  });
}

/* Alert with custom buttons with actions */
const presentAlertCustomNameWithActions = (msg, cancelButton = 'Cancel', okButton = 'OK') => {
  return new Promise(resolve => {
    Alert.alert(
      '',
      msg,
      [
        { text: cancelButton, onPress: () => resolve(false) },
        { text: okButton, onPress: () => resolve(true) },
      ],
      { cancelable: false }
    )
  });
}

//Saving and retrieving data from local storgae

/* Saving data to local storgae */
const storeData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, data)
  } catch (error) {
    console.log('====================================');
    console.log('Error while saving data in AsyncStorage---->', error);
    console.log('====================================');
  }
}

/* Retrieving data from local storgae */
const retrieveData = async (key) => {
  return new Promise((resolve, reject) => {
    try {
      const value = AsyncStorage.getItem(key)
      if (value !== '' && value !== null) {
        // value previously stored
        resolve(value)
        // console.log('Retrive Reslut from AsyncStorage Start ====================================');
        // console.log(value);
        // console.log('Retrive Reslut AsyncStorage End====================================');
      }
    } catch (e) {
      // error reading value
      reject(e)
      console.log('====================================');
      console.log('No data found in AsyncStorage key ---->', e);
      console.log('====================================');
    }
  });
}

//Format
/* Formating to sort format like 1000000 to 1M */
function shortValue(number, precision = 1) {
  const abbrev = ['', 'K', 'M', 'B', 'T'];
  const unrangifiedOrder = Math.floor(Math.log10(Math.abs(number)) / 3)
  const order = Math.max(0, Math.min(unrangifiedOrder, abbrev.length - 1))
  const suffix = abbrev[order];
  const final = (number / Math.pow(10, order * 3)).toFixed(precision) + suffix;
  return number !== undefined ? final.replace('.0', '') : '0'
}

/* Date formating and converting UTC time zone to local time zone */
function utcToLocalTimeZone(date, format) {
  let utc = Moment.utc(date)
  let localDate = utc.local().format(format)
  // let today = Moment(Date()).format(format)
  // if (localDate === today) {
  //     return Moment.utc(date).local().format(DateFormat.HMMA)
  // } else {
  return localDate
  // }
}

/* Returns floting menu option as per user role */
function floatingMenus(config, user) {
  var arrOptions = []
  var menus = ['Default', 'Events', 'Timelogs', 'ToDos', 'Expenses', 'Accounts', 'Locations', 'Queues']
  menus.forEach(menu => {
    switch (menu) {
      case 'Default':
        arrOptions.push({
          text: "Add Ticket",
          icon: Images.fmAddTicket,
          name: "bt_AddTicket",
          position: 1,
          tintColor: Colors.snow,
          color: Colors.mainPrimary,
          buttonSize: 46,
          size: 25,
          textBackground: Colors.clear,
          textStyle: {
            shadowColor: Colors.clear,
            shadowOpacity: 0,
            color: Colors.softBlue,
            ...Fonts.style.mediumText,
          },
          textElevation: 0
        })
        break;
      case 'Events':
        if (user.is_techoradmin && config.is_events) {
          arrOptions.push({
            text: "Add Event",
            icon: Images.fmEvent,
            name: "bt_AddEvent",
            position: 2,
            tintColor: Colors.snow,
            color: Colors.mainPrimary,
            buttonSize: 46,
            size: 25,
            textBackground: Colors.clear,
            textStyle: {
              shadowColor: Colors.clear,
              shadowOpacity: 0,
              color: Colors.softBlue,
              ...Fonts.style.mediumText,
            },
            textElevation: 0
          })
        }
        break;
      case 'Timelogs':
        if (user.is_techoradmin && config.is_time_tracking) {
          arrOptions.push({
            text: "Add Time",
            icon: Images.fmAddTime,
            name: "bt_AddTime",
            position: 2,
            tintColor: Colors.snow,
            color: Colors.mainPrimary,
            buttonSize: 46,
            size: 25,
            textBackground: Colors.clear,
            textStyle: {
              shadowColor: Colors.clear,
              shadowOpacity: 0,
              color: Colors.softBlue,
              ...Fonts.style.mediumText,
            },
            textElevation: 0
          })
        }
        break;
      case 'Expenses':
        if (user.is_techoradmin && config.is_expenses) {
          arrOptions.push({
            text: "Add Product",
            icon: Images.fmAddExpense,
            name: "bt_AddExpense",
            position: 5,
            tintColor: Colors.snow,
            color: Colors.mainPrimary,
            buttonSize: 46,
            size: 25,
            textBackground: Colors.clear,
            textStyle: {
              shadowColor: Colors.clear,
              shadowOpacity: 0,
              color: Colors.softBlue,
              ...Fonts.style.mediumText,
            },
            textElevation: 0
          })
        }
        break;
      case 'ToDos':
        if (user.is_techoradmin && config.is_todos) {
          arrOptions.push({
            text: "Add ToDo",
            icon: Images.fmAddTodo,
            name: "bt_AddToDo",
            position: 4,
            tintColor: Colors.snow,
            color: Colors.mainPrimary,
            buttonSize: 46,
            size: 25,
            textBackground: Colors.clear,
            textStyle: {
              shadowColor: Colors.clear,
              shadowOpacity: 0,
              color: Colors.softBlue,
              ...Fonts.style.mediumText,
            },
            textElevation: 0
          })
        }
        break;
      default:
        break;
    }
  });
  return arrOptions
}

/* Auth token for azure notification apis */
function getSelfSignedToken(targetUri, sharedKey, ruleId,
  expiresInMins) {
  targetUri = encodeURIComponent(targetUri.toLowerCase()).toLowerCase();

  // Set expiration in seconds
  var expireOnDate = new Date();
  expireOnDate.setMinutes(expireOnDate.getMinutes() + expiresInMins);
  var expires = Date.UTC(expireOnDate.getUTCFullYear(), expireOnDate
    .getUTCMonth(), expireOnDate.getUTCDate(), expireOnDate
      .getUTCHours(), expireOnDate.getUTCMinutes(), expireOnDate
        .getUTCSeconds()) / 1000;
  var tosign = targetUri + '\n' + expires;

  // using CryptoJS
  var signature = hmacSHA256(tosign, sharedKey);
  var base64signature = signature.toString(Base64);
  var base64UriEncoded = encodeURIComponent(base64signature);

  // construct autorization string
  var token = "SharedAccessSignature sr=" + targetUri + "&sig="
    + base64UriEncoded + "&se=" + expires + "&skn=" + ruleId;
  // console.log("signature:" + token);
  return token;
}

/* Exporting methods */
export default {
  presentAlert,
  presentAlertWithAction,
  presentAlertCustomNameWithActions,
  presentAlertWithOkAction,
  storeData,
  retrieveData,
  shortValue,
  utcToLocalTimeZone,
  floatingMenus,
  getSelfSignedToken
}