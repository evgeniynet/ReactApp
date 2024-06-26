/* Imports */
import React, { Component } from 'react'
import { Image, View, Platform, SafeAreaView, FlatList } from 'react-native'
import { Label, CardItem, ActionSheet, Toast } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import ImageView from "react-native-image-viewing";
import FastImage from 'react-native-fast-image'
import ImagePicker from 'react-native-image-crop-picker';

import { DateFormat } from '../../../Components/Constants';
import { Images, Metrics } from '../../../Themes';
import { Messages } from '../../../Components/Constants';
import CommonFunctions from '../../../Components/CommonFunctions';
import ApiHelper from '../../../Components/ApiHelper';
import Loader from '../../../Components/Loader';
import LoaderBar from '../../../Components/LoaderBar';

// Styless
import styles from '../Accounts/Styles/AccountFilesStyles'

class TicketFiles extends Component {

    // Life cycle of class
    /* Initiating state before the component mount. */
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            dataSource: [],
            images: [],
            visible: false,
            fileSource: null,
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setData()
        }, 100)
    }
    //Actions
    /* Calling api to upload file */
    onSendBtnPress() {
        let obj = {
            ticket: this.props.ticket.key,
            post_id: this.props.ticket.id,
            // 'action': 'response',
            // 'files': this.state.fileSource ? [this.state.fileSource.filename] : []
        }

        let authHeader = (ApiHelper.authenticationHeader({ api_token: this.props.authToken }, this.props.org))

        ApiHelper.postImageWithParam(ApiHelper.Apis.Files, [this.state.fileSource], obj, this, authHeader, true)
            .then((response) => {
                Toast.show({
                    text: `File has been added successfully.`,
                    position: 'top',
                    duration: 3000,
                    type: 'success',
                    style: Platform.OS == 'ios' ? { borderRadius: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin } : { borderRadius: Metrics.baseMargin, margin: Metrics.doubleBaseMargin, marginTop: 0 }
                })
                setTimeout(() => {
                    this.props.mainState.fetchTicketDetails('Files').then(() => {
                        this.setData()
                    })
                }, 350)
                this.setState({ fileSource: null })
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

    //Class Methods

    /* Setting attechments to datasource */
    setData() {
        if (this.props.ticket && this.props.ticket.attachments) {
            this.setState({ dataSource: this.props.ticket.attachments ?? [] })
        }
    }

    /* Presenting image to change profile picture */
    changeFilePicture() {
        ActionSheet.show({
            title: 'Select',
            options: ["Take From Camera", "Choose From Library", "Cancel"],
            cancelButtonIndex: 2,
        },
            buttonIndex => {
                if (buttonIndex === 0) {
                    ImagePicker.openCamera({
                        // cropping: true,
                        compressImageQuality: 0.7,
                    }).then(image => {
                        console.log(image);
                        var newImgSrc = image
                        if (image.filename && image.filename != null && image.filename != '') {
                            newImgSrc.filename = image.filename
                        } else {
                            let imgUrl = newImgSrc.sourceURL && newImgSrc.sourceURL != null && newImgSrc.sourceURL != '' ? newImgSrc.sourceURL : newImgSrc.path
                            let strName = imgUrl.substring(imgUrl.lastIndexOf('/') + 1)
                            console.log('Name', strName);
                            newImgSrc.filename = strName && strName != '' ? strName : (Moment().unix().toString() + '.jpg')
                        }
                        this.setState({ imageUrl: image.path, fileSource: newImgSrc })
                        setTimeout(() => {
                            this.onSendBtnPress()
                        }, 100)
                    });
                } else if (buttonIndex === 1) {
                    ImagePicker.openPicker({
                        // cropping: true,
                        compressImageQuality: 0.7,
                    }).then(image => {
                        console.log(image);
                        var newImgSrc = image
                        if (image.filename && image.filename != null && image.filename != '') {
                            newImgSrc.filename = image.filename
                        } else {
                            let imgUrl = newImgSrc.sourceURL && newImgSrc.sourceURL != null && newImgSrc.sourceURL != '' ? newImgSrc.sourceURL : newImgSrc.path
                            let strName = imgUrl.substring(imgUrl.lastIndexOf('/') + 1)
                            console.log('Name', strName);
                            newImgSrc.filename = strName && strName != '' ? strName : (Moment().unix().toString() + '.jpg')
                        }
                        console.log('Updated', newImgSrc);
                        this.setState({ imageUrl: image.path, fileSource: newImgSrc })
                        setTimeout(() => {
                            this.onSendBtnPress()
                        }, 100)
                    });
                }
            }
        )
    }

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
                <Animatable.View animation={'zoomIn'} delay={300} style={[styles.noDataContainer, { flexGrow: 1, justifyContent: 'flex-end' }]}>
                    <Image style={styles.noDataIcon} source={Images.nodata} />
                    <Label style={styles.noDataTitleStyle}>
                        {Messages.NoData}
                    </Label>
                </Animatable.View>
            )
        }
        return (null)
    }

    /* Redering header view */
    renderHeader() {
        return (
            <View>
                <Animatable.View animation={'fadeIn'}>
                    <CardItem button style={styles.headerContainer} onPress={() => {
                        this.changeFilePicture()
                    }}>
                        <Label style={styles.titleAddFileText}>{`Add New File`}</Label>
                        <Image style={styles.icon} source={Images.addTech} />
                    </CardItem>
                </Animatable.View>
                {this.renderNoData()}
            </View>
        )
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
                <Loader show={this.state.loading} />
                <ImageView
                    swipeToCloseEnabled={Platform.OS == 'android' ? false : true}
                    images={this.state.images}
                    imageIndex={0}
                    visible={this.state.visible}
                    onRequestClose={() => this.setState({ visible: false })}
                />
                <View style={styles.mainContainer}>
                    <FlatList
                        ref={(ref) => { this.flatLisRef = ref; }}
                        numColumns={2}
                        contentContainerStyle={[styles.flatListPadding, { paddingTop: 0 }]}
                        data={this.state.dataSource}
                        renderItem={(row) => this.renderRow(row)}
                        keyExtractor={(item, index) => index.toString()}
                        // scrollEventThrottle={16} 
                        ListHeaderComponent={this.renderHeader()}
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
export default connect(mapStateToProps)(TicketFiles);