/* Imports */
import React, { Component } from 'react'
import { Image, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { Button, Text, CardItem, Left, Body, Label, Input } from 'native-base';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';

import { Images, Colors } from '../../../Themes';
import styles from './Styles/UsersSelectionStyles';
import * as Animations from '../../../Components/Animations';

/* Exporting class */
export default class UsersSelection extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props);
        this.state = { searchString: '', dataSourceForDisplay: this.props.dataSource ?? [], selectedData: this.props.selectedData ?? [] }
    }

    //Actions
    /* Returns the selected option */
    onSelectionChange = (selected) => {
        this.props.selectionDidChange('', this.state.selectedData)
    };

    /* Filtering user based on searched text */
    searchNow() {
        if (this.state.searchString.trim() !== '') {
            const arrSearchResult = this.props.dataSource.filter((obj) => {
                return obj.firstname.includes(this.state.searchString) || obj.lastname.includes(this.state.searchString) || obj.email.includes(this.state.searchString)//obj.startsWith(value)
            })
            this.setState({ dataSourceForDisplay: arrSearchResult })
        } else {
            this.setState({ dataSourceForDisplay: this.props.dataSource })
        }
    }

    /* Rendering option  */
    renderRow(row, item, index) {

        const isCenterAlignText = this.props.isCenterAlignText !== undefined ? this.props.isCenterAlignText : false
        return (
            // <Animatable.View useNativeDriver={true} animation={'fadeInUp'}>
            <CardItem button style={styles.rowContainer} onPress={() => {
                var arrSelected = this.state.selectedData
                var isRemoved = false
                for (let index = 0; index < arrSelected.length; index++) {
                    const element = arrSelected[index];
                    if (element.id == row.item.id) {
                        arrSelected.splice(index, 1)
                        isRemoved = true
                    }
                }
                if (!isRemoved) {
                    arrSelected.push(row.item)
                }
                this.setState({ selectedData: arrSelected })
            }}>
                <Left>
                    <Body style={styles.titleContainer}>
                        <Image style={styles.slectionIcon} source={this.isSelected(row.item) ? Images.tick : Images.nontick} />
                        <Text
                            uppercase={false}
                            style={[styles.title,
                            isCenterAlignText ? { textAlign: 'center' } : {}]}
                        >
                            {row.item.firstname + ' ' + row.item.lastname + ` (${row.item.email})`}
                        </Text>
                    </Body>
                </Left>
            </CardItem>
            // </Animatable.View>
        )
    }

    /* Returns true if it's selected */
    isSelected(item) {
        var isSelected = false
        this.state.selectedData.forEach(element => {
            if (item.id == element.id) {
                isSelected = true
            }
        });
        return isSelected
    }

    /* What are displaying on the screen */
    render() {
        return (
            <Modal
                style={styles.modelContainer}
                animationType={'fade'}
                transparent={true}
                visible={true}
                onRequestClose={() => { this.props.dismissPopup() }}
            >
                <Button activeOpacity={1} style={styles.backgroundButton} onPress={() => {
                    // this.props.dismissPopup()
                }}>
                    <Animatable.View animation={'fadeInUp'} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 100, backgroundColor: Colors.contentBg }} />
                    <SafeAreaView>
                        <Animatable.View animation={'slideInUp'} duration={800} style={styles.container} >
                            <Button
                                transparent
                                style={styles.closeButtonContainer}
                                onPress={() => this.props.dismissPopup()} >
                                <Image style={styles.closeButtonIcon} source={Images.cancel} />
                            </Button>
                            <Animatable.View animation={'fadeIn'} style={styles.searchContainer}>
                                <Input
                                    style={styles.searchInput}
                                    placeholder={'Search Name'}
                                    placeholderTextColor={Colors.secondary}
                                    value={this.state.searchString}
                                    onChangeText={value => {
                                        this.setState({
                                            searchString: value
                                        })
                                        setTimeout(() => {
                                            this.searchNow()
                                        }, 100)
                                    }}
                                    autoCapitalize='sentences'
                                    autoCorrect={false}
                                    returnKeyType={'search'}
                                    onSubmitEditing={() => {
                                        this.searchNow()
                                    }}
                                    selectionColor={Colors.mainPrimary}
                                    blurOnSubmit={false}
                                    keyboardAppearance='dark'
                                    ref={input => {
                                        this.searchRef = input;
                                    }}
                                />
                                <TouchableOpacity style={styles.searchRightIcon} onPress={() => {
                                    this.searchNow()
                                }}>
                                    <Image style={styles.clearText} source={Images.search} />
                                </TouchableOpacity>
                            </Animatable.View>
                            <Label style={styles.listTitle}>CC</Label>
                            <FlatList
                                enableEmptySections
                                data={this.state.dataSourceForDisplay}
                                renderItem={(row, item, index) => this.renderRow(row, item, index)}
                                keyExtractor={(item, index) => index.toString()}
                                contentContainerStyle={styles.flatListContainer}
                            />
                            <TouchableOpacity activeOpacity={0.7} style={styles.buttonContainer} onPress={() => { this.onSelectionChange(); }}>
                                <Text style={styles.buttonText}>Save & Close</Text>
                            </TouchableOpacity>
                        </Animatable.View>
                    </SafeAreaView>
                </Button>
            </Modal>
        )
    }
}
