/* Imports */
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import firebase from '@react-native-firebase/messaging';
import { connect } from 'react-redux';

import NavigationService from './NavigationService';
import CommonFunctions from './CommonFunctions';
import { UserDataKeys } from './Constants';
import ApiHelper from './ApiHelper';

class NotifiactionTokenManager {

    /* Configuring notification */
    configure = () => {
        return new Promise((resolve) => {
            PushNotification.configure({
                onRegister: function (token) {
                    console.log('TOKEN:', token);
                    if (Platform.OS == 'ios') {
                        resolve(token.token)
                        if (token.token && token.token != '') {
                            CommonFunctions.storeData(UserDataKeys.DeviceToken, token.token)
                        }
                    } else {
                        if (token.token && token.token != '') {
                            CommonFunctions.storeData(UserDataKeys.DeviceToken, token.token)
                        }
                        resolve(token.token)
                    }
                },
                onNotification: function (notification) {
                    console.log('NOTIFICATION:', notification);
                    console.log('====================================is user clicked on notification', notification.userInteraction);
                    console.log(notification.data);
                    console.log('====================================');
                    notification.finish(PushNotificationIOS.FetchResult.NoData);
                    if (notification.userInteraction) {
                        if (Platform.OS == 'ios') {
                            let data = notification && notification.data && notification.data.data
                            if (data && data.notification_type) {
                                if (data.notification_type == 'ticket') {
                                    navigateTo(data.notification_type, data)
                                }
                            }
                        } else if (Platform.OS == 'android') {
                            let data = notification && notification.data
                            if (data && data.notification_type) {
                                if (data.notification_type == 'ticket') {
                                    navigateTo(data.notification_type, data)
                                }
                            }
                        }
                    }
                },
                permissions: {
                    alert: true,
                    badge: true,
                    sound: true,
                },
                popInitialNotification: true,
                requestPermissions: true,
            });
        })
    };



    /* Cancel all push notifications (Clear all notification as well in notification tray) */
    cancelAllNotification = () => {
        console.log('cancel');
        PushNotification.cancelAllLocalNotifications();
        if (Platform.OS === 'ios') {
            PushNotificationIOS.removeAllDeliveredNotifications();
        }
    };

    /* Unregister push notifications */
    unregister = () => {
        PushNotification.unregister();
        PushNotification.abandonPermissions();
    };
}
/* Navigation on tap of notification */
function navigateTo(screen, data) {
    if (screen == 'ticket') {
        CommonFunctions.retrieveData(UserDataKeys.User)
            .then((user) => {
                CommonFunctions.retrieveData(UserDataKeys.Org)
                    .then((org) => {
                        let authHeader = (ApiHelper.authenticationHeader(JSON.parse(user), JSON.parse(org)))
                        ApiHelper.getWithParamDirectCall(ApiHelper.Apis.Tickets + '/id/' + data.id, {}, authHeader).then((response) => {
                            // Checking ticket id
                            if (response && response.id) {
                                //Navigating to ticket details 
                                NavigationService.navigate('TicketDetails', { notificationData: data })
                            }
                        })
                        .catch((error) => {
                            // ApiHelper.handleErrorAlert(error)
                        })
                    })
            })
    }
}
/* Exporting methods */
export const notifiactionTokenManager = new NotifiactionTokenManager();