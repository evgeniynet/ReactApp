/* Imports */
import { Platform } from 'react-native';
import { parseString } from 'react-native-xml2js';

import CommonFunctions from './CommonFunctions';
import { UserDataKeys } from './Constants';
import ApiHelper from './ApiHelper';

/* Exporting methods */
export default class NotificationManager {

    // Life cycle of class
    constructor() {
        // var tokenA= this.getSelfSignedToken("http://sherpadeskviewstatehub-ns.servicebus.windows.net/sherpadeskviewstatehub", "qsPV+CT5T7sEHjwwftc0EyTQQ3rgIB7w2v3+D4ryBLw=",
        // "PushNotificationsManageKey", 60);
        this.state = {
            loading: false,
            loadingBar: false,
        }
        this.apiUrl = 'https://sherpadeskviewstatehub-ns.servicebus.windows.net/sherpadeskviewstatehub'//'https://sherpadeskviewstatehub-ns.servicebus.windows.net/api'
        this.apiKey = CommonFunctions.getSelfSignedToken("http://sherpadeskviewstatehub-ns.servicebus.windows.net/sherpadeskviewstatehub", "EybxjNn/o7w2Ar11KRyK8NofeE78GNLGUcH23KpHqgY=",
            "DefaultListenSharedAccessSignature", 60)
        console.log('apiKey====================================');
        console.log(this.apiKey);
        console.log('====================================');
    }

    /* Registering notification with azure notification hub */
    registerAsync = async (requestBody) => {
        const method = 'POST';
        const registerApiUrl = `${this.apiUrl}/registrationIDs?api-version=2015-01`;
        const result = await fetch(registerApiUrl, {
            method: method,
            headers: {
                Accept: 'application/xml',
                'Content-Type': 'application/atom+xml;type=entry;charset=utf-8',
                'Authorization': this.apiKey,
                'x-ms-version': '2015-01'
            },
            // body: JSON.stringify(request)
        });

        this.validateResponse(registerApiUrl, method, requestBody, result);
        if (result.status == 201) {
            if (result && result.headers && result.headers.map && result.headers.map.location) {
                return this.registerTokenAsync(requestBody, result.headers.map.location)
            }
        }
        // return result;
    }

    /* Updataing tag with azure notification hub */
    registerTokenAsync = async (requestBody, url) => {
        var newUrl = url.replace(`${this.apiUrl}/registrationIDs`, `${this.apiUrl}/registrations`)
        console.log('Calling token update api with new url ====================================', newUrl);
        const method = 'PUT';
        const registerApiUrl = `${newUrl}`;
        console.log('requestBody', requestBody);

        let xmlBody = Platform.OS == 'android' ? `<?xml version="1.0" encoding="utf-8"?>
        <entry xmlns="http://www.w3.org/2005/Atom">
            <content type="application/xml">
                <GcmRegistrationDescription xmlns:i="http://www.w3.org/2001/XMLSchema-instance:" xmlns="http://schemas.microsoft.com/netservices/2010/10/servicebus/connect">
                    <Tags>${requestBody.tags}</Tags>
                    <GcmRegistrationId>${requestBody.pushChannel}</GcmRegistrationId>
                </GcmRegistrationDescription>
            </content>
        </entry>` : `<?xml version="1.0" encoding="utf-8"?>
        <entry xmlns="http://www.w3.org/2005/Atom">
            <content type="application/xml">
                <AppleRegistrationDescription xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/netservices/2010/10/servicebus/connect">
                    <Tags>${requestBody.tags}</Tags>
                    <DeviceToken>${requestBody.pushChannel}</DeviceToken>
                </AppleRegistrationDescription>
            </content>
        </entry>`

        const result = await fetch(registerApiUrl, {
            method: method,
            headers: {
                Accept: 'application/xml',
                'Content-Type': 'application/atom+xml;type=entry;charset=utf-8',
                'Authorization': this.apiKey,
                'x-ms-version': '2015-01'
            },
            body: xmlBody
        }).then(response => {
            this.validateResponse(registerApiUrl, method, requestBody, response);
            return response.text()
        }).then((response) => {
            parseString(response, { explicitArray: false, mergeAttrs: true }, function (err, result) {
                console.log('registerTokenAsync XML RESULT====================================');
                console.log(JSON.stringify(result))
                var obj = {}
                if (Platform.OS == 'android') {
                    obj = result && result.entry && result.entry.content && result.entry.content.GcmRegistrationDescription
                } else {
                    obj = result && result.entry && result.entry.content && result.entry.content.AppleRegistrationDescription
                }
                console.log(obj)
                CommonFunctions.storeData(UserDataKeys.AzureRegistration, JSON.stringify(obj))
                console.log('====================================');
            });
            CommonFunctions.retrieveData(UserDataKeys.User)
                .then((user) => {
                    let aUser = JSON.parse(user)
                    CommonFunctions.retrieveData(UserDataKeys.Org)
                        .then((org) => {
                            let authHeader = (ApiHelper.authenticationHeader(aUser, JSON.parse(org)))
                            this.updateProfile(aUser, authHeader)
                        })
                })
        });
        return result;
    }

    /* Calling api to update tag with device */
    updateProfile = async (aUser, authHeader) => {
        let objData = {
            device: Platform.OS == 'ios' ? 'apple' : 'google',
            tag: aUser.login_id
        }

        const result = await fetch(ApiHelper.Apis.TagUpdate, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Basic ' + authHeader },
            body: JSON.stringify(objData)
        });
        console.log('Response====================================');
        console.log(result);
        console.log('====================================');
    }

    /* Deregistering notification with azure notification hub */
    async deregisterAsync() {
        let result = await new Promise((resolve, reject) => {
            CommonFunctions.retrieveData(UserDataKeys.AzureRegistration)
                .then((response) => {
                    if (response && response != '{}' && response != '') {
                        let registration = JSON.parse(response)
                        console.log('registration====================================');
                        console.log(registration);
                        console.log('====================================');
                        const method = 'DELETE';
                        const deregisterApiUrl = `${this.apiUrl}/registrations/${registration.RegistrationId}?api-version=2015-01`;
                        const result = fetch(deregisterApiUrl, {
                            method: method,
                            headers: {
                                Accept: 'application/xml',
                                'Content-Type': 'application/atom+xml;type=entry;charset=utf-8',
                                'Authorization': this.apiKey,
                                'x-ms-version': '2015-01',
                                'If-Match': registration.ETag
                            }
                        }).then(response => {
                            this.validateResponse(deregisterApiUrl, method, null, response);
                            return response.text()
                        });
                        console.log('resultresult====================================', result.status);
                        console.log(result);
                        console.log('====================================');
                        resolve(result)
                    } else {
                        reject()
                    }
                })
        });
        return result;
    }

    /* Handaling api response */
    validateResponse(requestUrl, method, requestBody, response) {
        console.log('====================================');
        console.log(`Request: ${method} ${requestUrl} => ${JSON.stringify(requestBody)}\nResponse: ${response.status}`);
        console.log('Azure Response =>');
        console.log(response);
        console.log('====================================');

        if (response.status == 201) {
            // if (response && response.headers && response.headers.map && response.headers.map.location) {
            //     this.registerTokenAsync(requestBody, response.headers.map.location)
            // }
        } else if (!response || response.status != 200) {
            throw `HTTP error ${response.status}: ${response.statusText}`;
        } else if (response.status == 200 && method == 'DELETE') {
            CommonFunctions.storeData(UserDataKeys.AzureRegistration, '')
        }
    }
}