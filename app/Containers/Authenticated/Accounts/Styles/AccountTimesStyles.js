/* Imports */
import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../../../Themes'
import TimelogsStyles from '../../Timelogs/Styles/TimelogsStyles';

/* Exporting style sheet */
export default StyleSheet.create({
    ...ApplicationStyles.screen,
    ...TimelogsStyles,
})