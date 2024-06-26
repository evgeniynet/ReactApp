/* Imports */
import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../../../Themes'

/* Exporting style sheet */
export default StyleSheet.create({
    ...ApplicationStyles.screen,
    reusableRowContainer: {
        flexDirection: 'column',
        marginLeft: Metrics.baseMargin,
        marginRight: Metrics.baseMargin,
        marginBottom: Metrics.doubleBaseMargin,
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        backgroundColor: Colors.clear,
    },
    headerContainer: {
        marginTop: 2,
        marginLeft: Metrics.doubleBaseMargin,
        marginRight: Metrics.doubleBaseMargin,
        marginBottom: 2,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: Metrics.baseMargin,
        alignItems: 'center',
        backgroundColor: Colors.clear
    },
    titleAddFileText: {
        flex: 1,
        marginTop: Metrics.doubleBaseMargin,
        marginBottom: Metrics.doubleBaseMargin,
        ...Fonts.style.mediumText,
        fontSize: Fonts.size.medium + 1,
        color: Colors.softBlue,
    },
    picture: {
        height: Metrics.screenWidth * 0.32,
        width: (Metrics.screenWidth - 60) / 2,
        borderRadius: Metrics.baseMargin,
        resizeMode: 'cover'
    },
    nameText: {
        marginTop: Metrics.baseMargin,
        marginBottom: Metrics.baseMargin - 2,
        ...Fonts.style.mediumText,
        fontSize: Fonts.size.medium + 1,
        color: Colors.secondary,
        alignSelf: 'flex-start',
    },
    dateText: {
        ...Fonts.style.smallRegularTitle,
        color: Colors.textThree,
        alignSelf: 'flex-start'
    },
    flatListPadding: {
        paddingTop: Metrics.doubleBaseMargin + Metrics.baseMargin,
        paddingBottom: Metrics.doubleSection + Metrics.doubleBaseMargin,
        paddingLeft: Metrics.baseMargin,
        paddingRight: Metrics.baseMargin,
    },
    icon: {
        width: Metrics.doubleBaseMargin + 6,
        height: Metrics.doubleBaseMargin + 6,
        resizeMode: 'contain',
    },
})