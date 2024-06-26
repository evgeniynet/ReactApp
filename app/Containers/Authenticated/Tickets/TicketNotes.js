/* Imports */
import React, { Component } from 'react'
import { Image, View, TouchableOpacity, Platform, SafeAreaView, ScrollView, Keyboard } from 'react-native'
import { Label, Textarea, Toast } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';

import { Images, Colors, Metrics } from '../../../Themes';
import Loader from '../../../Components/Loader';
import ApiHelper from '../../../Components/ApiHelper';

// Styless
import styles from './Styles/TicketNotesStyles'

class TicketNotes extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            isNotesEditingOn: this.props.mainState.isNotesEditingOn ?? false,
            isWorkpadEditingOn: this.props.mainState.isWorkpadEditingOn ?? false,
            notes: '',
            workpad: '',
        };
    }
    
    componentDidMount() {
        setTimeout(() => {
            if (this.props.ticket) {
                this.setState({ ticket: this.props.ticket, notes: this.props.ticket.note, workpad: this.props.ticket.workpad })
            }
        }, 100)
    }

    //Class Methods

    /* Calling api to save note */
    saveNote() {
        let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))
        let obj = {
            action: 'note',
            note: this.state.notes,
        }
        ApiHelper.postWithParam(ApiHelper.Apis.Tickets + `/${this.props.ticket.id}`, obj, this, true, authHeader)
            .then((response) => {
                this.props.mainState.isNotesEditingOn = false
                this.setState({ isNotesEditingOn: false })
            }).catch((response) => {
                if (response.status == 403) {
                    Toast.show({
                        text: response.data,
                        position: 'top',
                        duration: 3000,
                        // type: 'warning',
                        style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
                    })
                } else {
                    ApiHelper.handleErrorAlert(response)
                }
            });
    }

    /* What to display on the screen */
    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <ScrollView
                    keyboardShouldPersistTaps='handled'
                    scrollEventThrottle={16}
                    onScrollEndDrag={(e) => this.props.mainState.handleScroll(e)}
                    onMomentumScrollBegin={(e) => this.props.mainState.handleScrollAndroid(e)}
                    onMomentumScrollEnd={(e) => this.props.mainState.handleScrollAndroid(e)}
                >
                    <View style={styles.mainContainer}>
                        <View>
                            {/* <Label style={[styles.inputTitle, styles.placeholderColor, { marginBottom: 0, marginTop: Metrics.section }]}>Notes</Label> */}
                            <View style={styles.container}>
                                {this.state.isNotesEditingOn ?
                                    <Textarea style={styles.notes}
                                        // pointerEvents={ this.state.isNotesEditingOn ? 'auto' : 'none'}
                                        placeholder='Enter your note here...'
                                        placeholderTextColor={Colors.placeholder}
                                        selectionColor={Colors.mainPrimary}
                                        value={this.state.notes}
                                        onChangeText={value => {
                                            this.props.ticket.note = value
                                            this.setState({ notes: value })
                                        }}
                                        ref={input => {
                                            this.noteRef = input;
                                        }}
                                        blurOnSubmit={false}
                                        keyboardAppearance='dark'
                                    />
                                    : <Label style={styles.notes}>{this.state.notes == '' ? 'Enter your note here...' : this.state.notes}</Label>}
                                <TouchableOpacity style={styles.buttonContainer} onPress={() => {
                                    if (this.state.isNotesEditingOn) {
                                        Keyboard.dismiss()
                                        this.saveNote()
                                    } else {
                                        this.props.mainState.isNotesEditingOn = true
                                        this.setState({ isNotesEditingOn: true })
                                        setTimeout(() => {
                                            this.noteRef._root.focus()
                                        }, 200)
                                    }
                                }}>
                                    <Image style={styles.buttonIcon} source={this.state.isNotesEditingOn ? Images.saveNote : Images.editNote} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <Loader show={this.state.loading} />
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
export default connect(mapStateToProps)(TicketNotes);