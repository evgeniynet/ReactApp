/* Imports */
import React, { Component } from 'react'
import { View, Platform, StatusBar, SafeAreaView, FlatList } from 'react-native'
import { Container, Label, CardItem } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';

import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Colors } from '../../../Themes';
import LinearGradient from 'react-native-linear-gradient';

// Styless
import styles from './Styles/AccountInfoStyles'

class AccountInfo extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            dataSource: [],
            displayCells: ['BWD Acct#',
                'Acc#',
                'Ref1#',
                'Ref2#',
                'Org / Individual',
                'Acc Rep',
                'Email Suffix',
                'Address 1',
                'Address 2',
                'City',
                'Postal Code',
                'Country',
                'Phone 1',
                'Phone 2',
                'Customer Type',
                'Credit',
                'Payment Status',
                'Classification',
                'Contract Expiration'],
            account: null
        };
    }

    componentDidMount() {
        this.setState({
            loading: true,
            searchString: '',
            dataSource: [],
            page: 0,
            isLoadingMore: false,
            canLoadMore: true
        });

        /* Setting account info to state */
        if (this.props.navigation.state.params !== undefined) {
            if (this.props.navigation.state.params.account !== undefined) {
                let account = this.props.navigation.state.params.account
                var arrData = []

                this.state.displayCells.forEach(element => {
                    switch (element) {
                        case 'BWD Acct#':
                            if (account && account.bwd_number) {
                                arrData.push({ title: element, value: account.bwd_number })
                            }
                            break;
                        case 'Acc#':
                            if (account && account.number) {
                                arrData.push({ title: element, value: account.number })
                            }
                            break;
                        case 'Ref1#':
                            if (account && account.ref1) {
                                arrData.push({ title: element, value: account.ref1 })
                            }
                            break;
                        case 'Ref2#':
                            if (account && account.ref2) {
                                arrData.push({ title: element, value: account.ref2 })
                            }
                            break;
                        case 'Org / Individual':
                            if (account && account.is_organization) {
                                arrData.push({ title: element, value: 'Organization' })
                            } else {
                                arrData.push({ title: element, value: 'Individual' })
                            }
                            break;
                        case 'Acc Rep':
                            if (account && account.representative_name) {
                                arrData.push({ title: element, value: account.representative_name })
                            }
                            break;
                        case 'Email Suffix':
                            if (account && account.email_suffix) {
                                arrData.push({ title: element, value: account.email_suffix })
                            }
                            break;
                        case 'Address 1':
                            if (account && account.address1) {
                                arrData.push({ title: element, value: account.address1 })
                            }
                            break;
                        case 'Address 2':
                            if (account && account.address2) {
                                arrData.push({ title: element, value: account.address2 })
                            }
                            break;
                        case 'City':
                            if (account && account.city) {
                                arrData.push({ title: element, value: account.city })
                            }
                            break;
                        case 'Postal Code':
                            if (account && account.zipcode) {
                                arrData.push({ title: element, value: account.zipcode })
                            }
                            break;
                        case 'Country':
                            if (account && account.country) {
                                arrData.push({ title: element, value: account.country })
                            }
                            break;
                        case 'Phone 1':
                            if (account && account.phone1) {
                                arrData.push({ title: element, value: account.phone1 })
                            }
                            break;
                        case 'Phone 2':
                            if (account && account.phone2) {
                                arrData.push({ title: element, value: account.phone2 })
                            }
                            break;
                        default:
                            break;
                    }
                });
                this.setState({ account: this.props.navigation.state.params.account, dataSource: arrData })
            }
        }

    }

    /* Rendering row */
    renderRow(row) {
        return (
            <Animatable.View useNativeDriver={true} animation={'fadeInUp'} style={{ flex: 1 }}>
                <Label style={styles.titleText}>{row.item.title}</Label>
                <CardItem style={styles.inputContainer}>
                    <Label style={styles.inputTitle}>{row.item.value}</Label>
                </CardItem>
            </Animatable.View>
        )
    }

    /* What to display on the screen */
    render() {
        return (
            <Container>
                {StatusBar.setBarStyle('light-content', true)}
                {Platform.OS === 'ios' ? null : StatusBar.setBackgroundColor(Colors.mainPrimary)}
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={
                        [Colors.mainPrimary,
                        Colors.secondary]}
                    style={styles.backgroundImage} />
                <SafeAreaView>
                    <NavigationBar
                        isTransparent
                        navigation={this.props.navigation}
                        showTitle={(this.state.account && this.state.account.name) ? this.state.account.name : 'Account Info'}
                    />
                </SafeAreaView>
                <View style={styles.contentContainer}>
                    <SafeAreaView style={styles.mainContainer}>
                        <View style={styles.mainContainer}>
                            <FlatList
                                ref={(ref) => { this.flatLisRef = ref; }}
                                contentContainerStyle={styles.flatListPadding}
                                data={this.state.dataSource}
                                renderItem={(row) => this.renderRow(row)}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </SafeAreaView>
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
export default connect(mapStateToProps)(AccountInfo);