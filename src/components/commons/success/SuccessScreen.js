import React, {Component} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { useRoute } from '@react-navigation/native';
import {TouchableRipple} from 'react-native-paper';
import {connect} from 'react-redux';
import LottieView from 'lottie-react-native';
import {Text} from '../index';
import {
  PRIMARY,
  SECONDARY,
  OPTIONAL,
  GRAY01,
} from '../../../../assets/colors/colors';
import I18n from '../../../utils/i18n';
import {downloadPdf} from '../../../services/emailService';
import CustomToast from '../CustomToast';
import AnimatedButton from '../AnimatedButton';
import {removeNotification, setNotification} from '../../../redux/actions';

class SuccessScreen extends React.PureComponent {
  state = {
    successType: '',
  };

  componentWillUpdate(nextProps) {
    const { route } = this.props;
    if (
      nextProps.notification.show === true &&
      route.name== 'SuccessScreen'
    ) {
      this.refs.defaultToastBottom.ShowToastFunction(
        I18n.t(nextProps.notification.message),
      );
      this.props.removeNotification();
      return true;
    }
  }

  async downloadPdf() {
    const pdfResponse = await downloadPdf(this.props);
 
    await this.props.setNotification('downloadStarted');
  }

  renderSuccessOperation() {
    const {code} = this.props;
    const {user, id_account} = this.props.login;

    // if (successType === 'approvedBooking') {

    if (code == 0) {
      return (
        <View style={{marginLeft: 25, marginRight: 25}}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <View style={{marginTop: 20}}>
              <Text style={styles.title} color="black">
                {I18n.t('successfulOperation')}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 15,
            }}>
            <View>
              <LottieView
                source={require('../../../../assets/animation/data_success.json')}
                style={styles.sizeSpinner}
                autoPlay
              />
            </View>
          </View>

          <CustomToast
            ref="defaultToastBottom"
            backgroundColor="black"
            position="bottom"
          />

          <View style={{marginTop: 15}}>
            <Text
              style={{textAlign: 'center'}}
              fontFamily="Roboto-Light"
              fontSize={20}
              color={SECONDARY}>
              {I18n.t('sucessMessage')}
              <Text color={SECONDARY} fontSize={20} fontFamily="Quicksand-Bold">
                {this.props.booking.bookingData.pnr}
              </Text>
            </Text>
          </View>

          <View style={{marginTop: 20}}>
            <Text
              style={{textAlign: 'center'}}
              fontFamily="Roboto-Light"
              fontSize={20}
              color={SECONDARY}>
              {I18n.t('dataSend')}
            </Text>
          </View>

          <View style={{marginTop: 25}} />

          <TouchableOpacity onPress={() => this.downloadPdf()}>
            <View
              style={{
                borderRadius: 3,
                paddingVertical: 10,
                marginLeft: 30,
                marginRight: 30,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderWidth: 1,
                borderColor: '#dedede',
                backgroundColor: '#f5f5f5',
              }}>
              <View style={{paddingLeft: 10}}>
                <Text fontSize={18} color="black">
                  {I18n.t('downloadItinerary')}
                </Text>
              </View>

              <View style={{flexDirection: 'row', paddingRight: 10}}>
                <Image
                  style={{
                    marginRight: 10,
                    width: 17,
                    height: 17,
                    marginTop: 4,
                  }}
                  source={require('../../../../assets/images/download.png')}
                />
                <Image
                  style={{width: 21, height: 24, marginVertical: 'auto'}}
                  source={require('../../../../assets/images/pdf.png')}
                />
              </View>
            </View>
          </TouchableOpacity>

          <View style={{marginTop: 20}}>
            <TouchableRipple onPress={() => Actions.flightSearch()}>
              <Text
                style={{textAlign: 'center'}}
                fontFamily="Roboto-Bold"
                fontSize={16}
                color={PRIMARY}>
                {I18n.t('backToSearch')}
              </Text>
            </TouchableRipple>
          </View>

          <View
            style={{
              marginTop: 15,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Image
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                height: 39,
                width: 46,
                resizeMode: 'stretch',
              }}
              source={require('../../../../assets/images/mnl.png')}
            />
          </View>

          <View
            style={{
              margin: 10,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <View style={{flexDirection: 'column'}}>
              <Text
                style={{
                  textAlign: 'center',
                  flexDirection: 'row',
                  fontSize: 10,
                }}
                color={GRAY01}>
                POWERED BY
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  flexDirection: 'row',
                  fontSize: 12,
                }}
                color={GRAY01}>
                MINUMEROLOCAL
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (code == 60000 || code == 88403) {
      return (
        <View style={{marginLeft: 25, marginRight: 25}}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <View style={{marginTop: 20}}>
              <Text style={styles.title} color="black">
                {I18n.t('actionRequired')}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 15,
            }}>
            <View>
              <LottieView
                source={require('../../../../assets/animation/dataPhone.json')}
                style={styles.sizeSpinner}
                autoPlay
              />
            </View>
          </View>

          <CustomToast
            ref="defaultToastBottom"
            backgroundColor="black"
            position="bottom"
          />

          <View style={{marginTop: 15}}>
            <Text
              style={{textAlign: 'center'}}
              fontFamily="Roboto-Light"
              fontSize={20}
              color={SECONDARY}>
              {I18n.t('messagePurchaseCall')}
            </Text>
            <Text
              style={{textAlign: 'center'}}
              color={PRIMARY}
              fontSize={26}
              fontFamily="Roboto-Bold">
              305 500 2306
            </Text>
          </View>

          <View style={{marginTop: 15}}>
            <Text
              style={{textAlign: 'center'}}
              fontFamily="Roboto-Light"
              fontSize={14}
              color={SECONDARY}>
              {I18n.t('reservationCode')}
              <Text color={SECONDARY} fontSize={14} fontFamily="Quicksand-Bold">
                {this.props.booking.bookingData.pnr}
              </Text>
            </Text>
          </View>

          <View style={{marginTop: 25}} />

          <TouchableOpacity onPress={() => this.downloadPdf()}>
            <View
              style={{
                borderRadius: 3,
                paddingVertical: 10,
                marginLeft: 30,
                marginRight: 30,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderWidth: 1,
                borderColor: '#dedede',
                backgroundColor: '#f5f5f5',
              }}>
              <View style={{paddingLeft: 10}}>
                <Text fontSize={18} color="black">
                  {I18n.t('downloadItinerary')}
                </Text>
              </View>

              <View style={{flexDirection: 'row', paddingRight: 10}}>
                <Image
                  style={{
                    marginRight: 10,
                    width: 17,
                    height: 17,
                    marginTop: 4,
                  }}
                  source={require('../../../../assets/images/download.png')}
                />
                <Image
                  style={{width: 21, height: 24, marginVertical: 'auto'}}
                  source={require('../../../../assets/images/pdf.png')}
                />
              </View>
            </View>
          </TouchableOpacity>

          <View
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              marginTop: 20,
            }}>
            <AnimatedButton
              text={I18n.t('backToSearch')}
              action={Actions.flightSearch}
              height={40}
              width={240}
              style={{
                justifyContent: 'center',
                flexDirection: 'row',
              }}></AnimatedButton>
          </View>

          <View
            style={{
              marginTop: 15,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Image
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                height: 39,
                width: 46,
                resizeMode: 'stretch',
              }}
              source={require('../../../../assets/images/mnl.png')}
            />
          </View>

          <View
            style={{
              margin: 10,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <View style={{flexDirection: 'column'}}>
              <Text
                style={{
                  textAlign: 'center',
                  flexDirection: 'row',
                  fontSize: 10,
                }}
                color={GRAY01}>
                POWERED BY
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  flexDirection: 'row',
                  fontSize: 12,
                }}
                color={GRAY01}>
                MINUMEROLOCAL
              </Text>
            </View>
          </View>
        </View>
      );
    }
  }

  render() {
    const {successType, successCode} = this.props;
    return (
      <View style={styles.container}>{this.renderSuccessOperation()}</View>
    );
  }
}

const mapStateToProps = state => ({
  ...state,
});

export default connect(mapStateToProps, {
  removeNotification,
  setNotification,
})(SuccessScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    fontFamily: 'Quicksand-Light',
  },
  sizeSpinner: {
    width: 120,
    height: 120,
  },
});
