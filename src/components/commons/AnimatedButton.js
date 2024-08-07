/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Animated, View, StyleSheet, Platform, TouchableWithoutFeedback, Text
} from 'react-native';

class AnimatedButton extends Component {

  state = {}

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.animatedValue = new Animated.Value(0);
  }

  PressIn() {

    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 1
    }).start(() => {
      Animated.timing(this.animatedValue, {
        toValue: 0,
        duration: 1000
      }).start()
    })
    this.props.action();
  }

  render() {

    const textMode = !!this.props.textMode; 

    const boxInterpolation = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgb(241, 109, 43)", "rgb(246, 154, 108)"]
    })

    const boxInterpolationMode = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["white", "gray"]
    })

    const animatedStyle = { backgroundColor: textMode ? boxInterpolationMode : boxInterpolation }

    let sizeStyle = {
      height: this.props.height
    }

    if (this.props.width) {
      sizeStyle.width = this.props.width;
    }

    return (
      <TouchableWithoutFeedback style={textMode ? styles.containerMode : styles.container}
        onPress={() => this.PressIn()} >
        <Animated.View style={[ styles.button, animatedStyle, sizeStyle]}>
          { this.props.icon !=  null ? <Text width={500} style={{ flexDirection: 'column', color: textMode ? "#F16D2B" : 'white', fontFamily: 'zivoya', fontSize: 20, paddingTop: 2}} >{ this.props.icon} </Text> : null }
          <Text style={ textMode ? styles.textMode : styles.text } >{this.props.text} </Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    textAlign: 'center',
    justifyContent: 'space-around',
    //backgroundColor: "#F16D2B",
    flexDirection: 'row',
    flex: 1
  },
  containerMode: {
    textAlign: 'center',
    justifyContent: 'space-around',
    //backgroundColor: "white",
    flexDirection: 'row',
    flex: 1
  },
  button: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    flexDirection: 'row'
  },
  text: {
    flexDirection: 'column',
    color: 'white',
    fontSize: 16,
    fontWeight: "bold"
  },
  textMode: {
    flexDirection: 'column',
    color: '#F16D2B',
    fontSize: 16,
    fontWeight: "bold"
  }
});

const mapStateToProps = state => ({ ...state });

export default connect(mapStateToProps, {

})(AnimatedButton);

export {AnimatedButton}