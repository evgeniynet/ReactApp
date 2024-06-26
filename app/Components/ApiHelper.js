/* Imports */
import apisauce from 'apisauce'
import moment from 'moment';
import { NavigationActions, StackActions } from 'react-navigation'
import { Platform } from 'react-native';
import { Toast } from 'native-base';
import { Buffer } from 'buffer'

import { Constants, Messages, UserDataKeys } from './Constants';
import CommonFunctions from './CommonFunctions';
import { Metrics } from '../Themes';
import NotificationManager from './NotificationManager';

/* Variables */
const isProduction = true
const BaseUrl = isProduction ? 'https://api.sherpadesk.com/' : 'http://1.1.1.191/api/'
const WebBaseUrl = 'https://app.sherpadesk.com/'

const Apis = {
    //Auth 
    SignIn: BaseUrl + 'login',
    SignUp: BaseUrl + 'organizations',
    SocialSignIn: BaseUrl + 'sociallogin',
    ForgotPassword: WebBaseUrl + 'mc/passwordrecovery.aspx',
    Organizations: BaseUrl + 'organizations',

    //Dashbord
    Config: BaseUrl + 'config',

    TicketsCounts: BaseUrl + 'tickets/counts',

    //Profile 
    Profile: BaseUrl + 'profile',
    Altemails: BaseUrl + 'profile/altemails',
    EditProfile: BaseUrl + 'updateprofile',
    ChangePassword: BaseUrl + 'changepassword',
    Updatedevicetoken: BaseUrl + 'updatedevicetoken',
    Logout: BaseUrl + 'logout',
    TagUpdate: BaseUrl + 'profile/push',

    Technicians: BaseUrl + 'technicians',
    Queues: BaseUrl + 'queues',
    QueuesMember: BaseUrl + 'queues/member',
    Users: BaseUrl + 'users',
    Accounts: BaseUrl + 'accounts',
    Classes: BaseUrl + 'classes',
    Tickets: BaseUrl + 'tickets',
    Levels: BaseUrl + 'levels',
    Priorities: BaseUrl + 'priorities',
    Boards: BaseUrl + 'board/lists',
    Projects: BaseUrl + 'projects',
    TaskTypes: BaseUrl + 'task_types',
    Products: BaseUrl + 'products',
    ProductItems: BaseUrl + 'products/product_items',

    Locations: BaseUrl + 'locations',
    Categories: BaseUrl + 'categories',
    Time: BaseUrl + 'time',
    ToDos: BaseUrl + 'todos',
    ToDoTemplates: BaseUrl + 'todos/templates',
    Files: BaseUrl + 'files',
    CustomFields: BaseUrl + 'customfields',
    Events: BaseUrl + 'events',
    EventTypes: BaseUrl + 'events/types',
    Assets: BaseUrl + 'assets',
    AssetsSearch: BaseUrl + 'assets/search',
    AssetsAssign: BaseUrl + 'assets/assign',
    AssetsUnassign: BaseUrl + 'assets/unassign',
    //Privacy Url 
    Privacy: 'https://www.sherpadesk.com/privacy-policy',

}
//'Cache-Control': 'no-cache',

// var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Basic ${encryptedCredentials}`  }
// var headers = {  'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Basic bmNnMWluLThkMXJhZzo1bnVhdXpqNXBrZmZ0bHozZm15a3NteWhhdDZqMzVrZg=='}

/* Creating apis */
const ApiManager = (headers) => {

    const api = apisauce.create({
        headers: headers,
        // timeout: 1000000 // 1000 second timeout...
    });

    const getMethod = async (urlEndPoint) => api.get(urlEndPoint);
    const getMethodWithParam = async (urlEndPoint, param) => api.get(urlEndPoint, param);
    const postMethodWithParam = async (urlEndPoint, param, containerThis, showProgress) => api.post(urlEndPoint, param, {
       onUploadProgress: value => {
            console.log('Upload progress--------> ', value.loaded, value.total);
            if (showProgress) {
                containerThis.setState({ loaded: value.loaded, total: value.total })
            }
        }
    })

    const putWithParam = async (urlEndPoint, param, containerThis, showProgress) => api.put(urlEndPoint, param, {
        onUploadProgress: value => {
            console.log('Upload progress--------> ', value.loaded, value.total);
            if (showProgress) {
                containerThis.setState({ loaded: value.loaded, total: value.total })
            }
        }
    })

    const deleteWithParam = async (urlEndPoint, param, containerThis, showProgress) => api.delete(urlEndPoint, param)

    return {
        getMethod,
        getMethodWithParam,
        postMethodWithParam,
        putWithParam,
        deleteWithParam
    }
}

