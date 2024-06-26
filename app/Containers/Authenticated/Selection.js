/* Imports */
import React, { Component } from 'react'
import { Image,  FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { Button, Text, CardItem, Left, Body, Label, Input } from 'native-base';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';

import { Images, Colors } from '../../Themes';
import styles from './Styles/SelectionStyles';
import * as Animations from '../../Components/Animations';
import { Messages } from '../../Components/Constants';

/* Exporting class */
export default class Selection extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props);
        this.state = { searchString: '', dataSourceForDisplay: this.props.dataSource ?? [], selectedData: this.props.selectedData ?? {} }
    }

    //Actions
    /* Returns the selected option */
    onSelectionChange = (selected) => {
        this.props.selectionDidChange('', this.state.selectedData)
    };

    /* Filtering options based on searched text */
    searchNow() {
        if (this.state.searchString.trim() !== '') {
            const arrSearchResult = this.props.dataSource.filter((obj) => {
                return obj.value_title.includes(this.state.searchString) // obj.firstname.includes(this.state.searchString) || obj.lastname.includes(this.state.searchString) || obj.email.includes(this.state.searchString)//obj.startsWith(value)
            })
            this.setState({ dataSourceForDisplay: arrSearchResult })
        } else {
            this.setState({ dataSourceForDisplay: this.props.dataSource })
        }
    }

    //Class Methods

    /* Rending now data view */
    renderNoData() {
        if (this.state.searchString.trim() !== '' && this.state.dataSourceForDisplay.length == 0) {
            return (
                <Animatable.View animation={'zoomIn'} style={styles.noDataContainer}>
                    <Image style={styles.noDataIcon} source={Images.nosearch} />
                    <Label style={styles.noDataTitleStyle}>
                        {Messages.NoResultFound}
                    </Label>
                </Animatable.View>
            )
        } else if (this.state.searchString.trim() == '' && this.state.dataSourceForDisplay.length == 0 && this.props.dataSource.length == 0) {
            return (
                <Animatable.View animation={'zoomIn'} delay={100} style={[styles.noDataContainer, { flex: 1, justifyContent: 'flex-end' }]}>
                    <Image style={styles.noDataIcon} source={Images.nodata} />
                    <Label style={styles.noDataTitleStyle}>
                        {Messages.NoData}
                    </Label>
                </Animatable.View>
            )
        }
        return (null)
    }

    /* Rendering option  */
    renderRow(row, item, index) {
        const isCenterAlignText = this.props.isCenterAlignText !== undefined ? this.props.isCenterAlignText : false
        return (
            <Animatable.View useNativeDriver animation={this.state.searchString.trim().length == 0 ? 'fadeInUp' : 'pulse'} >
                <CardItem button style={styles.rowContainer} onPress={() => {
                    this.setState({ selectedData: row.item })
                    this.props.selectionDidChange('', row.item)
                }}>
                    <Left>
                        <Body style={styles.titleContainer}>
                            <Text
                                uppercase={false}
                                style={[styles.title,
                                this.isSelected(row.item) ? styles.selected : {},
                                isCenterAlignText ? { textAlign: 'center' } : {}]}
                            >
                                {row.item.value_title}
                            </Text>
                        </Body>
                    </Left>
                </CardItem>
            </Animatable.View>
        )
    }

    /* Returns true if option is already selected */
    isSelected(item) {
        return ((this.state.selectedData && this.state.selectedData.id) ? this.state.selectedData.id == item.id : (this.state.selectedData.value_title == item.value_title))
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
                            {this.props.name ?
                            <Label style={styles.listTitle}>Select {this.props.name}:</Label>
                            :null}
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
                            {this.renderNoData()}
                            <FlatList
                                enableEmptySections
                                data={this.state.dataSourceForDisplay}
                                renderItem={(row, item, index) => this.renderRow(row, item, index)}
                                keyExtractor={(item, index) => index.toString()}
                                contentContainerStyle={styles.flatListContainer}
                            />
                        </Animatable.View>
                    </SafeAreaView>
                    {/* </View> */}
                </Button>
            </Modal>
        )
    }
}
