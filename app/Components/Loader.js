/* Imports */
import React, { Component } from 'react'
import { View, Modal, ActivityIndicator, Text } from 'react-native'
import Spinner from 'react-native-spinkit';

import { Colors, ApplicationStyles } from '../Themes';
import styles from './Styles/LoaderStyles';

/* Exporting class */
export default class Loader extends Component {

    /* Variables */
    static = { show: false, withAppColor: false };

    /* What are displaying on the screen */
    render() {
        let loaderComponent = null
        if (this.props.show) {
            return (
                <Modal
                    animationType={'none'}
                    transparent={true}
                    visible={this.props.show}
                    onRequestClose={() => null}
                >
                    <View style={[styles.container, this.props.withAppColor ? { backgroundColor: 'rgba(255,255,255,0.6)' } : {}]}>
                        {/* <ActivityIndicator size="large" color={Colors.Title} /> */}
                        <Spinner isVisible={true} size={this.props.withAppColor ? 90 : 70} type='Pulse' color={this.props.withAppColor ? Colors.mainPrimary : Colors.mainPrimary} />
                        {this.props.message !== undefined && this.props.message !== '' ? <Text style={styles.message}>{this.props.message}</Text> : null}
                    </View>
                </Modal>
            )
        }
        return loaderComponent
    }
}
