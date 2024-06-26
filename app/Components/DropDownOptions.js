/* Imports */
import React, { Component } from 'react'
import { Image, View, FlatList, SafeAreaView } from 'react-native';
import { Button, Text, CardItem, Left, Body, Label} from 'native-base';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';

import { Images, Colors, Metrics } from '../Themes';
import styles from './Styles/DropDownOptionsStyles';
import * as Animations from './Animations';

/* Exporting class */
export default class DropDownOptions extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props);
    }

    //Actions
    /* Returns the selected option */
    onSelectionChange = (selected) => {
        if (selected.item.data !== undefined) {
            this.props.selectionDidChange(selected.item.value, selected.item.data)
        } else {
            this.props.selectionDidChange(selected.item.value)
        }
    };

    //Class Methods
    /* Rendering option  */
    renderRow(row, item, index) {
        const iconText = row.item.icon !== undefined ? row.item.icon + ' ' : ''
        const isCenterAlignText = this.props.isCenterAlignText !== undefined ? this.props.isCenterAlignText : false
        return (
            // <Animatable.View animation={'fadeInUp'}>
            <CardItem button style={styles.rowContainer} onPress={() => { this.onSelectionChange(row) }}>
                <Left>
                    <Body>
                        <Text
                            uppercase={false}
                            style={[this.props.selected === row.item.value ? styles.selected : styles.title,
                            isCenterAlignText ? { textAlign: 'center' } : {}]}
                        >
                            {iconText + row.item.value}
                        </Text>
                    </Body>
                </Left>
            </CardItem>
            // </Animatable.View>
        )
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
                <Button activeOpacity={1} style={styles.backgroundButton} onPress={() => this.props.dismissPopup()}>
                    <Animatable.View animation={'slideInUp'} duration={800} style={styles.container} >
                        {/* <View style={styles.container}> */}

                        <SafeAreaView>
                            <Button
                                transparent
                                style={styles.closeButtonContainer}
                                onPress={() => this.props.dismissPopup()} >
                                <Image style={styles.closeButtonIcon} source={Images.cancel} />
                            </Button>
                            {this.props.name ?
                            <Label style={styles.listTitle}>Select {this.props.name}:</Label>
                            :null}
                            <FlatList
                                enableEmptySections
                                data={this.props.dataSource}
                                renderItem={(row, item, index) => this.renderRow(row, item, index)}
                                keyExtractor={(item, index) => index.toString()}
                                contentContainerStyle={styles.flatListContainer}
                            />
                        </SafeAreaView>
                        {/* </View> */}
                    </Animatable.View>
                </Button>
            </Modal>
        )
    }
}