/* Creating api manger to call apis */
// const ApiManager = create();

/* Get method api */
const get = async (urlEndPoint, containerThis, token = undefined, showLoader = true) => {
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    if (token !== undefined) {
        headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Basic ' + token }
    }
    console.log('Request Url --> ', urlEndPoint);

    return new Promise((resolve, reject) => {

        if (showLoader) {
            containerThis.setState({ loading: true })
        } else {
            containerThis.setState({ loadingBar: true })
        }

        ApiManager(headers).getMethod(urlEndPoint).then((response) => {
            containerThis.setState({ loading: false })
            if (!showLoader) {
                containerThis.setState({ loadingBar: false })
            }
            console.log('RESPONSE --> ', JSON.stringify(response))
            if (handleResponse(response, containerThis)) {
                resolve(response.data)
            } else {
                reject && reject(response)
            }
        })
            .catch((error) => {
                containerThis.setState({ loading: false })
                if (!showLoader) {
                    containerThis.setState({ loadingBar: false })
                }
                console.log('ERROR --> ', error);
            });
    });
}

/* Get method with params */
const getWithParam = async (urlEndPoint, param, containerThis, showLoader = true, token = undefined) => {
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    if (token !== undefined) {
        headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Basic ' + token }
    }
    var param = param
    // param['device_type'] = Platform.OS

    console.log('Request Url --> ', urlEndPoint);
    console.log('Param data --> ', param);

    if (showLoader) {
        containerThis.setState({ loading: true })
    } else {
        containerThis.setState({ loadingBar: true })
    }

    return new Promise((resolve, reject) => {
        ApiManager(headers).getMethodWithParam(urlEndPoint, param).then((response) => {
            containerThis.setState({ loading: false })
            if (!showLoader) {
                containerThis.setState({ loadingBar: false })
            }
            console.log('RESPONSE --> ', JSON.stringify(response))
            if (handleResponse(response, containerThis)) {
                resolve(response.data)
            } else {
                reject && reject(response)
            }
        })
            .catch((error) => {
                containerThis.setState({ loading: false })
                if (!showLoader) {
                    containerThis.setState({ loadingBar: false })
                }
                console.log('ERROR --> ', error);
            });
    });
}

/* Get method with params */
const getWithParamDirectCall = async (urlEndPoint, param, token = undefined) => {
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    if (token !== undefined) {
        headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Basic ' + token }
    }
    var param = param
    // param['device_type'] = Platform.OS

    console.log('Request Url --> ', urlEndPoint);
    console.log('Param data --> ', param);

    return new Promise((resolve, reject) => {
        ApiManager(headers).getMethodWithParam(urlEndPoint, param).then((response) => {
            console.log('RESPONSE --> ', JSON.stringify(response))
            if (handleResponse(response, null)) {
                resolve(response.data)
            } else {
                reject && reject(response)
            }
        })
            .catch((error) => {
                console.log('ERROR --> ', error);
            });
    });
}

/* Post method with params */
const postWithParam = async (urlEndPoint, param, containerThis, showLoader = true, token = undefined) => {
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    if (token !== undefined) {
        headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Basic ' + token }
    }

    var param = param
    // param['device_type'] = Platform.OS

    console.log('Request Url --> ', urlEndPoint);
    console.log('Param data --> ', param);

    if (showLoader) {
        containerThis.setState({ loading: true })
    } else {
        containerThis.setState({ loadingBar: true })
    }
    return new Promise((resolve, reject) => {
        ApiManager(headers).postMethodWithParam(urlEndPoint, param).then((response) => {
            console.log('RESPONSE --> ' + JSON.stringify(response))
            containerThis.setState({ loading: false })
            if (!showLoader) {
                containerThis.setState({ loadingBar: false })
            }
            if (handleResponse(response, containerThis)) {
                resolve(response.data)
            } else {
                // if (urlEndPoint === Apis.VoteChallenge && response.ok && (response.data.code !== 200 || response.data.code !== 999)) {
                reject && reject(response)
                // }
            }
        }).catch((error) => {
            containerThis.setState({ loading: false })
            if (!showLoader) {
                containerThis.setState({ loadingBar: false })
            }
            console.log('ERROR --> ', error);
        });
    });
}

