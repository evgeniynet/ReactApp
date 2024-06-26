/* Imports */
import { Images, Colors } from '../Themes';

//Common global static values
/* App Info */
const Constants = {
    AppName: 'SherpaDesk',
    DeviceToken: '123',
}

/* Static text values */
const TextValue = {
    All: 'All',
}

/* User data saving to local storage static keys */
const UserDataKeys = {
    User: 'User',
    Config: 'Config',
    AuthToken: 'AuthToken',
    Org: 'Org',
    Organizations: 'Organizations',
    AccountTicketSwipeToDelete: 'AccountTicketSwipeToDelete',
    AccountToDosSwipeToDelete: 'AccountToDosSwipeToDelete',
    EventSwipeToDelete: 'EventSwipeToDelete',
    TiketEventSwipeToDelete: 'TiketEventSwipeToDelete',
    AssetSwipeToDelete: 'AssetSwipeToDelete',
    TiketAssetSwipeToDelete: 'TiketAssetSwipeToDelete',
    ExpensesSwipeToDelete: 'ExpensesSwipeToDelete',
    CounterDates: 'CounterDates',
    DeviceToken: 'DeviceToken',
    AzureRegistration: 'AzureRegistration',
}

/* Common messages */
const Messages = {
    //Alert
    SeverError: 'Server error! Please try again later.',
    NoInternet: 'Network error! Please try again later.',
    SomethingWentWorng: 'Something went wrong try again.',
    FailedToRegisterPNS: 'Failed to register for receiving push notifications',
    FailedToDeregisterPNS: 'Failed to deregister for stop push notifications',
    AskLogout: 'Are sure you want to logout?',
    AskClearAll: 'Are sure you want to clear all notifications?',
    AskDelete: 'Are sure you want to delete?',
    AskReopen: 'Are sure you want to reopen',
    TokenNotFound: 'User with this token was not found.',
    
    //Text
    Logout: 'Logout',
    ClearAll: 'Clear All',
    Delete: 'Delete',
    ReOpen: 'ReOpen',

    //NoData
    NoNotification: 'Currently, there are no notifications.',
    NoData: 'Currently, there is no data.',
    NoResultFound: 'No result found.',
    ResultsWillAppear: 'The search results will appear here.',

    //Validations
    EnterName: 'Please enter name.',
    EnterEmail: 'Please enter email.',
    EnterDomain: 'Please enter domain name.',
    EnterMobileNumber: 'Please enter mobile number.',
    EnterValidMobileNuber: 'Please enter valid mobile number.',
    EnterValidEmail: 'Please enter valid email.',
    EnterPassword: 'Please enter password.',
    EnterValidPassword: 'Password must be at least 6 characters.',
    EnterConfrimPassword: 'Please enter confirm password.',
    ConfrimPasswordAndPasswordDoesNotMetch: 'Password and confirm password does not match.',
}

/* Date format styles */
const DateFormat = {
    YYYYMMDDTHHMMSS: 'yyyy-MM-DDTHH:mm:ss',
    YYYYMMDDHHMMSS: 'yyyy-MM-DD HH:mm:ss',
    YYYYMMDD: 'yyyy-MM-DD',
    DDMMYYYY: 'DD-MM-yyyy',
    DDMMMYYYY: 'DD MMM yyyy',
    DDMMMYYYYHMMA: 'DD MMM yyyy hh:mm A',
    EMMMDDYYYY: 'dddd, MMM D yyyy',
    ESHORTMMMDDYYYY: 'ddd, MMM D yyyy',
    HHMMSS: 'HH:mm:ss',
    HMMA: 'hh:mm A',
}

/* Exporting methods */
export { Constants, Messages, UserDataKeys, DateFormat, TextValue };


