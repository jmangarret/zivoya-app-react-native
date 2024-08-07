import React from 'react';

import PropTypes from 'prop-types';
import { StyleSheet, View, Modal, ActivityIndicator, Platform } from 'react-native';
import { PRIMARY } from '../../../assets/colors/colors'
const Loader = ({
    style, visible
}) => (
        <Modal transparent={true} visible={visible}>
            <View style={styles.containerView}>
                <ActivityIndicator
                    size={Platform.OS == 'ios' ? 1 : 60} color={PRIMARY} animating={true}
                    style={styles.sizeLoader}

                />
            </View>
        </Modal>
    );

Loader.propType = {
    visible: PropTypes.bool,

};


Loader.defaultProps = {
    visible: false
}

const styles = StyleSheet.create({
    sizeLoader: {
        transform: [{ scale: Platform.OS == 'ios' ? 2 : 1 }],
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

export { Loader };