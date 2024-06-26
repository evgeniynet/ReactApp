/* Imports */
import React, { Component } from 'react';
import { SafeAreaView, ActivityIndicator } from 'react-native'
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient';
import { Rect, } from 'react-native-svg';
import * as Animatable from 'react-native-animatable';

import { Colors, ApplicationStyles } from '../Themes';

/* Exporting class */
export default class LoaderBar extends Component {

    /* Variables */
    static = { show: false, withAppColor: false, showActivityIndicator: false };

    /* What are displaying on the screen */
    render() {
        let loaderBarComponent = null
        if (this.props.show) {
            return (
                <SafeAreaView>
                    {this.props.showActivityIndicator ? 
                        <Animatable.View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }} duration={200} animation={'zoomIn'}>
                            <ActivityIndicator size="small" color={this.props.withAppColor ? Colors.mainPrimary : Colors.mainPrimary} />
                        </Animatable.View> 
                    : <Animatable.View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }} duration={200} animation={'zoomIn'}>
                        <SvgAnimatedLinearGradient
                            width='101%'
                            height={4}
                            primaryColor={this.props.withAppColor ? Colors.mainPrimary : Colors.mainPrimary}
                            secondaryColor={this.props.withAppColor ? Colors.secondary : Colors.snow}
                            duration={1500}
                        >
                            <Rect width='100%' height="4" />
                        </SvgAnimatedLinearGradient>
                    </Animatable.View> }
                </SafeAreaView>
            )
        }
        return loaderBarComponent
    }
}
