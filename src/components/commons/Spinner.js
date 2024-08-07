import React from 'react';
import LottieView from 'lottie-react-native';
import PropTypes from 'prop-types';
import { StyleSheet, View, Modal } from 'react-native';

const Spinner = ({
  source, style, visible, imageAssetsFolder, ...defaultProps
}) => (
    <Modal transparent={true} visible={visible}>
      <View style={styles.containerView}>
        <LottieView
          source={require('../../../assets/animation/data.json')}
          imageAssetsFolder={'lottie/'}
          style={styles.sizeSpinner}
          {...defaultProps}
        />
      </View>
    </Modal>
  );

Spinner.propType = {
  visible: PropTypes.bool,

};


Spinner.defaultProps = {
  visible: false
}

const styles = StyleSheet.create({
  sizeSpinner: {
    width: 200,
    height: 200,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
    zIndex: 1200,
    left: 2.7
  },
  containerView: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    height: '100%'
  }
})

export { Spinner };