/* Imports */
import React, { Component } from 'react'
import { Image, View, TouchableOpacity, SafeAreaView, FlatList } from 'react-native'
import { Label, CardItem } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';

import { Images } from '../../../Themes';
import { Messages } from '../../../Components/Constants';
import ApiHelper from '../../../Components/ApiHelper';
import LoaderBar from '../../../Components/LoaderBar';

// Styless
import styles from './Styles/AccountProjectsStyles'

class AccountProjects extends Component {

  // Life cycle of class
  /* Initiating state before the component mount. */
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      dataSource: [],
    };
  }
  
  componentDidMount() {
    setTimeout(() => {
      if (this.props.account && this.props.account.projects) {
        // this.setState({ dataSource: this.props.account.projects ?? [] })
        this.fetchProjects()
      }
    }, 100)
  }
//Class Methods

/* Calling api to fetch projects */
fetchProjects = async () => {
  let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
  var objData = {  }
  if (this.props.account) {
      objData.account = this.props.account.id
  } 
  ApiHelper.getWithParam(ApiHelper.Apis.Projects, objData, this, true, authHeader).then((response) => {
      this.setState({ dataSource: response })
  })
      .catch((response) => {
          ApiHelper.handleErrorAlert(response)
      })
}

  /* Rendering no data view */
  renderNoData() {
    if (this.state.loading && this.state.dataSource.length == 0 && (this.props.account)) {
      return (
        <Animatable.View animation={'fadeIn'} style={styles.noDataContainer}>
          <Label style={styles.noDataTitleStyle}>
            Projects will appear here.
          </Label>
        </Animatable.View>
      )
    } else if (!this.state.loading && this.state.dataSource.length == 0) {
      return (
        <Animatable.View animation={'zoomIn'} delay={100} style={[styles.noDataContainer, { flex: 1, justifyContent: 'flex-end' }]}>
          <Image style={styles.noDataIcon} source={Images.nodata} />
          <Label style={styles.noDataTitleStyle}>
            {Messages.NoData}
          </Label>
        </Animatable.View>
      )
    }
    return (null)
  }

  /* Rendering row */
  renderRow(row) {
    return (
      <Animatable.View animation={'fadeInUpBig'}>
        <CardItem
          activeOpacity={0.7}
          style={styles.reusableRowContainer}
          button onPress={() => {

          }}>
          <View>
            <View style={styles.topContainer}>
              <Label style={styles.titleText}>{row.item.name}</Label>
              <View style={styles.topRightContainer}>
                <Label style={styles.completeText}>{`${row.item.complete}%`}</Label>
                <Animatable.Image
                  // delay={300}
                  animation={'rotate'}
                  style={styles.arrowIcon}
                  source={Images.complete}
                />
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={() => {

            }}>
              <Animatable.View >
                <View style={styles.ticketsCounterMainContainer}>
                  <View style={styles.ticketsCounter}>
                    <Image style={styles.ticktIcon} source={Images.tickets} />
                    <Label style={styles.ticketText}>Open Tickets</Label>
                    <Label style={styles.ticketCountText}>{row.item.open_tickets}</Label>
                  </View>
                  <View style={styles.ticketsCounter}>
                    <Image style={styles.ticktIcon} source={Images.smTimelogs} />
                    <Label style={styles.ticketText}>Logged</Label>
                    <Label style={styles.ticketCountText}>{row.item.logged_hours}</Label>
                  </View>
                  <View style={styles.ticketsCounter}>
                    <Image style={styles.ticktIcon} source={Images.smTimelogs} />
                    <Label style={styles.ticketText}>Remain</Label>
                    <Label style={styles.ticketCountText}>{row.item.remaining_hours}</Label>
                  </View>
                </View>
              </Animatable.View>
            </TouchableOpacity>
          </View>
        </CardItem>
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
            ref={(ref) => { this.flatLisRef = ref; }}
            contentContainerStyle={styles.flatListPadding}
            data={this.state.dataSource}
            renderItem={(row) => this.renderRow(row)}
            keyExtractor={(item, index) => index.toString()}
            keyboardShouldPersistTaps='handled'
          />
        </View>
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 4 }}>
            <LoaderBar show={this.state.loading} />
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
export default connect(mapStateToProps)(AccountProjects);