/* Imports */
import { Alert } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';

/* Initiating google signin */
function googleSignInConfigure() {
    GoogleSignin.configure({
        webClientId: '',
    });
}

/* Authenticating user and returns user information */
async function signInWithGoogle() {
    try {
        await GoogleSignin.hasPlayServices();
        const loggedInUser = await GoogleSignin.signIn();
        return new Promise(resolve => {
            console.log(JSON.stringify(loggedInUser));
            const user = {
                email: loggedInUser.user.email,
                social_id: loggedInUser.user.id,
                name: loggedInUser.user.name,
                social_type: 'google',
                avatar: loggedInUser.user.photo
            }

            resolve(user)
        })
        signOut()
    } catch (error) {
        handleSignInError(error);
    }
}

/* Signing out user */
signOut = async () => {
    try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
    } catch (error) {
        console.log('Error------', error);
        // handleSignInError(error);
    }
};

/* Handling google sign in error using error code */
handleSignInError = async error => {
    console.log(JSON.stringify(error));

    if (error.code) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // showSignInError('User cancelled the login flow.');
            console.log('User cancelled the login flow.');
        } else if (error.code === statusCodes.IN_PROGRESS) {

            signOut()
            showSignInError('Sign in is in progress.');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            await getGooglePlayServices();
        } else {
            showSignInError(error.message || JSON.stringify(error));
        }
    } else {
        showSignInError(error.message || JSON.stringify(error));
    }
};

/**
 * @name getGooglePlayServices
 */
getGooglePlayServices = async () => {
    try {
        await GoogleSignin.hasPlayServices({
            showPlayServicesUpdateDialog: true
        });
        // google services are available
    } catch (err) {
        showSignInError('play services are not available');
    }
};

/* Alert message to be shown on alert box */
showSignInError = alertMessage => {
    Alert.alert(
        'Google Signin Error',
        alertMessage,
        [
            {
                text: 'OK'
            }
        ],
        {
            cancelable: false
        }
    );
};

/* Exporting methods */
export default { googleSignInConfigure, signInWithGoogle, }