/* Imports */
import React, { Component } from 'react'
import { Image, View, TouchableOpacity, Platform, SafeAreaView, FlatList } from 'react-native'
import { Label, CardItem, Text, Button, Toast } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import Moment from 'moment';

import { DateFormat, Messages, UserDataKeys } from '../../../Components/Constants';
import { Images, Colors, Metrics } from '../../../Themes';
import CommonFunctions from '../../../Components/CommonFunctions';
import ApiHelper from '../../../Components/ApiHelper';
import LoaderBar from '../../../Components/LoaderBar';

// Styless
import styles from './Styles/AccountToDosStyles'

class AccountToDos extends Component {

  // Life cycle of class
  /* Initiating state before the component mount. */
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      dataSource: [],
      ticketTitle: 'Ticket',
    };

    this.openRowRefs = [];
  }
  
  componentDidMount() {
    CommonFunctions.retrieveData(UserDataKeys.Config)
      .then((response) => {
        let config = JSON.parse(response)
        let arrOptions = CommonFunctions.floatingMenus(config, config.user)
        this.setState({ flotingMenuDataSource: arrOptions })
        var ticketTitle = 'Ticket'
        if (config.is_customnames) {
          ticketTitle = config.names.ticket.s ?? 'Ticket'
        }
        this.setState({ ticketTitle: ticketTitle })
      })
  
    if (this.props.account) {
      this.setState({ account: this.props.account })
      setTimeout(() => {
        this.fetchToDos()
        this.props.mainState.subs = [
          this.props.mainState.props.navigation.addListener('didFocus', this.viewWillAppear)
        ]
      }, 100)
    }
  }

  /* Calling api to refresh data when view will appears */
  viewWillAppear = () => {
    if (!this.state.loading && this.props.mainState && this.props.mainState.state.selectedTab == 'ToDos') {
      this.fetchToDos()
    }
  }

  componentWillUnmount() {
    this.closeAllOpenRows()
    if (this.props.mainState && this.props.mainState.sub) {
      this.props.mainState.subs.forEach((sub) => {
        sub.remove();
      });
    }
  }

  //Actions

  /* Closing all open rows, and Adding a new row to open array (swipe option)*/
  onRowDidOpen = (rowKey, rowMap) => {
    this.closeAllOpenRows()
    this.openRowRefs.push(rowMap[rowKey]);
  }

  /* Closing all open rows (swipe option)*/
  closeAllOpenRows() {
    this.openRowRefs.forEach(ref => {
      ref.closeRow && ref.closeRow();
    });
  }

  //Class Methods

  /* Calling api to fetch todos */
  fetchToDos = async () => {
    let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
    let objData = { account: this.props.account.id, is_completed: false, all_item_types: true, is_sub_view: true }
    ApiHelper.getWithParam(ApiHelper.Apis.ToDos, objData, this, true, authHeader).then((response) => {
      var arrMainTodos = []
      response.forEach(elementMain => {
        var elementMainObj = { ...elementMain }
        elementMainObj.sub = []
        var arrSubTodos = []
        if (elementMain.sub && elementMain.sub.length > 0) {
          elementMain.sub.forEach(element => {
            if (element.updated_at && element.is_completed) {
              let date = Moment(element.updated_at)//CommonFunctions.utcToLocalTimeZone(element.updated_at, DateFormat.YYYYMMDDTHHMMSS)
              let now = Moment();
              let workingHours = Moment.duration(now.diff(date)).asHours()
              if (workingHours <= 24) {
                arrSubTodos.push(element)
              }
            } else {
              arrSubTodos.push(element)
            }
          });
        }
        elementMainObj.sub = arrSubTodos
        if (arrSubTodos.length > 0) {
          arrMainTodos.push(elementMainObj)
        }
      });
      this.setState({ dataSource: arrMainTodos })
    })
      .catch((response) => {
        ApiHelper.handleErrorAlert(response)
      })
  }

  /* Calling api to change todo status (is completed / not completed)*/
  setToDoStatus = async (row, parentRow) => {
    let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
    const status = row.item.is_completed

    const arrSource = this.state.dataSource
    arrSource[parentRow.index].sub[row.index].is_completed = status === true ? false : true
    this.setState({ dataSource: arrSource });

    let objData = { is_completed: status === true ? false : true }
    ApiHelper.putWithParam(ApiHelper.Apis.ToDos + `/${row.item.id}`, objData, this, true, authHeader).then((response) => {
      // const arrSource = this.state.dataSource
      // arrSource[parentRow.index].sub[row.index].is_completed = status === true ? false : true
      // this.setState({ dataSource: arrSource });
    })
      .catch((response) => {
        ApiHelper.handleErrorAlert(response)
        this.fetchToDos()
      })
  }


  /* Calling api to delete todo */
  deleteToDo(row, parentRow) {
    let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
    let objData = {}
    ApiHelper.deleteWithParam(ApiHelper.Apis.ToDos + `/${row.item.id}`, objData, this, true, authHeader).then((response) => {
      const arrSource = this.state.dataSource
      arrSource[parentRow.index].sub.splice(row.index, 1)
      this.setState({ dataSource: arrSource });
      Toast.show({
        text: `ToDo #${row.item.id} has been removed.`,
        position: 'top',
        duration: 3000,
        type: 'success',
        style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
      })
    })
      .catch((response) => {
        ApiHelper.handleErrorAlert(response)
      })
  }

  /* Redering no data view */
  renderNoData() {
    if (this.state.loading && this.state.dataSource.length == 0 && (this.props.account)) {
      return (
        <Animatable.View animation={'fadeIn'} style={styles.noDataContainer}>
          <Label style={styles.noDataTitleStyle}>
            ToDos will appear here.
          </Label>
        </Animatable.View>
      )
    } else if (!this.state.loading && this.state.dataSource.length == 0) {
      return (
        <Animatable.View animation={'zoomIn'} delay={100} style={[styles.noDataContainer, { flexGrow: 1, justifyContent: 'flex-end' }]}>
          <Image style={styles.noDataIcon} source={Images.nodata} />
          <Label style={styles.noDataTitleStyle}>
            {Messages.NoData}
          </Label>
        </Animatable.View>
      )
    }
    return (null)
  }

  /* Rendering todo row */
  renderRow(row, parentRow) {
    return (
      <Animatable.View useNativeDriver animation={'fadeIn'} >
        <CardItem button activeOpacity={1} style={styles.reusableRowContainer} onPress={() => {
          if (!this.state.loading) {
            this.setToDoStatus(row, parentRow)
          }
        }}>
          <View style={styles.todoRowContainer}>
            <TouchableOpacity onPress={() => {
              if (!this.state.loading) {
                this.setToDoStatus(row, parentRow)
              }
            }}>
              <Image style={styles.leftIcon} source={row.item.is_completed ? Images.tick : Images.nontick} />
            </TouchableOpacity>
            <View style={styles.toDoContainer}>
              <Label style={[styles.todoTitle, row.item.is_completed ? { textDecorationLine: 'line-through' } : {}]}>{(row.item.title && row.item.title != '' ? `${row.item.title}` : '') + (row.item.text && row.item.text != '' && row.item.text != 'undefined' ? `\n${row.item.text}` : '')}</Label>
              {row.item.due_date && row.item.due_date != '' ?
                <View style={styles.dateContainer}>
                  <Label style={styles.dateText}>{row.item.due_date && row.item.due_date != '' ? `Due ${CommonFunctions.utcToLocalTimeZone(row.item.due_date, DateFormat.DDMMMYYYY)}` : ''}</Label>
                </View>
                : null}
            </View>
          </View>
        </CardItem>
      </Animatable.View>
    )
  }

  /* Rendering todo title at the top of todos list */
  renderTitle(parentRow) {
    return (
      <Animatable.View useNativeDriver animation={'fadeInUpBig'}>
        <Label style={styles.todoHeaderTitle}>{parentRow.item.name}</Label>
        {parentRow.item.project_name && parentRow.item.project_name != '' ?
          <Label style={styles.ticketTitle}>{parentRow.item.project_name}</Label>
          : null}
        {parentRow.item.list_ticket_number ?
         <TouchableOpacity activeOpacity={0.7} onPress={() => {
          if (parentRow.item && parentRow.item.list_ticket_id && parentRow.item.list_ticket_id != null && parentRow.item.list_ticket_id != 0) {
            this.props.navigation.push('TicketDetails', { ticket: { key: parentRow.item.list_ticket_id, number: parentRow.item.list_ticket_number, subject: parentRow.item.list_ticket_subject, status: '' } });
          }
        }}>
          <Label style={styles.ticketTitle}>{(parentRow.item.list_ticket_number ? `${this.state.ticketTitle} #${parentRow.item.list_ticket_number} ` : '')}<Label style={styles.ticketNameTitle}>{parentRow.item.list_ticket_subject}</Label></Label>
        </TouchableOpacity>
          : null}
        <SwipeListView
          ref={(ref) => { this.flatLisRef = ref }}
          onRowDidOpen={this.onRowDidOpen}
          disableRightSwipe
          data={parentRow.item.sub}
          renderItem={(row) => this.renderRow(row, parentRow)}
          keyExtractor={(item, index) => index.toString()}
          renderHiddenItem={(row, rowMap) => (
            <View style={styles.rowBack}>
              <Animatable.View animation={'zoomIn'} delay={650} style={[styles.backBtnRightContainer, { width: 150, bottom: 5 }]}>
                <Button transparent style={styles.backRightBtnRight} onPress={() => {
                  this.flatLisRef.safeCloseOpenRow();
                  this.closeAllOpenRows()
                  this.props.mainState.props.navigation.push('AddEditToDo', { todo: row.item, parentTodo: parentRow.item });
                  // this.deleteRow(row);
                }}>
                  <Image style={styles.swipeActionButtonIcon} source={Images.edit} />
                  {/* <Text style={[styles.backTextWhite, { color: Colors.green }]} uppercase={false}>Edit</Text> */}
                </Button>
                <Button transparent style={styles.backRightBtnRight} onPress={() => {
                  this.flatLisRef.safeCloseOpenRow();
                  this.closeAllOpenRows()
                  CommonFunctions.presentAlertWithAction(`Do you really want to remove ToDo - ${row.item.title}`, 'Delete').then((isYes) => {
                    this.deleteToDo(row, parentRow);
                  })
                }}>
                  <Image style={styles.swipeActionButtonIcon} source={Images.swipeToDelete} />
                  {/* <Text style={[styles.backTextWhite, { color: Colors.placeholderError }]} uppercase={false}>Delete</Text> */}
                </Button>
              </Animatable.View>
            </View>
          )}
          leftOpenValue={150}
          rightOpenValue={-150}
          previewRowKey={this.state.showSwipwToDeletePreview ? '0' : ''}
          previewOpenValue={-90}
          previewOpenDelay={1000}
          closeOnScroll={false}
        />
      </Animatable.View>
    )
  }

  /* What to display on the screen */
  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.mainContainer}>
          {this.renderNoData()}
          <FlatList
            ref={(ref) => { this.flatMainListRef = ref; }}
            contentContainerStyle={styles.flatListPadding}
            data={this.state.dataSource}
            renderItem={(parentRow) => this.renderTitle(parentRow)}
            keyExtractor={(item, index) => index.toString()}
          />
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 4 }}>
            <LoaderBar show={this.state.loading} />
          </View>
        </View>
      </SafeAreaView>
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
export default connect(mapStateToProps)(AccountToDos);