/* Imports */
import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import { Container } from 'native-base';
import { WebView } from 'react-native-webview';

import styles from './Styles/WebViewInfoStyles';
import { NavigationBar } from '../Navigation/NavigationBar';
import LoaderBar from '../Components/LoaderBar';
import ApiHelper from '../Components/ApiHelper';

/* Exporting class */
export default class WebViewInfo extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props)
        //ApiHelper.Apis.Privacy
        this.state = { loading: false, url: { uri: ApiHelper.Apis.Privacy } };
    }

    componentDidMount() {
        this.setState({
            loading: false,
        });

        if (this.props.navigation.state.params !== undefined) {
            if (this.props.navigation.state.params.title !== undefined && this.props.navigation.state.params.title === 'Forgot Password') {
                this.setState({ url: { uri: ApiHelper.Apis.ForgotPassword } })
            } else if (this.props.navigation.state.params.title !== undefined && this.props.navigation.state.params.title === 'Files') {
                this.setState({ url: { uri: this.props.navigation.state.params.url } })
            }
        }
    }

    /* What are displaying on the screen */
    render() {
        return (
            <Container>
                <SafeAreaView>
                    <NavigationBar
                        navigation={this.props.navigation}
                        showTitle={(this.props.navigation.state.params.title !== '' && this.props.navigation.state.params.title !== undefined) ? this.props.navigation.state.params.title : 'TERMS & CONDITIONS'}
                    />
                </SafeAreaView>
                {/* <Loader show={this.state.loading} /> */}
                <LoaderBar show={this.state.loading} withAppColor />
                <WebView
                    allowsFullscreenVideo={true}
                    scrollIndicatorInsets={{ right: 1 }}
                    style={styles.webViewContainer}
                    source={this.state.url}
                    onLoadStart={() => {
                        this.setState({ loading: true });
                        console.log('Did Start Loading');
                    }}
                    onLoadEnd={() => {
                        this.setState({ loading: false });
                        console.log('Did End Loading');
                    }}
                    contentContainerStyle={{ flex: 1 }}
                    allowsBackForwardNavigationGestures={true}
                />
            </Container>
        )
    }
}