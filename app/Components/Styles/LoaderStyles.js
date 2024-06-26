/* Imports */
import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts, ApplicationStyles } from '../../Themes';

/* Exporting style sheet */
export default StyleSheet.create({
    ...ApplicationStyles.screen,
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        flexDirection: 'column',
        padding: Metrics.baseMargin
    },
    message: {
        margin: Metrics.doubleBaseMargin,
        color: Colors.white,
        ...Fonts.style.text,
        textAlign: 'center'
    }
})
