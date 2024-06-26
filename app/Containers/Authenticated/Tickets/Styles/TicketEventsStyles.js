/* Imports */
import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../../../Themes'
import Events from '../../Events/Styles/EventsStyles';

/* Exporting style sheet */
export default StyleSheet.create({
    ...ApplicationStyles.screen,
    ...Events,
})