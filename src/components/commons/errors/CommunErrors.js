/* eslint-disable no-unused-expressions */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import {
  StyleSheet, View, Modal, Image, TouchableOpacity, Platform
} from 'react-native';
import I18n from '../../../utils/i18n';
import {
  PRIMARY, SECONDARY, GRAY01, GRAY02
} from '../../../../assets/colors/colors';
import { Button, Text } from '../index';
import AnimatedButton from '../AnimatedButton';

export default class CommunErrors extends Component {
  state = {
    visible: this.props.visible,
    errorType: this.props.type,
    childWarningModal: false
  }

  showError(errorType) {
    if (errorType === 'showDifferentAirport') {
      return (
        <View style={{ alignItems: 'center', flexDirection: 'column', justifyContent: 'space-evenly' }}>
          <View style={{ marginTop: '8%' }} />
          <Image style={{ width: 70, height: 43.6 }} source={require('../../../../assets/images/departures.png')} />
          <View style={{ marginTop: '4%' }} />
          <Text size={16} style={{ marginLeft: '4%', marginRight: '4%', textAlign: 'center' }} color={GRAY01}>{I18n.t('airportDif')}</Text>
        </View>
      );
    }

    if (errorType === 'showNoFlights') {
      return (
        <View style={{ alignItems: 'center', flexDirection: 'column', justifyContent: 'space-evenly' }}>
          <View style={{ marginTop: '8%' }} />
          <Image style={{ width: 57.44, height: 78.33 }} source={require('../../../../assets/images/pin.png')} />
          <View style={{ marginTop: '4%' }} />
          <Text size={16} style={{ marginLeft: '4%', marginRight: '4%', textAlign: 'center' }} color={GRAY01}>{I18n.t('noFlights')}</Text>
        </View>
      );
    }

    if (errorType === 'paymentError') {
      return (
        <View style={{ alignItems: 'center', flexDirection: 'column', justifyContent: 'space-evenly' }}>
          <View style={{ marginTop: '8%' }} />
          <Image style={{ width: 70, height: 43.6 }} source={require('../../../../assets/images/payment-error.png')} />
          <View style={{ marginTop: '4%' }} />
          <Text size={16} style={{ marginLeft: '4%', marginRight: '4%', textAlign: 'center' }} color={GRAY01}>{I18n.t('paymentCardError')}</Text>
        </View>
      );
    }

    if (errorType === 'noFunds') {
      return (
        <View style={{ alignItems: 'center', flexDirection: 'column', justifyContent: 'space-evenly' }}>
          <View style={{ marginTop: '8%' }} />
          <Image style={{ width: 70, height: 43.6 }} source={require('../../../../assets/images/50080.png')} />
          <View style={{ marginTop: '4%' }} />
          <Text size={16} style={{ marginLeft: '4%', marginRight: '4%', textAlign: 'center' }} color={GRAY01}>{I18n.t('code_50080')}</Text>
        </View>
      );
    }

    if (errorType === 'invalidData') {
      return (
        <View style={{ alignItems: 'center', flexDirection: 'column', justifyContent: 'space-evenly' }}>
          <View style={{ marginTop: '8%' }} />
          <Image style={{ width: 70, height: 43.6 }} source={require('../../../../assets/images/10456.png')} />
          <View style={{ marginTop: '4%' }} />
          <Text size={16} style={{ marginLeft: '4%', marginRight: '4%', textAlign: 'center' }} color={GRAY01}>{I18n.t('code_10456')}</Text>
        </View>
      );
    }

    if (errorType === 'priceChanged') {
      return (
        <View style={{ alignItems: 'center', flexDirection: 'column', justifyContent: 'space-evenly' }}>
          <View style={{ marginTop: '8%' }} />
          <Image style={{ width: 70, height: 43.6 }} source={require('../../../../assets/images/88121.png')} />
          <View style={{ marginTop: '4%' }} />
          <Text size={16} style={{ marginLeft: '4%', marginRight: '4%', textAlign: 'center' }} color={GRAY01}>{I18n.t('code_88121_1')}</Text>
          <Text size={16} style={{ marginLeft: '4%', marginRight: '4%', textAlign: 'center' }} color={GRAY01}>{I18n.t('code_88121_2')}</Text>
          <Text size={16} style={{ marginLeft: '4%', marginRight: '4%', textAlign: 'center' }} color={GRAY01}>{this.props.price ? this.props.price : null}</Text>
        </View>
      );
    }

    if (errorType === 'reservationActive') {
      return (
        <View style={{ alignItems: 'center', flexDirection: 'column', justifyContent: 'space-evenly' }}>
          <View style={{ marginTop: '8%' }} />
          <Image style={{ width: 70, height: 43.6 }} source={require('../../../../assets/images/88100-88101.png')} />
          <View style={{ marginTop: '4%' }} />
          <Text size={16} style={{ marginLeft: '4%', marginRight: '4%', textAlign: 'center' }} color={GRAY01}>{I18n.t('code_88100_88101')}</Text>
        </View>
      );
    }

    if (errorType === 'errorAddCreditCard') {
      return (
        <View style={{ alignItems: 'center', flexDirection: 'column', justifyContent: 'space-evenly' }}>
          <View style={{ marginTop: '8%' }} />
          <Image style={{ width: 70, height: 43.6 }} source={require('../../../../assets/images/payment-error.png')} />
          <View style={{ marginTop: '4%' }} />
          <Text size={16} style={{ marginLeft: '4%', marginRight: '4%', textAlign: 'center' }} color={GRAY01}>{I18n.t('errorAddingCard')}</Text>
        </View>
      );
    }

    if (errorType === 'backError') {
      return (
        <View style={{ alignItems: 'center', flexDirection: 'column', justifyContent: 'space-evenly' }}>
          <View style={{ marginTop: '8%' }} />
          <Image style={{ width: 70, height: 43.6 }} source={require('../../../../assets/images/back-error.png')} />
          <View style={{ marginTop: '4%' }} />
          <Text size={16} style={{ marginLeft: '4%', marginRight: '4%', textAlign: 'center' }} color={GRAY01}>{I18n.t('backError')}</Text>
        </View>
      );
    }

    if (errorType === 'notPassengers') {
      return (
        <View style={{ alignItems: 'center', flexDirection: 'column', justifyContent: 'space-evenly' }}>
          <View style={{ marginTop: '8%' }} />
          <Image style={{ width: 70, height: 43.6 }} source={require('../../../../assets/images/seat-icon.png')} />
          <View style={{ marginTop: '4%' }} />
          <Text size={16} style={{ marginLeft: '4%', marginRight: '4%', textAlign: 'center' }} color={GRAY01}>{I18n.t('notPassengers')}</Text>
        </View>
      );
    }

    if (errorType === 'bookCanceled') {
      return (
        <View style={{ alignItems: 'center', flexDirection: 'column', justifyContent: 'space-evenly' }}>
          <View style={{ marginTop: '8%' }} />
          <Image style={{ width: 98.5, height: 49.78 }} source={require('../../../../assets/images/booking-error.png')} />
          <View style={{ marginTop: '4%' }} />
          <Text size={16} style={{ marginLeft: '4%', marginRight: '4%', textAlign: 'center' }} color={GRAY01}>{I18n.t('bookCanceled')}</Text>
        </View>
      );
    }

    if (errorType === 'childWarning') {
      return (
        <View style={{ alignItems: 'center', flexDirection: 'column', justifyContent: 'space-evenly' }}>
          <View style={{ marginTop: '8%' }} />
          <Image style={{ width: 70, height: 70 }} source={require('../../../../assets/images/warning.png')} />
          <View style={{ marginTop: '4%' }} />
          <Text size={16} style={{ marginLeft: '4%', marginRight: '4%', textAlign: 'center' }} color={GRAY01}>{I18n.t('childWarning')}</Text>
        </View>
      );
    }

    if (errorType === 'noRange') {
      return (
        <View style={{ alignItems: 'center', flexDirection: 'column', justifyContent: 'space-evenly' }}>
          <View style={{ marginTop: '8%' }} />
          <Image style={{ width: 60, height: 52 }} source={require('../../../../assets/images/rangeCalendar.png')} />
          <View style={{ marginTop: '4%' }} />
          <Text size={16} style={{ marginLeft: '4%', marginRight: '4%', textAlign: 'center' }} color={GRAY01}>{I18n.t('noRange')}</Text>
        </View>
      );
    }

    if (errorType === 'noResultsForPNR') {
      return (
        <View style={{ alignItems: 'center', flexDirection: 'column', justifyContent: 'space-evenly' }}>
          <View style={{ marginTop: '8%' }} />
          <Image style={{ width: 60, height: 60 }} source={require('../../../../assets/images/no-results-filter.png')} />
          <View style={{ marginTop: '4%' }} />
          <Text size={16} style={{ marginLeft: '4%', marginRight: '4%', textAlign: 'center' }} color={GRAY01}>{I18n.t('noResultsForPNR')}</Text>
        </View>
      );
    }

    if (errorType === 'wherePNR') {
      return (
        <View style={{ alignItems: 'center', flexDirection: 'column', justifyContent: 'space-evenly', marginTop: Platform.OS == 'ios' ? 15 : 0 }}>

          <TouchableOpacity onPress={() => { this.props.onClose(this.setState({ visible: false })) }} style={{ alignSelf: 'flex-end', right: 20, top: 20 }} >
            <Text fontSize={18} style={{ color: GRAY01, fontFamily: 'zivoya' }}> {'#'}</Text>
          </TouchableOpacity>

          <View style={{ marginTop: '10%' }} />
          <Text size={16} style={{ marginLeft: '4%', marginRight: '4%', textAlign: 'center', fontWeight: 'bold' }} color={SECONDARY}>{I18n.t('wherePNRLabel')}</Text>
          <View style={{ marginTop: '10%' }} />
          <Text size={16} style={{ marginLeft: '4%', marginRight: '4%', textAlign: 'center' }} color={SECONDARY}>{I18n.t('wherePNRMessage1')}</Text>
          <View style={{ marginTop: '4%' }} />
          <Text size={16} style={{ marginLeft: '4%', marginRight: '4%', textAlign: 'center' }} color={SECONDARY}>{I18n.t('wherePNRMessage2')}</Text>

          <Image style={{ width: 300, height: 150, marginTop: 20 }} source={require('../../../../assets/images/PNR.png')} />

        </View>
      );
    }

    return null;
  }

