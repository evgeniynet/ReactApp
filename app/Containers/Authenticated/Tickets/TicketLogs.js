/* Imports */
import React, { Component } from 'react'
import { Image, View, Platform, SafeAreaView, FlatList } from 'react-native'
import { Label, CardItem } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import ImageView from "react-native-image-viewing";
import FastImage from 'react-native-fast-image'

import { DateFormat } from '../../../Components/Constants';
import { Images } from '../../../Themes';
import { Messages } from '../../../Components/Constants';
import CommonFunctions from '../../../Components/CommonFunctions';

// Styless
import styles from '../Accounts/Styles/AccountFilesStyles'

class TicketLogs extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            dataSource: [],
            images: [],
            visible: false
        };
    }
    
    componentDidMount() {
        setTimeout(() => {
            if (this.props.ticket && this.props.ticket.attachments) {
                this.setState({ dataSource: this.props.ticket.attachments ?? [] })
            }
        }, 100)
    }

    //Class Methods

    /* Returns true if it's image */
    checkIsImageURL(url) {
        if (typeof url !== 'string') return false;
        return (url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi) != null);
    }

    /* Returns true if it's pdf */
    checkIsPdfURL(url) {
        if (typeof url !== 'string') return false;
        return (url.match(/^http[^\?]*.(pdf)(\?(.*))?$/gmi) != null);
    }

    /* Redering no data view */
    renderNoData() {
        if (this.state.loading && this.state.dataSource.length == 0 && (this.props.ticket)) {
            return (
                <Animatable.View animation={'fadeIn'} style={styles.noDataContainer}>
                    <Label style={styles.noDataTitleStyle}>
                        Files will appear here.
                    </Label>
                </Animatable.View>
            )
        } else if (!this.state.loading && this.state.dataSource.length == 0) {
            return (
                <Animatable.View animation={'zoomIn'} delay={100} style={[styles.noDataContainer, { flexGrow: 1, justifyContent: 'flex-end' }]}>
                    <Image style={styles.noDataIcon} source={Images.nodata} />
                    <Label style={styles.noDataTitleStyle}>
                        {Messages.NoData}
                    </Label>
                </Animatable.View>
            )
        }
        return (null)
    }


    /* Rendering row */
    renderRow(row) {
        return (
            <Animatable.View animation={'zoomIn'} style={{ flex: 0.5 }}>
                <CardItem button activeOpacity={0.7} style={styles.reusableRowContainer} onPress={() => {
                    // const data = { title: 'Files', url: row.item.url }
                    // this.props.mainState.props.navigation.push('WebViewInfo', data);
                    if (this.checkIsImageURL(row.item.url)) {
                        this.setState({
                            visible: true,
                            images: [{ uri: row.item.url }]
                        })
                    } else if (this.checkIsPdfURL(row.item.url)) {
                        const data = { pdf: row.item.url }
                        this.props.mainState.props.navigation.push('PdfViewer', data);
                    }
                }}>
                    {this.checkIsImageURL(row.item.url) ?
                        <FastImage style={styles.picture} source={{ uri: row.item.url }} />
                        : this.checkIsPdfURL(row.item.url) ?
                            <Image style={[styles.picture, { resizeMode: 'contain' }]} source={Images.pdf} />
                            : <Image style={[styles.picture, { resizeMode: 'contain' }]} source={Images.filesnodata} />}
                    <Label style={styles.nameText}>{row.item.name}</Label>
                    <Label style={styles.dateText}>{CommonFunctions.utcToLocalTimeZone(row.item.date, DateFormat.DDMMMYYYYHMMA)}</Label>
                </CardItem>
            </Animatable.View>
        )
    }

    /* What to display on the screen */
    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <ImageView
                    swipeToCloseEnabled={Platform.OS == 'android' ? false : true}
                    images={this.state.images}
                    imageIndex={0}
                    visible={this.state.visible}
                    onRequestClose={() => this.setState({ visible: false })}
                />
                <View style={styles.mainContainer}>
                    {this.renderNoData()}
                    <FlatList
                        ref={(ref) => { this.flatLisRef = ref; }}
                        numColumns={2}
                        contentContainerStyle={styles.flatListPadding}
                        data={this.state.dataSource}
                        renderItem={(row) => this.renderRow(row)}
                        keyExtractor={(item, index) => index.toString()}
                        // scrollEventThrottle={16} 
                        onScrollEndDrag={(e) => this.props.mainState.handleScroll(e)}
                        onMomentumScrollBegin={(e) => this.props.mainState.handleScrollAndroid(e)}
                        onMomentumScrollEnd={(e) => this.props.mainState.handleScrollAndroid(e)}
                    />
                </View>
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
export default connect(mapStateToProps)(TicketLogs);