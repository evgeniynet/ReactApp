/* Imports */
import React, { Component } from 'react'
import { View, Platform, StatusBar, SafeAreaView, } from 'react-native'
import { Container } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import Pdf from 'react-native-pdf';

import { NavigationBar } from '../../../Navigation/NavigationBar';
import { Colors } from '../../../Themes';
import LinearGradient from 'react-native-linear-gradient';

// Styless
import styles from './Styles/AccountInfoStyles'

class PdfViewer extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            source: null
        };
    }

    componentDidMount() {
        this.setState({
            loading: true,
            source: null
        });

        if (this.props.navigation.state.params !== undefined) {
            if (this.props.navigation.state.params.pdf !== undefined) {
                console.log('====================================');
                console.log(this.props.navigation.state.params.pdf.replace(' ', ''));
                console.log('====================================');
                this.setState({ source: { uri: this.props.navigation.state.params.pdf.replace(' ', '') } })
            }
        }

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
                        showTitle={'Files'}
                    />
                </SafeAreaView>
                <View style={styles.contentContainer}>
                    <SafeAreaView style={styles.mainContainer}>
                        <View style={styles.mainContainer}>
                            {this.state.source ?
                                <Pdf
                                    source={this.state.source}
                                    onLoadComplete={(numberOfPages, filePath) => {
                                        console.log(`number of pages: ${numberOfPages}`);
                                    }}
                                    onPageChanged={(page, numberOfPages) => {
                                        console.log(`current page: ${page}`);
                                    }}
                                    onError={(error) => {
                                        console.log(error);
                                    }}
                                    onPressLink={(uri) => {
                                        console.log(`Link presse: ${uri}`)
                                    }}
                                    style={{
                                        flex: 1,
                                    }} />
                                : null}
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
export default connect(mapStateToProps)(PdfViewer);