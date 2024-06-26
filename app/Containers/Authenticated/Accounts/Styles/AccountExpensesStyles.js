/* Imports */
import { StyleSheet, Platform } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../../../Themes'
import ExpensesStyles from '../../Expenses/Styles/ExpensesStyles'

/* Exporting style sheet */
export default StyleSheet.create({
    ...ApplicationStyles.screen,
    ...ExpensesStyles,
    flatListPadding: {
        paddingTop: Metrics.doubleBaseMargin + Metrics.baseMargin,    
    },
    
})