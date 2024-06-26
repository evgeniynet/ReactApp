/* Imports */
import { Animated, Easing } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer'

import SignIn from '../Containers/Authentication/SignIn';
import ForgotPassword from '../Containers/Authentication/ForgotPassword';
import SignUp from '../Containers/Authentication/SignUp';
import WebViewInfo from '../Containers/WebViewInfo';
import Menu from '../Components/Menu';
import Dashboard from '../Containers/Authenticated/Dashboard/Dashboard';
import Profile from '../Containers/Authenticated/Profile/Profile';
import EditProfile from '../Containers/Authenticated/Profile/EditProfile';
import QueueSelection from '../Containers/Authenticated/Profile/QueueSelection';
import Technicians from '../Containers/Authenticated/Technicians/Technicians';
import TechnicianTickets from '../Containers/Authenticated/Technicians/TechnicianTickets';
import AddTechnician from '../Containers/Authenticated/Technicians/AddTechnician';
import SearchTechnicians from '../Containers/Authenticated/Technicians/SearchTechnicians';
import Timelogs from '../Containers/Authenticated/Timelogs/Timelogs';
import FilterTimelogs from '../Containers/Authenticated/Timelogs/FilterTimelogs';
import AddTime from '../Containers/Authenticated/Timelogs/AddTime';
import Accounts from '../Containers/Authenticated/Accounts/Accounts';
import AddNewAccount from '../Containers/Authenticated/Accounts/AddNewAccount';
import AccountDetails from '../Containers/Authenticated/Accounts/AccountDetails';
import AccountInfo from '../Containers/Authenticated/Accounts/AccountInfo';
import PdfViewer from '../Containers/Authenticated/Accounts/PdfViewer';
import CloseTicket from '../Containers/Authenticated/Accounts/CloseTicket';
import SearchTickets from '../Containers/Authenticated/Accounts/SearchTickets';
import Queues from '../Containers/Authenticated/Queues/Queues';
import QueueTickets from '../Containers/Authenticated/Queues/QueueTickets';
import Locations from '../Containers/Authenticated/Locations/Locations';
import LocationTickets from '../Containers/Authenticated/Locations/LocationTickets';
import Tickets from '../Containers/Authenticated/Tickets/Tickets';
import FilterTickets from '../Containers/Authenticated/Tickets/FilterTickets';
import TicketDetails from '../Containers/Authenticated/Tickets/TicketDetails';
import ChangeEndUser from '../Containers/Authenticated/Tickets/ChangeEndUser';
import TransferTicket from '../Containers/Authenticated/Tickets/TransferTicket';
import AddEditTicket from '../Containers/Authenticated/Tickets/AddEditTicket';
import SearchUsers from '../Containers/Authenticated/Tickets/SearchUsers';
import ToDoTemplates from '../Containers/Authenticated/Tickets/ToDoTemplates';
import Expenses from '../Containers/Authenticated/Expenses/Expenses';
import FilterExpenses from '../Containers/Authenticated/Expenses/FilterExpenses';
import AddEditExpense from '../Containers/Authenticated/Expenses/AddEditExpense';
import Events from '../Containers/Authenticated/Events/Events';
import AddEditEvent from '../Containers/Authenticated/Events/AddEditEvent';
import ToDos from '../Containers/Authenticated/ToDos/ToDos';
import FilterToDos from '../Containers/Authenticated/ToDos/FilterToDos';
import AddEditToDo from '../Containers/Authenticated/ToDos/AddEditToDo';
import Assets from '../Containers/Authenticated/Assets/Assets';
import AddEditAsset from '../Containers/Authenticated/Assets/AddEditAsset';
import SearchAssets from '../Containers/Authenticated/Assets/SearchAssets';
import { Metrics, Colors } from '../Themes'
import styles from './Styles/NavigationStyles'

/* Variables */
// Common Stack Modules wise

/* Authentication stack of app */
const AuthStack = createStackNavigator({
  SignIn: { screen: SignIn },
  ForgotPassword: { screen: ForgotPassword },
  SignUp: { screen: SignUp },
  WebViewInfo: { screen: WebViewInfo }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'SignIn',
  navigationOptions: {
    headerStyle: styles.header
  }
})

