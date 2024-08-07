
import React, { Component } from 'react';
import { StyleSheet, View, Image, SafeAreaView, Dimensions, Platform, Modal } from 'react-native';
import I18n from '../../utils/i18n';
import { PRIMARY, SECONDARY, GRAY01, GRAY02 } from '../../../assets/colors/colors';
import { Button, Text } from './';
import { useRoute } from '@react-navigation/native';
import { continueAsAGuest, removeNotification, setNotification, saveIdAccount, logout_session } from '../../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import AnimatedButton from './AnimatedButton';
import { LoginButton, AccessToken, GraphRequest, GraphRequestManager, LoginManager } from 'react-native-fbsdk';

class LogOutconfirmation extends Component {

  state = {
    visible: this.props.visible
  }

  componentDidMount() {
    GoogleSignin.configure({
      webClientId: '589227477225-1gbqt9of358kjlo0og0cn6n9c6475nks.apps.googleusercontent.com',
    });
  }

  customFacebookLogout = () => {
    var current_access_token = '';
    AccessToken.getCurrentAccessToken().then((data) => {
        current_access_token = data.accessToken.toString();
    }).then(() => {
        let logout =
            new GraphRequest(
                "me/permissions/",
                {
                    accessToken: current_access_token,
                    httpMethod: 'DELETE'
                },
                (error, result) => {
                    if (error) {
                        console.log('Error fetching data: ' + error.toString());
                    } else {
                        LoginManager.logOut();
                    }
                });
        new GraphRequestManager().addRequest(logout).start();
    })
        .catch(error => {
            console.log(error)
        });
}

  logOut = async () => {

    const currentUser = await GoogleSignin.getCurrentUser();

    if (currentUser) {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    }

    this.setState({ visible: false })

    this.props.showConfirmationLogOut(false);

    this.customFacebookLogout();

    await AsyncStorage.setItem('id_account', '');
    await AsyncStorage.setItem('email', '');
    await AsyncStorage.setItem('code', '');
    await AsyncStorage.setItem('first_name', '');
    await AsyncStorage.setItem('last_name', '');
    await AsyncStorage.setItem('phone', '');

    const response = await AsyncStorage.getItem('id_account');

    this.props.continueAsAGuest(false);

    this.props.saveIdAccount(response);

    await this.props.logout_session(this.props.login.id_account);

    await this.props.setNotification('logedOut');

    if (Actions.prevScene === 'PassengerAgenda' ||
      Actions.prevScene === 'ConfirmBooking' ||
      Actions.prevScene === 'CreditCard' ||
      Actions.prevScene === 'Passenger' ||
      Actions.prevScene === 'PaymentMethod') {

      Actions.login({ showToast: true });

    } else if (Actions.prevScene === 'Profile') {

      Actions.pop();

    } else if (Actions.prevScene === 'PersonalData' || Actions.prevScene === 'ChangePassword') {

      Actions.popTo(Actions.state.routes[Actions.state.index - 2].routeName)

    }
  };

  render() {

    const { visible } = this.state;

    return (

      <Modal visible={visible} animationType="slide" transparent >

        <SafeAreaView style={{ backgroundColor: 'rgba(0,0,0,0.8)', height: '100%' }}>

          <SafeAreaView style={styles.containerModal}>

            <SafeAreaView>

              <SafeAreaView style={{ alignItems: 'center', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                <View style={{ marginTop: 45 }} />
                <Text fontSize={56} style={{ flexDirection: 'column', marginRight: Platform.OS == 'ios' ? '12%' : 0, color: GRAY01, fontFamily: 'zivoya', justifyContent: 'center' }}> {'8'}</Text>
                <View style={{ marginTop: 25 }} />
                <Text size={16} style={{ textAlign: 'center' }} color={SECONDARY}>{I18n.t('confirmationLogOut')}</Text>
              </SafeAreaView>

            </SafeAreaView>

            <View style={{ marginTop: 15 }} />

            <SafeAreaView style={{ flexDirection: 'row', justifyContent: 'center' }}        >
            
              <AnimatedButton text={I18n.t('cancel').toUpperCase()} action={() => this.setState({ visible: false })} textMode height={40} width={120}  ></AnimatedButton>
              <AnimatedButton text={I18n.t('acceptTer').toUpperCase()} action={this.logOut} height={40} width={120}  ></AnimatedButton>
            </SafeAreaView>

            <SafeAreaView style={{ marginTop: Platform.OS == 'ios' ? '2%' : '8%' }} />

          </SafeAreaView>
        </SafeAreaView>

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
    marginHorizontal: 30,
    marginBottom: 1,
    marginTop: Platform.OS == 'ios' ? '15%' : '20%',
    backgroundColor: 'white'
  }
});

const mapStateToProps = state => (
  { ...state }
);

export default connect(mapStateToProps, {
  continueAsAGuest,
  removeNotification,
  setNotification,
  saveIdAccount,
  logout_session
})(LogOutconfirmation);