/* Put method with params */
const putWithParam = async (urlEndPoint, param, containerThis, showLoader = true, token = undefined) => {
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    if (token !== undefined) {
        headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Basic ' + token }
    }

    var param = param
    // param['device_type'] = Platform.OS

    console.log('Request Url --> ', urlEndPoint);
    console.log('Param data --> ', param);

    if (showLoader) {
        containerThis.setState({ loading: true })
    } else {
        containerThis.setState({ loadingBar: true })
    }

    return new Promise((resolve, reject) => {
        ApiManager(headers).putWithParam(urlEndPoint, param).then((response) => {
            console.log('RESPONSE --> ' + JSON.stringify(response))
            containerThis.setState({ loading: false })
            if (!showLoader) {
                containerThis.setState({ loadingBar: false })
            }
            if (handleResponse(response, containerThis)) {
                resolve(response.data)
            } else {
                // if (urlEndPoint === Apis.VoteChallenge && response.ok && (response.data.code !== 200 || response.data.code !== 999)) {
                reject && reject(response)
                // }
            }
        }).catch((error) => {
            containerThis.setState({ loading: false })
            if (!showLoader) {
                containerThis.setState({ loadingBar: false })
            }
            console.log('ERROR --> ', error);
        });
    });
}

/* Delete method with params */
const deleteWithParam = async (urlEndPoint, param, containerThis, showLoader = true, token = undefined) => {
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    if (token !== undefined) {
        headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Basic ' + token }
    }

    var param = param
    // param['device_type'] = Platform.OS

    console.log('Request Url --> ', urlEndPoint);
    console.log('Param data --> ', param);

    if (showLoader) {
        containerThis.setState({ loading: true })
    } else {
        containerThis.setState({ loadingBar: true })
    }

    return new Promise((resolve, reject) => {
        ApiManager(headers).deleteWithParam(urlEndPoint, param).then((response) => {
            console.log('RESPONSE --> ' + JSON.stringify(response))
            containerThis.setState({ loading: false })
            if (!showLoader) {
                containerThis.setState({ loadingBar: false })
            }
            if (handleResponse(response, containerThis)) {
                resolve(response.data)
            } else {
                // if (urlEndPoint === Apis.VoteChallenge && response.ok && (response.data.code !== 200 || response.data.code !== 999)) {
                reject && reject(response)
                // }
            }
        }).catch((error) => {
            containerThis.setState({ loading: false })
            if (!showLoader) {
                containerThis.setState({ loadingBar: false })
            }
            console.log('ERROR --> ', error);
        });
    });
}

/* Post method using multipart */
const postImageWithParam = async (urlEndPoint, arrMedia, param, containerThis, token = undefined, showLoader = false, imgParam = 'img') => {
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    if (token !== undefined) {
        headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Basic ' + token }
    }
    var param = param
    // param['device_type'] = Platform.OS

    var data = new FormData();
    for (let name in param) {
        data.append(name, param[name]);
    }
    console.log(param);
    for (let i = 0; i < arrMedia.length; i++) {
        if (arrMedia[i].media !== null) {
            let imgObj = {
                uri: arrMedia[i].sourceURL && arrMedia[i].sourceURL != null && arrMedia[i].sourceURL != '' ? arrMedia[i].sourceURL : arrMedia[i].path,
                type: arrMedia[i].mime === 'Video' ? 'video/mp4' : 'image/jpeg',
                name: arrMedia[i].filename
            }
            console.log('Img obj --> ', imgObj);
            data.append(imgParam, imgObj)
        }
    }
    console.log('Request Url --> ', urlEndPoint);
    console.log('Image Data --> ', arrMedia);
    console.log('Param data --> ', data);

    if (showLoader) {
        containerThis.setState({ loading: true })
    } else {
        containerThis.setState({ loadingBar: true })
    }

    return new Promise((resolve, reject) => {

        ApiManager(headers).postMethodWithParam(urlEndPoint, data, containerThis, showLoader).then((response) => {
            console.log('RESPONSE --> ', JSON.stringify(response))
            containerThis.setState({ loading: false })
            if (!showLoader) {
                containerThis.setState({ loadingBar: false })
            }
            if (handleResponse(response, containerThis)) {
                resolve(response.data)
            } else {
                reject && reject(response)
            }
        }).catch((error) => {
            containerThis.setState({ loading: false })
            if (!showLoader) {
                containerThis.setState({ loadingBar: false })
            }
            console.log('ERROR --> ', error);
        });
    });
}