/* Dashboard stack of app after user authentiction */
const DashboardStack = createStackNavigator({
  Dashboard: { screen: Dashboard },
  Profile: { screen: Profile },
  EditProfile: { screen: EditProfile },
  QueueSelection: { screen: QueueSelection },
  Technicians: { screen: Technicians },
  TechnicianTickets: { screen: TechnicianTickets },
  AddTechnician: { screen: AddTechnician },
  SearchTechnicians: { screen: SearchTechnicians },
  Timelogs: { screen: Timelogs },
  FilterTimelogs: { screen: FilterTimelogs },
  AddTime: { screen: AddTime },
  Accounts: { screen: Accounts },
  AddNewAccount: { screen: AddNewAccount },
  AccountDetails: { screen: AccountDetails },
  SearchTickets: { screen: SearchTickets },
  AccountInfo: { screen: AccountInfo },
  PdfViewer: { screen: PdfViewer },
  CloseTicket: { screen: CloseTicket },
  Queues: { screen: Queues },
  QueueTickets: { screen: QueueTickets },
  Locations: { screen: Locations },
  LocationTickets: { screen: LocationTickets },
  Tickets: { screen: Tickets },
  FilterTickets: { screen: FilterTickets },
  TicketDetails: { screen: TicketDetails },
  ChangeEndUser: { screen: ChangeEndUser },
  TransferTicket: { screen: TransferTicket },
  AddEditTicket: { screen: AddEditTicket },
  SearchUsers: { screen: SearchUsers },
  ToDoTemplates: { screen: ToDoTemplates },
  Expenses: { screen: Expenses },
  FilterExpenses: { screen: FilterExpenses },
  AddEditExpense: { screen: AddEditExpense },
  Events: { screen: Events },
  AddEditEvent: { screen: AddEditEvent },
  ToDos: { screen: ToDos },
  FilterToDos: { screen: FilterToDos },
  AddEditToDo: { screen: AddEditToDo },
  Assets: {screen: Assets},
  AddEditAsset: {screen: AddEditAsset},
  SearchAssets: { screen: SearchAssets},
  WebViewInfo: { screen: WebViewInfo }
},
  {
    headerMode: 'none',
    initialRouteName: 'Dashboard',
    navigationOptions: {
      headerStyle: styles.header
    },
  })

const DrawerStack = createDrawerNavigator({
  mainStack: { screen: DashboardStack },
}, {
  drawerType: 'slide',
  contentComponent: Menu,
  drawerWidth: Metrics.screenWidth,
  overlayColor: Colors.clear,
  minSwipeDistance: 10,
})

/* Ticket stack of app after user authentiction */
const TicketStack = createStackNavigator({
  Tickets: { screen: Tickets },
  FilterTickets: { screen: FilterTickets },
  TicketDetails: { screen: TicketDetails },
  ChangeEndUser: { screen: ChangeEndUser },
  TransferTicket: { screen: TransferTicket },
  AddEditTicket: { screen: AddEditTicket },
  SearchUsers: { screen: SearchUsers },
  Profile: { screen: Profile },
  EditProfile: { screen: EditProfile },
  QueueSelection: { screen: QueueSelection },
  SearchTechnicians: { screen: SearchTechnicians },
  SearchTickets: { screen: SearchTickets },
  ToDoTemplates: { screen: ToDoTemplates },
  AccountInfo: { screen: AccountInfo },
  PdfViewer: { screen: PdfViewer },
  CloseTicket: { screen: CloseTicket },
  AddTime: { screen: AddTime },
  AddEditExpense: { screen: AddEditExpense },
  Events: { screen: Events },
  AddEditEvent: { screen: AddEditEvent },
  AddEditAsset: {screen: AddEditAsset},
  SearchAssets: { screen: SearchAssets},
  WebViewInfo: { screen: WebViewInfo }
},
  {
    headerMode: 'none',
    initialRouteName: 'Tickets',
    navigationOptions: {
      headerStyle: styles.header
    },
  })

const TicketDrawerStack = createDrawerNavigator({
  mainStack: { screen: TicketStack },
}, {
  drawerType: 'slide',
  contentComponent: Menu,
  drawerWidth: Metrics.screenWidth,
  overlayColor: Colors.clear,
  minSwipeDistance: 10,
})

/*  Transition animation between stacks */
const noTransitionConfig = () => ({
  transitionSpec: {
    duration: 0,
    timing: Animated.timing,
    easing: Easing.step0
  }
})

/* Primary Navigation stacks */
const PrimaryNav = createStackNavigator({
  authStack: { screen: AuthStack },
  ticketStack: { screen: TicketDrawerStack },
  dashboardStack: { screen: DrawerStack },
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'authStack',
  transitionConfig: noTransitionConfig,
  navigationOptions: {
    headerStyle: styles.header
  }
})

/* Exporting app container(Navigation) */
export default createAppContainer(PrimaryNav)
