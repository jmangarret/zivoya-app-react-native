/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
class NoHeader extends Component {

  state = {
  }

  constructor(props) {
    super(props);
    
  }

  render() {

    return (

      <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 0 }} colors={['white', 'white']} style={{ height: 0, paddingTop: 0 }}>

      </LinearGradient>
    );


  }
}

const mapStateToProps = state => ({ ...state });

export default connect(mapStateToProps, {

})(NoHeader);