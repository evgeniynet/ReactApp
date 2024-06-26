/* Imports */
import React, { Component } from 'react'
import { Image, View, TouchableOpacity, Platform, SafeAreaView, Keyboard, ScrollView } from 'react-native'
import { Label, Textarea, Toast } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';

import { Images, Colors, Metrics } from '../../../Themes';
import ApiHelper from '../../../Components/ApiHelper';
import Loader from '../../../Components/Loader';

// Styless
import styles from './Styles/AccountNotesStyles'

class AccountNotes extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            isNotesEditingOn: this.props.mainState.isNotesEditingOn ?? false
        };
    }
    
    componentDidMount() {
        setTimeout(() => {
            if (this.props.account) {
                this.setState({ notes: this.state.isNotesEditingOn && this.props.mainState && this.props.mainState.notes ? this.props.mainState.notes : (this.props.account.plain_note || ''), })
            }
        }, 100)
    }

    //Class Methods

    /* Calling api to save note */
    saveNote() {
        let obj = {
            note: this.state.notes,
        }

        let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))

        ApiHelper.putWithParam(ApiHelper.Apis.Accounts + `/${this.props.account.id}`, obj, this, true, authHeader)
            .then((response) => {
                this.props.mainState.isNotesEditingOn = false
                this.props.account.plain_note = this.state.notes
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
                <ScrollView keyboardShouldPersistTaps='handled'>
                    <View style={styles.container}>
                        {this.state.isNotesEditingOn ?
                            <Textarea style={styles.notes}
                                placeholder='Enter your note here...'
                                placeholderTextColor={Colors.placeholder}
                                selectionColor={Colors.mainPrimary}
                                value={this.state.notes}
                                onChangeText={value => {
                                    this.props.mainState.notes = value
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
export default connect(mapStateToProps)(AccountNotes);