  onCloseState = () => {
    const { onClose } = this.props;
    onClose(this.setState({ visible: false }));
  }

  onConfirmState = () => {
    const { onConfirm } = this.props;
    onConfirm(this.state, this.setState({ visible: false, childWarningModal: true }))
  }

  renderButton(errorType) {
    const { visible, onClose, onConfirm } = this.props;
    
    if (errorType === 'showDifferentAirport') {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'center' }} >

          <AnimatedButton text={I18n.t('ok')} action={this.onCloseState} height={60} width={'90%'}></AnimatedButton>

        </View>
      );
    }

    if (errorType === 'backError' || errorType === 'notPassengers' || errorType === 'paymentError' || errorType === 'bookCanceled' || errorType === 'errorAddCreditCard' || errorType === 'noFunds' || errorType === 'reservationActive' || errorType === 'invalidData') {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
          <AnimatedButton text={I18n.t('back')} action={this.onCloseState} height={60} width={'90%'}></AnimatedButton>
        </View>
      );
    }

    if (errorType === 'showNoFlights') {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
          <AnimatedButton text={I18n.t('modifiedSearch')} action={this.onCloseState} height={60} width={'90%'}></AnimatedButton>
        </View>
      );
    }


    if (errorType === 'childWarning') {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
          <AnimatedButton text={I18n.t('cancel')} action={() => onClose(this.setState({ visible: false }))} height={40} width={'30%'} textMode></AnimatedButton>
          <AnimatedButton text={I18n.t('ok')} action={this.onConfirmState} height={40} width={'30%'}></AnimatedButton>
        </View>
      );
    }

    if (errorType === 'priceChanged') {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
          <AnimatedButton text={I18n.t('searchAgain')} action={() => onClose(this.setState({ visible: false }))} height={40} width={'30%'} textMode ></AnimatedButton>
          <AnimatedButton text={I18n.t('continue')} action={this.onConfirmState} height={40} width={'30%'}></AnimatedButton>
        </View>
      );
    }

    if (errorType === 'noRange') {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
          <AnimatedButton text={I18n.t('back')} action={this.onCloseState} height={60} width={'90%'}></AnimatedButton>
        </View>
      );
    }

    if (errorType === 'noResultsForPNR') {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
          <AnimatedButton text={I18n.t('back')} action={this.onCloseState} height={60} width={'90%'}></AnimatedButton>
        </View>
      );
    }

  }


  close = () => {
    const { onClose } = this.props;
    onClose(this.setState({ visible: false }))
  }

  render() {
    const { visible, type } = this.props;
    return (
      <Modal visible={visible} onRequestClose={() => this.close()} animationType="slide" transparent >
        <View style={{ backgroundColor: 'rgba(0,0,0,0.8)', height: '100%' }}>
          <View style={styles.containerModal}>

            <View>

              {this.showError(type)}

            </View>


            <View style={{ marginTop: '8%' }} />

            {this.renderButton(type)}

            <View style={{ marginTop: '8%' }} />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({

  containerModal: {

    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 0,
    marginTop: '20%',
    backgroundColor: 'white'
  },
  centerItems: {
    flexDirection: 'column',
    justifyContent: 'flex-start'
  }

});
