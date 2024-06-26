/* Imports */
import { NavigationActions } from 'react-navigation';

/* Global Variables */
let _navigator;
let _dispatch;

/* Setting values of ref and dispatch */
function setTopLevelNavigator(navigatorRef, dispatch) {
    _navigator = navigatorRef;
    _dispatch = dispatch;
}

/* Navigating new screen with params */
function navigate(routeName, params) {
    _dispatch(
        NavigationActions.navigate({
            routeName,
            params,
        })
    );
}

/* Exporting methods */
export default {
    setTopLevelNavigator,
    navigate
}