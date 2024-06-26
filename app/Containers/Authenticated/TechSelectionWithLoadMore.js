/* Imports */
import React, { Component } from 'react'
import { Image, FlatList, SafeAreaView, TouchableOpacity, Keyboard, View } from 'react-native';
import { Button, Text, CardItem, Left, Body, Label, Input } from 'native-base';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';

import { Images, Colors } from '../../Themes';
import styles from './Styles/SelectionStyles';
import * as Animations from '../../Components/Animations';
import { Messages } from '../../Components/Constants';
import ApiHelper from '../../Components/ApiHelper';
import Loader from '../../Components/Loader';
import LoaderBar from '../../Components/LoaderBar';

/* Exporting class */
class TechSelectionWithLoadMore extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            loadingBar: false,
            searchString: '',
            dataSource: this.props.dataSource ?? [],
            dataSourceMain: this.props.dataSource ?? [],
            selectedData: this.props.selectedData ?? {},
            page: 0,
            isLoadingMore: false,
            canLoadMore: true,
            account: this.props.account
        }
    }

    componentDidMount() {
        this.setState({
            page: 0,
            isLoadingMore: false,
            canLoadMore: true,
            //account: null
            
        })
        this.fetchData()
    }

    componentWillUnmount() {
        Keyboard.dismiss();
    }

    //Actions
    /* Returns the selected option */
    onSelectionChange = (selected) => {
        this.props.selectionDidChange('', this.state.selectedData)
    };

    /* Filtering options based on searched text */
    searchNow() {
        if (this.state.searchString.trim() !== '') {
            if (this.state.searchString.trim().length > 3) {
                this.setState({
                    page: 0,
                    isLoadingMore: false,
                    canLoadMore: true,
                })
                setTimeout(() => {
                    this.fetchTech(true)
                }, 100)
            } else {
                const arrSearchResult = this.state.dataSourceMain.filter((obj) => {
                    return obj.value_title.toLowerCase().includes(this.state.searchString.toLowerCase()) //obj.startsWith(value)
                })
                this.setState({ dataSource: arrSearchResult })
            }
        } else {
            // this.setState({ dataSource: this.state.dataSourceMain })
            this.fetchData()
        }
    }

    //Class Methods
    /* Calling function for fetch data from page 0 */
    fetchData = () => {
        if (!this.state.loading) {
            this.setState({
                page: 0,
                isLoadingMore: false,
                canLoadMore: true,
            })
            setTimeout(() => {
                this.fetchTech()
            }, 100)
        }
    }

    /* Calling api to load more data */
    handleLoadMore() {
        if (!this.state.loading && !this.state.loadingBar && !this.state.isLoadingMore && this.state.canLoadMore && this.state.searchString.trim() == '') {
            setTimeout(() => {
                this.setState({ page: this.state.page + 1, isLoadingMore: true })
                setTimeout(() => this.fetchTech(), 100)
            }, 100)
        }
    }

    /* Calling api to fetch technicians */
    fetchTech(isSearch = false) {
        let pageLimit = 25
        let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
        var objData = { }
        if (this.state.page == 0) {
            objData.limit = pageLimit
        } else {
            objData.limit = pageLimit,
            objData.page = this.state.page
        }
        if (isSearch) {
            objData.search = this.state.searchString
        }

        //console.log("this.state.account", this.state.account)
        //objData.accountId = -1;
        if (this.state.account && this.state.account.id != null && this.state.account.id != undefined) {
            objData.accountId = this.state.account.id < 1 ? -1 : this.state.account.id
        }

        ApiHelper.getWithParam(ApiHelper.Apis.Technicians, objData, this, this.state.page == 0, authHeader).then((response) => {
            if (this.state.page !== 0 && response) {
                if (response.length == 0) {
                    this.setState({ page: this.state.page - 1, canLoadMore: false })
                } else if (response.length < pageLimit) {
                    this.setState({ canLoadMore: false })
                }
                var arr = [...this.state.dataSourceMain, ...response]
                var arrAccounts = []
                for (const key in arr) {
                    if (Object.hasOwnProperty.call(arr, key)) {
                        var obj = arr[key];
                        obj.value_title = (obj.type == 'contractor' ? 'Contractor: ' : '') + obj.firstname + ' ' + obj.lastname + (obj.type == 'queue' ? '' : ` (${obj.email})`)
                        arrAccounts.push(obj)
                    }
                }
                this.setState({ dataSource: arrAccounts, dataSourceMain: arrAccounts, isLoadingMore: false })
            } else {
                if (response) {
                    var arrAccounts = []
                    if (this.props.defaultOption) {
                        arrAccounts.push(this.props.defaultOption) 
                    }
                    for (const key in response) {
                        if (Object.hasOwnProperty.call(response, key)) {
                            var obj = response[key];
                            obj.value_title = (obj.type == 'contractor' ? 'Contractor: ' : '') + obj.firstname + ' ' + obj.lastname + (obj.type == 'queue' ? '' : ` (${obj.email})`)
                            arrAccounts.push(obj)
                        }
                    }
                    this.setState({ dataSource: arrAccounts, dataSourceMain: arrAccounts })
                }
            }
        })
            .catch((response) => {
                ApiHelper.handleErrorAlert(response)
            })
    }

    debounce = (callback, delay) => { 
        let timeout = -1;
        return (...args) => {
          if (timeout !== -1) { clearTimeout(timeout); }
          timeout = setTimeout(() => callback(...args), delay);
        };
      }
      debouncedLog = this.debounce( e => { this.searchNow() }, 1000)
      handleSearchChange = e => {
        this.setState({ searchString: e })
        this.debouncedLog(e);
      }    

    /* Rending now data view */
    renderNoData() {
        if (!this.state.loading && !this.state.loadingBar && this.state.searchString.trim() !== '' && this.state.dataSource.length == 0) {
            return (
                <Animatable.View animation={'zoomIn'} style={styles.noDataContainer}>
                    <Image style={styles.noDataIcon} source={Images.nosearch} />
                    <Label style={styles.noDataTitleStyle}>
                        {Messages.NoResultFound}
                    </Label>
                </Animatable.View>
            )
        } else if (!this.state.loading && !this.state.loadingBar && this.state.searchString.trim() == '' && this.state.dataSource.length == 0 && this.props.dataSource.length == 0) {
            return (
                <Animatable.View animation={'zoomIn'} delay={500} style={[styles.noDataContainer, { flex: 1, justifyContent: 'flex-end' }]}>
                    <Image style={styles.noDataIcon} source={Images.nodata} />
                    <Label style={styles.noDataTitleStyle}>
                        {Messages.NoData}
                    </Label>
                </Animatable.View>
            )
        }
        return (null)
    }

    /* Rendering option  */
    renderRow(row, item, index) {
        const isCenterAlignText = this.props.isCenterAlignText !== undefined ? this.props.isCenterAlignText : false
        return (
            <Animatable.View useNativeDriver animation={this.state.searchString.trim().length == 0 ? 'fadeInUp' : 'pulse'} >
                <CardItem button style={styles.rowContainer} onPress={() => {
                    this.setState({ selectedData: row.item })
                    this.props.selectionDidChange('', row.item)
                }}>
                    <Left>
                        <Body style={styles.titleContainer}>
                            <Text
                                uppercase={false}
                                style={[styles.title,
                                this.isSelected(row.item) ? styles.selected : {},
                                isCenterAlignText ? { textAlign: 'center' } : {}]}
                            >
                                {row.item.value_title}
                            </Text>
                        </Body>
                    </Left>
                </CardItem>
            </Animatable.View>
        )
    }

    /* Returns true if option is already selected */
    isSelected(item) {
        return ((this.state.selectedData && this.state.selectedData.id) ? this.state.selectedData.id == item.id : (this.state.selectedData.value_title == item.value_title))
    }

    /* What are displaying on the screen */
    render() {
        return (
            <Modal
                style={styles.modelContainer}
                animationType={'fade'}
                transparent={true}
                visible={true}
                // swipeDirection="down"
                // onSwipeComplete={() => { this.props.dismiss() }}
                onRequestClose={() => { this.props.dismissPopup() }}
            >
                <Button activeOpacity={1} style={styles.backgroundButton} onPress={() => {
                    // this.props.dismissPopup()
                }}>
                    <Animatable.View animation={'fadeInUp'} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 100, backgroundColor: Colors.contentBg }} />
                    <SafeAreaView>
                        <Animatable.View animation={'slideInUp'} duration={800} style={styles.container} >
                            <Button
                                transparent
                                style={styles.closeButtonContainer}
                                onPress={() => this.props.dismissPopup()} >
                                <Image style={styles.closeButtonIcon} source={Images.cancel} />
                            </Button>
                            <Animatable.View animation={'fadeIn'} style={styles.searchContainer}>
                                <Input
                                    style={styles.searchInput}
                                    placeholder={'Search by name (min 3 letters)'}
                                    placeholderTextColor={Colors.secondary}
                                    value={this.state.searchString}
                                    onChangeText={this.handleSearchChange}
                                    autoCapitalize='sentences'
                                    autoCorrect={false}
                                    returnKeyType={'search'}
                                    onSubmitEditing={() => {
                                        this.searchNow()
                                    }}
                                    selectionColor={Colors.mainPrimary}
                                    blurOnSubmit={false}
                                    keyboardAppearance='dark'
                                    ref={input => {
                                        this.searchRef = input;
                                    }}
                                />
                                <TouchableOpacity style={styles.searchRightIcon} onPress={() => {
                                    this.searchNow()
                                }}>
                                    <Image style={styles.clearText} source={Images.search} />
                                </TouchableOpacity>
                            </Animatable.View>
                            {this.renderNoData()}
                            <FlatList
                                enableEmptySections
                                data={this.state.dataSource}
                                renderItem={(row, item, index) => this.renderRow(row, item, index)}
                                keyExtractor={(item, index) => index.toString()}
                                contentContainerStyle={styles.flatListContainer}
                                onEndReachedThreshold={0.05}
                                onEndReached={() => this.handleLoadMore()}
                            />
                        </Animatable.View>
                        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 4 }}>
                            <LoaderBar show={this.state.loadingBar} />
                        </View>
                    </SafeAreaView>
                    {/* <Loader show={this.state.loading}/> */}
                    {/* </View> */}
                </Button>
            </Modal>
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
export default connect(mapStateToProps)(TechSelectionWithLoadMore);