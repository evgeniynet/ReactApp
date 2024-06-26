/* Imports */
import React, { Component } from 'react'
import { View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Button, Text, Label, Textarea, } from 'native-base';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';

import { Colors } from '../../../Themes';
import styles from './Styles/NextStepStyles';
import * as Animations from '../../../Components/Animations';

/* Exporting class */
export default class NextStep extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props);
        this.state = { subject: this.props.subject ? this.props.subject : '', step: this.props.step ? this.props.step : '' }
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
                    <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', }} >
                        <Animatable.View animation={'slideInUp'} duration={800} style={styles.container} >
                            <SafeAreaView>
                                <Button
                                    transparent
                                    activeOpacity={1}
                                    style={styles.topContainer}>
                                    <Label style={styles.title}>Edit</Label>
                                </Button>
                                <Label style={styles.subTitle}>Subject</Label>
                                <View>
                                    <View style={styles.textViewConatiner}>
                                        <Textarea
                                            style={styles.textView}
                                            multiline={false}
                                            placeholder='Enter your note here...'
                                            placeholderTextColor={Colors.placeholder}
                                            selectionColor={Colors.mainPrimary}
                                            value={this.state.subject}
                                            onChangeText={value => {
                                                this.setState({ subject: value })
                                            }}
                                            ref={input => {
                                                this.noteRef = input;
                                            }}
                                            blurOnSubmit={false}
                                            keyboardAppearance='dark'
                                        />
                                    </View>
                                    <Label style={styles.subTitle}>Next Step</Label>
                                    <View style={styles.textViewConatiner}>
                                        <Textarea
                                            style={styles.textView}
                                            multiline={false}
                                            placeholder='Enter your next step here...'
                                            placeholderTextColor={Colors.placeholder}
                                            selectionColor={Colors.mainPrimary}
                                            value={this.state.step}
                                            onChangeText={value => {
                                                this.setState({ step: value })
                                            }}
                                            ref={input => {
                                                this.noteRef = input;
                                            }}
                                            blurOnSubmit={false}
                                            keyboardAppearance='dark'
                                        />
                                    </View>
                                    <View style={styles.bottomContainer}>
                                        <TouchableOpacity activeOpacity={0.7} style={styles.buttonContainer} onPress={() => {
                                            this.props.dismissPopup()
                                        }}>
                                            <Text style={styles.buttonText}>Close</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity activeOpacity={0.7} style={styles.buttonContainer} onPress={() => {
                                            if (this.state.subject.trim().length > 0) {
                                                this.props.selectionDidChange(this.state.subject, this.state.step)
                                            } else {
                                                this.noteRef._root.focus()
                                            }
                                        }}>
                                            <Text style={styles.buttonText}>Save</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </SafeAreaView>
                        </Animatable.View>
                    </ScrollView>
                </Button>
            </Modal>
        )
    }
}
