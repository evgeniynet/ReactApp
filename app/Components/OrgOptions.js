/* Imports */
import React, { Component } from 'react'
import { Image, View, FlatList, SafeAreaView } from 'react-native';
import { Button, Text, CardItem, Left, Body, } from 'native-base';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

import { Images, Colors, Metrics } from '../Themes';
import styles from './Styles/DropDownOptionsStyles';
import * as Animations from './Animations';

/* Exporting class */
export default class OrgOptions extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props);
        this.state = { show: false };
    }

    componentDidMount() {
        this.setState({ show: true })
    }

    //Actions
    /* Returns the selected option */
    onSelectionChange = (selected) => {
        this.props.selectionDidChange(selected.item)
    };

    //Class Methods
    /* Rendering option  */
    renderRow(row, item, index) {
        const iconText = row.item.icon !== undefined ? row.item.icon + ' ' : ''
        const isCenterAlignText = this.props.isCenterAlignText !== undefined ? this.props.isCenterAlignText : false
        return (
            // <Animatable.View animation={'fadeInUp'}>
            <CardItem button style={[styles.rowContainer, { backgroundColor: Colors.clear }]} onPress={() => { this.onSelectionChange(row) }}>
                <Left>
                    <Body>
                        <Text
                            // uppercase={true}
                            style={[this.props.selected.key === row.item.key && this.props.selected.instances[0].key == row.item.instances[0].key ? styles.selectedDarkBg : styles.titleDarkBg,
                            isCenterAlignText ? { textAlign: 'center' } : {}]}
                        >
                            {iconText + `${row.item.name} ${row.item.instances[0].name}`}
                        </Text>
                    </Body>
                </Left>
            </CardItem>
            // </Animatable.View>
        )
    }

    /* Rendering model content */
    renderContent() {
        return (
            <Button activeOpacity={1} style={[styles.backgroundButton, { backgroundColor: Colors.snow, flexDirection: 'column' }]} onPress={() => {
                // if (this.props.canDismiss) {
                //     this.props.dismissPopup() 
                // }
            }}>
                <Animatable.View pointerEvents='none' delay={100} animation={'zoomIn'} style={styles.logoContainer}>
                    <Image style={styles.logo} source={Images.logo} />
                    {/* <Animatable.Image animation={'zoomIn'} delay={100} style={styles.switchOrgIcon}  /> */}
                </Animatable.View>
                <Animatable.View
                    animation={'slideInUp'}
                    // delay={500}
                    delay={100}
                    duration={800}
                    style={[styles.container, {
                        backgroundColor: Colors.mainPrimary,
                        overflow: 'hidden'
                    }]}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        colors={
                            [Colors.mainPrimary,
                            Colors.secondary]}
                        style={{}}>
                        {/* <View style={styles.container}> */}
                        <SafeAreaView style={{ flex: 1 }}>
                            <Button
                                transparent
                                style={[styles.closeButtonContainer, { backgroundColor: Colors.clear }]}
                                onPress={() => {
                                    if (this.props.canDismiss) {
                                        this.props.dismissPopup()
                                    }
                                }}>
                                {this.props.canDismiss ?
                                    <Image style={styles.closeButtonIcon} source={Images.close} />
                                    : <View style={styles.closeButtonIcon} />}
                            </Button>
                            <FlatList
                                enableEmptySections
                                data={this.props.dataSource}
                                renderItem={(row, item, index) => this.renderRow(row, item, index)}
                                keyExtractor={(item, index) => index.toString()}
                                contentContainerStyle={styles.flatListContainer}
                            />
                        </SafeAreaView>
                    </LinearGradient>
                    {/* </View> */}
                </Animatable.View>
            </Button>
        )
    }

    /* What are displaying on the screen */
    render() {
        if (this.props.isShowAsModal) {
            return (
                <Modal
                    style={styles.modelContainer}
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.show}
                    animationIn={'slideInUp'}
                    animationOut={'slideOutDown'}
                    // swipeDirection="down"
                    // onSwipeComplete={() => { this.props.dismiss() }}
                    onRequestClose={() => {
                        if (this.props.canDismiss) {
                            this.props.dismissPopup()
                        }
                    }}
                >
                    {this.renderContent()}
                </Modal>
            )
        } else {
            return (
                <Animatable.View animation={'fadeIn'} style={[styles.modelContainer, styles.backgroundImage]} >
                    {this.renderContent()}
                </Animatable.View>
            )
        }
    }
}
