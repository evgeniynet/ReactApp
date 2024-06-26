/* Imports */
import React, { Component } from 'react'
import { Image, View, Platform, SafeAreaView, } from 'react-native';
import Modal from 'react-native-modal';
import { Button } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Animatable from 'react-native-animatable';
import Moment from 'moment';

import { Images, Colors, Metrics } from '../Themes';
import styles from './Styles/DatePickerStyles';

/* Exporting class */
export default class DatePickerView extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props);
    }

    state = {
        date: (this.props.selectedDate != '' && this.props.selectedDate != undefined) ? (new Date(this.props.selectedDate)) : (new Date()),
        mode: this.props.mode ?? 'date',
        minDate: this.props.minDate,
        maxDate: this.props.maxDate,
    }

    //Actions
    /* Returns the selected date */
    onChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.props.selectedDate;
        // console.log('====================================');
        // console.log(currentDate);
        // console.log('====================================');
        this.props.dateDidChange(currentDate)
        if (Platform.OS === 'android') {
            this.props.dismissPopup()
        }
    };


    /* What are displaying on the screen */
    render() {
        if (Platform.OS === 'ios') {
            { (this.props.selectedDate != '' && this.props.selectedDate != undefined) ? null : setTimeout(() => this.onChange(undefined, new Date()), 100) }
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
                        <Animatable.View animation={'bounceInUp'} duration={400} style={styles.pickerContainer} >
                            {/* <View style={styles.pickerContainer} > */}
                            <SafeAreaView>
                                <Button
                                    transparent
                                    style={styles.closeButtonContainer}
                                    onPress={() => this.props.dismissPopup()} >
                                    <Image style={styles.closeButtonIcon} source={Images.cancel} />
                                </Button>
                                <DateTimePicker
                                    style={styles.picker}
                                    testID="dateTimePicker"
                                    // timeZoneOffsetInMinutes={0}
                                    value={this.state.date}
                                    minimumDate={this.state.minDate}
                                    maximumDate={this.state.maxDate}
                                    // maximumDate={this.state.mode == 'date' ? (new Date()) : null}
                                    mode={this.state.mode}
                                    is24Hour={true}
                                    display={this.state.mode == 'date' ? "inline" : 'spinner'}
                                    onChange={(event, selectedDate) => {
                                        this.setState({ date: selectedDate })
                                        this.onChange(event, selectedDate)
                                    }}
                                    onTouchCancel={(event, selectedDate) => this.props.dismissPopup()}
                                    onRequestClose={(event, selectedDate) => this.props.dismissPopup()}
                                />
                            </SafeAreaView>
                            {/* </View> */}
                        </Animatable.View>
                    </Button>
                </Modal>
            )
        } else {
            return (
                <DateTimePicker
                    // ref={(ref) => this.androidDatePickerRef = ref}
                    testID="dateTimePicker"
                    // timeZoneOffsetInMinutes={0}
                    value={this.state.date}
                    minimumDate={this.state.minDate}
                    maximumDate={this.state.maxDate}//{this.state.mode == 'date' ? (new Date()) : null}
                    mode={this.state.mode}
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedDate) => this.onChange(event, selectedDate)}
                    onTouchCancel={() => { this.props.dismissPopup() }}
                    onRequestClose={() => { this.props.dismissPopup() }}
                />
            )
        }
    }
}
