/* Imports */
import React, { Component } from 'react'
import { Image, View, TouchableOpacity, Platform, StatusBar, SafeAreaView, Keyboard, FlatList } from 'react-native'
import { Container, Label, } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
// import Moment from 'moment';

import CommonFunctions from '../../../Components/CommonFunctions';
import { UserDataKeys } from '../../../Components/Constants';
import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Images, Colors } from '../../../Themes';
import LinearGradient from 'react-native-linear-gradient';
import AccountTickets from './AccountTickets';
import AccountProjects from './AccountProjects';
import AccountEvents from './AccountEvents';
import AccountNotes from './AccountNotes';
import AccountFiles from './AccountFiles';
// import AccountToDos from './AccountToDos';
import AccountExpenses from './AccountExpenses';
import AccountTimes from './AccountTimes';
import ApiHelper from '../../../Components/ApiHelper';
import LoaderBar from '../../../Components/LoaderBar';
import Loader from '../../../Components/Loader';

// Styless
import styles from './Styles/AccountDetailsStyles'

class AccountDetails extends Component {

  // Life cycle of class
  /* Initiating state before the component mount. */
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      searchString: '',
      dataSourceTabs: [],
      selectedTab: '',
      dataSource: [],
      dataSourceMain: [],
      activeTicketsTab: 'Open Tickets',
      notes: '',
      isNotesEditingOn: false,
      title: '',
      tickets: 'Tickets',
      config: {}
    };
  }

  componentDidMount() {
    this.setState({
      loading: false,
      searchString: '',
      dataSourceTabs: [],
      selectedTab: '',
      dataSource: [],
      dataSourceMain: [],
      title: '',
      tickets: 'Tickets',
      config: {}
    });

    CommonFunctions.retrieveData(UserDataKeys.Config)
      .then((response) => {
        let config = JSON.parse(response)
        var title = 'Account'
        var tickets = 'Tickets'
        if (config.is_customnames) {
          title = config.names.account.s ?? 'Account'
          tickets = config.names.ticket.p ?? 'Tickets'
        }
        this.setState({ title: title, tickets: tickets, config: config, activeTicketsTab: `Open ${tickets}` })
        // Call Apis
      }).catch(() => {
        this.setState({ title: 'Account' })
      })


    if (this.props.navigation.state.params !== undefined) {
      if (this.props.navigation.state.params.account !== undefined) {
        this.setState({ account: this.props.navigation.state.params.account })
        setTimeout(() => {
          this.viewWillAppear()
        }, 100)
      }
    }
  }

  /* Calling api to fetch account info when view will appears and setting tabs options */
  viewWillAppear = async () => {
    let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
    let objData = { is_with_statistics: true }
    ApiHelper.getWithParam(ApiHelper.Apis.Accounts + `/${this.state.account.id}`, objData, this, true, authHeader).then((response) => {
      this.setState({ accountRes: response })
      let arrAllTabs = [this.state.tickets, 'Projects', 'Events', 'Notes', 'Files', 'Expense', 'Time'] //'ToDos',
      var arrTabs = []
      CommonFunctions.retrieveData(UserDataKeys.Config)
        .then((response) => {
          let config = JSON.parse(response)
          arrAllTabs.forEach(tab => {
            switch (tab) {
              case 'Projects':
                if (config.is_project_tracking) {
                  arrTabs.push(tab)
                }
                break;
              case 'Events':
                if (config.is_events || true) {
                  arrTabs.push(tab)
                }
                break;
              // case 'ToDos':
              //   if (config.is_todos) {
              //     arrTabs.push(tab)
              //   }
              //   break;
              case 'Expenses':
                if (config.is_expenses) {
                  arrTabs.push(tab)
                }
                break;
              case 'Time':
                if (config.is_time_tracking) {
                  arrTabs.push(tab)
                }
                break;
              default:
                arrTabs.push(tab)
                break;
            }
          });
          Keyboard.dismiss();
          if (this.sub) {
            this.subs.forEach((sub) => {
              sub.remove();
            });
          }
          this.setState({ selectedTab: this.state.tickets, dataSourceTabs: arrTabs })
        }).catch(() => {
          arrAllTabs.forEach(tab => {
            switch (tab) {
              case 'Projects':
                break;
              case 'Events':
                break;
              // case 'ToDos':
              //   break;
              case 'Expenses':
                break;
              case 'Time':
                break;
              default:
                arrTabs.push(tab)
                break;
            }
          });
          Keyboard.dismiss();
          if (this.sub) {
            this.subs.forEach((sub) => {
              sub.remove();
            });
          }
          this.setState({ selectedTab: this.state.tickets, dataSourceTabs: arrTabs })
        })

    })
      .catch((response) => {
        ApiHelper.handleErrorAlert(response)
      })
  }

  componentWillUnmount() {
    Keyboard.dismiss();
    if (this.sub) {
      this.subs.forEach((sub) => {
        sub.remove();
      });
    }
  }


  /* Rendering tab row */
  renderTabRow(row) {
    return (
      <Animatable.View useNativeDriver={true} animation={row.item == this.state.selectedTab ? 'zoomIn' : null}>
        <TouchableOpacity
          style={[styles.rowTabContainer, row.item == this.state.selectedTab ? styles.selectedTab : {}]}
          onPress={() => {
            if (!this.state.loading) {
              Keyboard.dismiss();
              if (this.sub) {
                this.subs.forEach((sub) => {
                  sub.remove();
                });
              }
              this.setState({ selectedTab: row.item })
              this.flatListTabRef.scrollToIndex({ animated: true, index: row.index, viewPosition: 0.5 })
            }
          }}>
          <Label style={[styles.tabTitle, row.item == this.state.selectedTab ? styles.tabSelectedTitle : {}]}>{row.item}</Label>
        </TouchableOpacity>
      </Animatable.View>
    )
  }

  /* Rendering selected tab container */
  renderTabContainer() {
    // ['Tickets', 'Projects', 'Events', 'Notes', 'Files', 'ToDos', 'Expense', 'Time'],
    console.log('this.state.selectedTab', this.state.selectedTab);
    switch (this.state.selectedTab) {
      case this.state.tickets:
        return (
          <AccountTickets mainState={this} loading={this.state.loading} activeTicketsTab={this.state.activeTicketsTab} account={this.state.account} />
        )
      case 'Projects':
        return (
          <AccountProjects mainState={this} account={this.state.accountRes} />
        )
      case 'Events':
         return (
           <AccountEvents mainState={this} account={this.state.accountRes} />
         )
      case 'Notes':
        return (
          <AccountNotes mainState={this.state} account={this.state.accountRes} />
        )
      case 'Files':
        return (
          <AccountFiles mainState={this} account={this.state.accountRes} />
        )
      // case 'ToDos':
      //   return (
      //     <AccountToDos mainState={this} account={this.state.accountRes} />
      //   )
      case 'Expenses':
        return (
          <AccountExpenses mainState={this} account={this.state.accountRes} />
        )
      case 'Time':
        return (
          <AccountTimes mainState={this} account={this.state.accountRes} />
        )
      default:
        return (this.state.loading ?
          <Animatable.View animation={'fadeIn'} style={styles.noDataContainer}>
            <Label style={styles.noDataTitleStyle}>
              {`${this.state.title} details will appear here.`}
            </Label>
          </Animatable.View> : <View />)
    }

  }

  /* Rendering footer view with add button based on selected tab */
  renderBottomContainer() {
    // ['Tickets', 'Projects', 'Notes', 'Files', 'ToDos', 'Expenses', 'Events', 'Time'],
    switch (this.state.selectedTab) {
      // case 'ToDos':
      //   return (
      //     <Animatable.View duration={800} animation={'flipInX'} style={styles.bottomContainer}>
      //       <SafeAreaView>
      //         <TouchableOpacity activeOpacity={0.7} style={styles.buttonConatiner}
      //           onPress={() => {
      //             let data = { account: this.state.accountRes }
      //             this.props.navigation.push('AddEditToDo', data);
      //           }}
      //         >
      //           <Image source={Images.addTech} style={styles.addIcon} />
      //           <Label style={styles.buttonTitle}>Add ToDo</Label>
      //         </TouchableOpacity>
      //       </SafeAreaView>
      //     </Animatable.View>
      //   )
      case 'Events':
        return (
          <Animatable.View duration={800} animation={'flipInX'} style={styles.bottomContainer}>
            <SafeAreaView>
              <TouchableOpacity activeOpacity={0.7} style={styles.buttonConatiner}
                onPress={() => {
                  let data = { account: this.state.accountRes }
                  this.props.navigation.push('AddEditEvent', data);
                }}
              >
                <Image source={Images.addTech} style={styles.addIcon} />
                <Label style={styles.buttonTitle}>Add Event</Label>
              </TouchableOpacity>
            </SafeAreaView>
          </Animatable.View>
        )
      case 'Expense':
        return (
          <Animatable.View duration={800} animation={'flipInX'} style={styles.bottomContainer}>
            <SafeAreaView>
              <TouchableOpacity activeOpacity={0.7} style={styles.buttonConatiner}
                onPress={() => {
                  let data = { account: this.state.accountRes }
                  this.props.navigation.push('AddEditExpense', data);
                }}
              >
                <Image source={Images.addTech} style={styles.addIcon} />
                <Label style={styles.buttonTitle}>Add Expense</Label>
              </TouchableOpacity>
            </SafeAreaView>
          </Animatable.View>
        )
      case 'Time':
        return (
          <Animatable.View duration={800} animation={'flipInX'} style={styles.bottomContainer}>
            <SafeAreaView>
              <TouchableOpacity activeOpacity={0.7} style={styles.buttonConatiner}
                onPress={() => {
                  let data = { account: this.state.accountRes }
                  this.props.navigation.push('AddTime', data);
                }}
              >
                <Image source={Images.addTech} style={styles.addIcon} />
                <Label style={styles.buttonTitle}>Add Time</Label>
              </TouchableOpacity>
            </SafeAreaView>
          </Animatable.View>
        )
      default:
        return (<View />)
    }
  }

  /* What to display on the screen */
  render() {
    return (
      <Container>
        {StatusBar.setBarStyle('light-content', true)}
        {Platform.OS === 'ios' ? null : StatusBar.setBackgroundColor(Colors.mainPrimary)}
        {/* <Loader show={this.state.loading} /> */}
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={
            [Colors.mainPrimary,
            Colors.secondary]}
          style={styles.backgroundImage} />
        <SafeAreaView>
          <NavigationBar
            // isTransparent
            navigation={this.props.navigation}
            showTitle={this.state.account ? this.state.account.name : `${this.state.title} Details`}
            isTitleWithButton
            other={() => {
              // Toast.show({ text: 'This is account ditails info.' })
              if (this.state.accountRes) {
                let data = { account: this.state.accountRes }
                this.props.navigation.push('AccountInfo', data);
              }
            }}
            rightImage={Images.searchInNav}
            hideRightButton={false}
            rightButton={() => {
              this.props.navigation.push('SearchTickets');
            }}
          />
        </SafeAreaView>
        <LoaderBar show={this.state.loading} />
        {this.state.selectedTab != '' && this.state.dataSourceTabs.length > 0 ?
          <Animatable.View animation={'fadeIn'} style={styles.flatListTabContainer}>
            <FlatList
              horizontal
              ref={(ref) => { this.flatListTabRef = ref; }}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flatListTabPadding}
              data={this.state.dataSourceTabs}
              renderItem={(row) => this.renderTabRow(row)}
              keyExtractor={(item, index) => index.toString()}
              keyboardShouldPersistTaps='handled'
            />
          </Animatable.View> : null}
        <View style={styles.contentContainer}>
          <SafeAreaView style={styles.mainContainer}>
            <View style={styles.mainContainer}>
              {this.renderTabContainer()}
            </View>
          </SafeAreaView>
          {this.renderBottomContainer()}
        </View>
      </Container>
    )
  }
}

/* Subscribing to redux store for updates */
const mapStateToProps = (state) => {
  const { user } = state.userInfo
  const { org } = state.org
  const { authToken } = state.authToken
  return { authToken, org, user }
};

/* Connecting to redux store and exporting class */
export default connect(mapStateToProps)(AccountDetails);