/* Post method with params */
const postWithParamThirdParty = async (url, param, containerThis, showLoader = true, token = undefined) => {
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    if (token !== undefined) {
        headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Basic ' + token }
    }

    console.log('Request Url --> ', url);
    console.log('Param data --> ', param);

    if (showLoader) {
        containerThis.setState({ loading: true })
    } else {
        containerThis.setState({ loadingBar: true })
    }
    return new Promise(resolve => {
        ApiManager(headers).postMethodWithParam(url, param).then((response) => {
            console.log('RESPONSE --> ' + JSON.stringify(response))
            containerThis.setState({ loading: false })
            if (!showLoader) {
                containerThis.setState({ loadingBar: false })
            }
            resolve(response)
        }).catch((error) => {
            containerThis.setState({ loading: false })
            if (!showLoader) {
                containerThis.setState({ loadingBar: false })
            }
            console.log('ERROR --> ', error);
        });
    });
}

/* Handaling api response */
function handleResponse(response, containerThis) {
    let errorMsg = response.data && response.data.ResponseStatus && response.data.ResponseStatus.Message && response.data.ResponseStatus.Message != '' ? response.data.ResponseStatus.Message : ''
    console.log('errorMsg ---> ', errorMsg);
    if (response.ok && (response.status === 200 || response.status === 201 || response.status === 204)) {
        return true;
    } else if (response.status === 401 || (response.status === 404 && errorMsg == Messages.TokenNotFound)) {
        setTimeout(() => {
            Toast.show({
                text: 'Your session has expired, Please log in again.',
                position: 'top',
                duration: 3000,
                type: 'danger',
                style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
            })
            deregisterWithAzure()
            CommonFunctions.storeData(UserDataKeys.User, '')
            CommonFunctions.storeData(UserDataKeys.AuthToken, '')
            CommonFunctions.storeData(UserDataKeys.Config, '')
            CommonFunctions.storeData(UserDataKeys.Org, '')
            CommonFunctions.storeData(UserDataKeys.DeviceToken, '')
            const resetAction = StackActions.reset({
                index: 0, // <-- currect active route from actions array
                actions: [
                    NavigationActions.navigate({ routeName: 'authStack' }),
                ],
            });
            containerThis && containerThis.props.navigation.dispatch(resetAction);
        }, 500)
        return false;
    } else {
        return false;
    }
}

/* Deregistering notification with azure notification hub */
async function deregisterWithAzure() {

    this.notificationRegistrationService = new NotificationManager();

    try {
        await this.notificationRegistrationService.deregisterAsync();
        console.log(`Deregistration Successful`);
        CommonFunctions.storeData(UserDataKeys.AzureRegistration, '')
    } catch (e) {
        console.log(`Deregistration failed: ${e}`);
    }
}


/* Alert api response  */
function handleErrorAlert(response) {
    let errorMsg = response.data && response.data.ResponseStatus && response.data.ResponseStatus.ErrorCode && response.data.ResponseStatus.ErrorCode != '' ? response.data.ResponseStatus.ErrorCode : ''
    if (response.status === 401 || (response.status === 404 && errorMsg == Messages.TokenNotFound) || response.status === 404 ) {
        // Do Nothing  
        console.log('====================================');
        console.log(errorMsg);
        console.log('====================================');     
    } else if (response.ok) {
        setTimeout(() => Toast.show({
            text: response.data.message,
            position: 'top',
            duration: 3000,
            // type: 'warning',
            style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
        }), 700)
    } else {
        const errorMessage = errorMsg != '' ? errorMsg : ((response.originalError && response.originalError.message !== undefined && response.originalError.message !== '') ? response.originalError.message : Messages.SeverError)
        console.log(response.data);
        console.log('====================================');
        console.log(errorMsg);
        console.log('====================================');

        setTimeout(() => Toast.show({
            text: errorMessage,
            position: 'top',
            duration: 3000,
            // type: 'warning',
            style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
        }), 700)
    }
}

function authenticationHeader(auth, org) {
    let encryptedAuthHeader = new Buffer(org.key + '-' + org.instances[0].key + ':' + auth.api_token).toString("base64");
    return encryptedAuthHeader
}

/* Exporting methods */
export default { ApiManager, get, getWithParam, getWithParamDirectCall, postWithParam, postImageWithParam, putWithParam, deleteWithParam, postWithParamThirdParty, handleErrorAlert, authenticationHeader, Apis, WebBaseUrl };