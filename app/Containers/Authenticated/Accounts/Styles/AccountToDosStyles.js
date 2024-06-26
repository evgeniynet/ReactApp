/* Imports */
import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../../../Themes'
import ToDosStyles from '../../ToDos/Styles/ToDosStyles'

/* Exporting style sheet */
export default StyleSheet.create({
    ...ApplicationStyles.screen,
    ...ToDosStyles,
})