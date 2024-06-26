/* Imports */
import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../../../Themes'
import AddEditExpenseStyles from '../../Expenses/Styles/AddEditExpenseStyles';

/* Exporting style sheet */
export default StyleSheet.create({
    ...ApplicationStyles.screen,
    ...AddEditExpenseStyles,
    container: {
        margin: Metrics.doubleBaseMargin,
        marginBottom: Metrics.doubleBaseMargin + Metrics.doubleBaseMargin,
        backgroundColor: Colors.snow,
        height: 150,
        borderRadius: Metrics.baseMargin,
    },
    notes: {
        marginTop: Metrics.doubleBaseMargin,
        marginLeft: Metrics.doubleBaseMargin,
        marginRight: Metrics.doubleBaseMargin,
        marginBottom: Metrics.baseMargin,
        flex: 1,
        ...Fonts.style.smallRegularTitle,
        fontSize: Fonts.size.small + 1,
        color: Colors.textGray,
    },
    buttonContainer: {
        alignSelf: 'flex-end',
        marginRight: Metrics.doubleBaseMargin,
        marginBottom: -(Metrics.doubleBaseMargin + Metrics.smallMargin)
    },
    buttonIcon: {
        height: Metrics.doubleSection,
        width: Metrics.doubleSection,
        resizeMode: 'contain',
    }
})