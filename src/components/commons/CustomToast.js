import React, { Component } from 'react';

import { StyleSheet, View, Modal, Text, Button, Platform, Animated } from 'react-native';

import PropTypes from 'prop-types';

class CustomToast extends Component {

    constructor() {
        super();

        this.animateOpacityValue = new Animated.Value(0);

        this.animateYValue = new Animated.Value(-40);

        this.state = {
            ShowToast: false
        }

        this.ToastMessage = '';
    }

    componentWillUnmount() {
        this.timerID && clearTimeout(this.timerID);
    }

    ShowToastFunction(message = " ", duration = 4000) {
        this.ToastMessage = message;

        this.setState({ ShowToast: true }, () => {
            /*Animated.timing
                (
                    this.animateOpacityValue,
                    {
                        toValue: 0.90,
                        duration: 500
                    }
                ).start(this.HideToastFunction(duration))*/

                Animated.timing(
                    this.animateYValue,{
                        toValue: 30,
                        duration: 400
                    }
                ).start(this.HideToastFunction(duration))
        });

    }

    HideToastFunction = (duration) => {
        this.timerID = setTimeout(() => {
            /*Animated.timing
                (
                    this.animateOpacityValue,
                    {
                        toValue: 0,
                        duration: 500
                    }
                ).start(() => {
                    this.setState({ ShowToast: false });
                    clearTimeout(this.timerID);
                })*/

                Animated.timing
                (
                    this.animateYValue,
                    {
                        toValue: -40,
                        duration: 400
                    }
                    
                ).start(() => {
                    this.setState({ ShowToast: false });
                    clearTimeout(this.timerID);
                })
        }, duration);
    }

    render() {
        if (this.state.ShowToast) {
            return (

                <Animated.View style={[styles.animatedToastView, { opacity: 0.9, bottom: this.animateYValue, backgroundColor: '#2A3946' }]}>

                    <Text numberOfLines={1} style={[styles.ToastBoxInsideText, { color: this.props.textColor }]}>{this.ToastMessage}</Text>

                </Animated.View>

            );
        }
        else {
            return null;
        }
    }
}

CustomToast.propTypes = {
    backgroundColor: PropTypes.string,
    position: PropTypes.oneOf([
        'top',
        'bottom'
    ]),
    textColor: PropTypes.string
};

CustomToast.defaultProps =
    {
        backgroundColor: '#666666',
        textColor: '#fff'
    }

const styles = StyleSheet.create({
    animatedToastView:
    {   left: 5,
        right:5,
        flexDirection:'row',
        paddingVertical: 15,
        borderRadius: 5,
        zIndex: 9999,
        position: 'absolute',
        justifyContent: 'center'
    },

    ToastBoxInsideText:
    {
        fontSize: 15,
        alignSelf: 'stretch',
        textAlign: 'center'
    }

});
export default CustomToast;