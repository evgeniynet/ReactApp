/* Imports */
import { appleAuth, appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import { v4 as uuid } from 'uuid'

/* Sign with Apple iOS */
/* Authenticating user and returns user information */
async function signInWithApple() {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
    return new Promise(resolve => {

        // use credentialState response to ensure the user is authenticated
        if (credentialState === appleAuth.State.AUTHORIZED) {
            // user is authenticated
            console.log('====================================');
            console.log(appleAuthRequestResponse);
            console.log('====================================');

            var authCode = ""
            var idToken = ""
            var fullName = ""
            let userIdentifier = appleAuthRequestResponse.user
            let myName = appleAuthRequestResponse.fullName
            if (myName !== null) {
                if (myName.givenName) {
                    fullName += myName.givenName
                }
                if (myName.familyName) {
                    fullName += " "
                    fullName += myName.familyName
                }
            }
            fullName = fullName.trim()
            let email = appleAuthRequestResponse.email ?? ""
            idToken = appleAuthRequestResponse.identityToken
            authCode = appleAuthRequestResponse.authorizationCode

            /* Preparing user information */
            const user = {
                email: email,
                social_id: userIdentifier,
                name: fullName,
                social_type: 'apple',
                auth_code: authCode,
                identity_token: idToken
            }
            resolve(user)
        } else {
            resolve(null)
        }
    });
}

/* Sign with Apple Android */
async function androidSignInWithApple() {
    // Generate secure, random values for state and nonce
    const rawNonce = uuid();
    const state = uuid();

    // Configure the request
    appleAuthAndroid.configure({
        // The Service ID you registered with Apple
        clientId: 'com.sherpadesk.mobile.app',

        // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
        // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
        redirectUri: 'https://sherpadesk.com/',

        // The type of response requested - code, id_token, or both.
        responseType: appleAuthAndroid.ResponseType.ALL,

        // The amount of user information requested from Apple.
        scope: appleAuthAndroid.Scope.ALL,

        // Random nonce value that will be SHA256 hashed before sending to Apple.
        nonce: rawNonce,

        // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
        state,
    });

    // Open the browser window for user sign in
    const response = await appleAuthAndroid.signIn();

    console.log('====================================');
    console.log(response);
    console.log('====================================');
    // Send the authorization code to your backend for verification
}

/* Exporting methods */
export default { signInWithApple, androidSignInWithApple };