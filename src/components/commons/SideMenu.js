import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  ToastAndroid,
} from 'react-native';
import I18n from '../../utils/i18n';
import {
  PRIMARY,
  SECONDARY,
  GRAY01,
  DISABLED,
  GRAY02,
  OPTIONAL,
} from '../../../assets/colors/colors';
import {Text} from './index';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import { useRoute } from '@react-navigation/native';
import {
  saveIdAccount,
  continueAsAGuest,
  setLanguage,
  removeNotification,
  setNotification,
  logout_session,
} from '../../redux/actions';
import spanishFlag from '../../../assets/images/spain.png';
import englishFlag from '../../../assets/images/united-states.png';

import Share from 'react-native-share';
import LottieView from 'lottie-react-native';
class SideMenu extends Component {
  state = {
    sideMenuOpen: false,
    logOutTouched: false,
  };

  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
  }

  shareAction = () => {
    const shareOptions = {
      title: 'Zivoya App',
      url:
        Platform.OS == 'android'
          ? 'https://play.google.com/store/apps/details?id=com.zivoya'
          : 'https://apps.apple.com/us/app/book-flights-zivoya/id1488961166',
      subject: 'Zivoya',
      message: I18n.t('searchFlights'),
      icon: 'https://lh3.googleusercontent.com/lid8Ni5EhwKFK7XJj1cTteL4praDI0oc7--2ip9W-kykrbjKBu19zzoTs557-ZgskVE=s180-rw',
    };

    Share.open(shareOptions)
      .then(res => {
        this.closeModal();
      })
      .catch(err => {
        err && console.log(err);
      });
  };

  onModalHide = () => {
    const {logOutTouched} = this.state;
    if (logOutTouched) {
      this.setState({sideMenuOpen: true, logOutTouched: false}, () =>
        this.props.onHide(this.state.sideMenuOpen),
      );
    }
  };

  closeModal(message) {
    this.props.setSideMenu(false, message);
  }

  login = () => {
    const { route } = this.props;
    if (route.name!= 'login') {
      this.closeModal();

      setTimeout(() => {
        Actions.login({fromHeader: true});
      }, 200);
    }
  };

  privacyPolicy() {
    const { route } = this.props;
    if (route.name!= 'PrivacyPolicy') {
      this.closeModal();

      setTimeout(() => {
        Actions.PrivacyPolicy();
      }, 200);
    }
  }

  about() {
    const { route } = this.props;
    if (route.name!= 'About') {
      this.closeModal();

      setTimeout(() => {
        Actions.About();
      }, 200);
    }
  }

  profile() {
    const { route } = this.props;
    if (route.name!= 'Profile') {
      this.closeModal();

      setTimeout(() => {
        Actions.Profile();
      }, 200);
    }
  }

  searchPNR() {
    const { route } = this.props;
    if (route.name!= 'PNRSearch') {
      this.closeModal();

      setTimeout(() => {
        Actions.PNRSearch();
      }, 200);
    }
  }

  listMyFlight() {
    const { route } = this.props;
    if (route.name!= 'MyFlights') {
      this.closeModal();
      setTimeout(() => {
        Actions.MyFlights();
      }, 200);
    }
  }

  logOut = async () => {
    //this.customFacebookLogout();

    this.setState({logOutTouched: true});

    this.closeModal();

    this.props.showConfirmationLogOut(true);

    //
  };

  renderLabelTranslation = () => {
    let flag = I18n.currentLanguage() !== 'es' ? englishFlag : spanishFlag;

    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 25,
          paddingRight: 25,
        }}
        onPress={() => {
          this.switchLanguage();
        }}>
        <Text
          fontSize={16}
          style={{
            flexDirection: 'column',
            color: SECONDARY,
            justifyContent: 'flex-start',
          }}>
          {' '}
          {I18n.t('changeLanguage')}
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <Image style={{marginTop: 2, height: 20, width: 20}} source={flag} />
        </View>
      </TouchableOpacity>
    );
  };

  renderProfileItem() {
    const {guestFlag} = this.props.passenger;
    const {id_account, user} = this.props.login;

    if (guestFlag == true) {
      return (
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 40,
            paddingBottom: 30,
            paddingLeft: 25,
            paddingRight: 25,
          }}>
          <Text
            fontSize={24}
            style={{
              flexDirection: 'column',
              paddingTop: Platform.OS === 'ios' ? 10 : 8,
              color: PRIMARY,
              fontWeight: '400',
            }}>
            {' '}
            {I18n.t('guest')}
          </Text>
        </View>
      );
    } else if (
      !guestFlag &&
      id_account != '' &&
      id_account != null &&
      id_account != undefined
    ) {
      return (
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 40,
            paddingBottom: 30,
            paddingLeft: 25,
            paddingRight: 25,
          }}>
          <Text
            fontSize={24}
            style={{
              flexDirection: 'column',
              paddingTop: Platform.OS === 'ios' ? 10 : 8,
              color: PRIMARY,
              fontWeight: '400',
            }}>
            {' '}
            {I18n.t('hi') + ' ' + user.first_name + '!'}{' '}
          </Text>
        </View>
      );
    } else {
      return (
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 40,
            paddingBottom: 30,
            paddingLeft: 25,
            paddingRight: 25,
          }}>
          <Text
            fontSize={24}
            style={{
              flexDirection: 'column',
              paddingTop: Platform.OS === 'ios' ? 10 : 8,
              color: PRIMARY,
              fontWeight: '400',
            }}>
            {' '}
            {I18n.t('welcome')}
          </Text>
        </View>
      );
    }
  }

  switchLanguage = async () => {
    I18n.switchLanguage();
    //this.props.setLanguage(I18n.currentLanguage());

    await this.props.setNotification('languageHasChanged');
    this.closeModal();
  };

  loginButton = () => {
    const {guestFlag} = this.props.passenger;
    const {id_account} = this.props.login;
    const { route } = this.props;
    if (
      (guestFlag ||
        id_account == '' ||
        id_account == null ||
        id_account == undefined) &&
      route.name!= 'Register'
    ) {
      return (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 20,
            paddingBottom: 20,
            paddingLeft: 25,
            paddingRight: 25,
          }}
          onPress={() => {
            this.login();
          }}>
          <Text
            fontSize={16}
            style={{
              flexDirection: 'column',
              color: SECONDARY,
              justifyContent: 'flex-start',
            }}>
            {' '}
            {I18n.t('loginScreen')}
          </Text>
          <Text
            fontSize={18}
            style={{
              flexDirection: 'column',
              color: SECONDARY,
              fontFamily: 'zivoya',
              justifyContent: 'flex-end',
            }}>
            {' '}
            {'7'}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  logOutButton = () => {
    const {id_account, user} = this.props.login;

    const {guestFlag} = this.props.passenger;

    if (
      !guestFlag &&
      id_account != '' &&
      id_account != null &&
      id_account != undefined
    ) {
      return (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 20,
            paddingBottom: 20,
            paddingLeft: 25,
            paddingRight: 25,
          }}
          onPress={() => {
            this.logOut();
          }}>
          <Text
            fontSize={16}
            style={{
              flexDirection: 'column',
              color: SECONDARY,
              justifyContent: 'flex-start',
            }}>
            {' '}
            {I18n.t('logOut')}
          </Text>
          <Text
            fontSize={18}
            style={{
              flexDirection: 'column',
              color: SECONDARY,
              fontFamily: 'zivoya',
              justifyContent: 'flex-end',
            }}>
            {' '}
            {'8'}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  validateAccountAction = () => {
    const { route } = this.props;
    if (route.name!= 'ConfirmationCode') {
      this.closeModal();

      setTimeout(() => {
        Actions.ConfirmationCode();
      }, 200);
    }
  };

  validateAccount = () => {
    const {user, id_account} = this.props.login;

    if (
      user.code == '22019' &&
      this.props.passenger.guestFlag == false &&
      id_account != '' &&
      id_account != null
    ) {
      return (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 20,
            paddingBottom: 20,
            backgroundColor: GRAY02,
            paddingLeft: 25,
            paddingRight: 25,
          }}
          onPress={() => {
            this.validateAccountAction();
          }}>
          <Text
            fontSize={16}
            style={{
              flexDirection: 'column',
              color: PRIMARY,
              justifyContent: 'flex-start',
            }}>
            {' '}
            {I18n.t('validateAccount')}
          </Text>
          <Text
            fontSize={18}
            style={{
              flexDirection: 'column',
              color: PRIMARY,
              fontFamily: 'zivoya',
              justifyContent: 'flex-end',
            }}>
            {' '}
            {'8'}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  renderProfileLabel = () => {
    const {id_account, user} = this.props.login;
    const {guestFlag} = this.props.passenger;

    if (
      !guestFlag &&
      id_account != '' &&
      id_account != null &&
      id_account != undefined
    ) {
      return (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 20,
            paddingBottom: 20,
            paddingLeft: 25,
            paddingRight: 25,
          }}
          onPress={() => {
            this.profile();
          }}>
          <Text
            fontSize={16}
            style={{
              flexDirection: 'column',
              color: SECONDARY,
              justifyContent: 'flex-start',
            }}>
            {' '}
            {I18n.t('profile')}
          </Text>
          <Text
            fontSize={18}
            style={{
              flexDirection: 'column',
              color: SECONDARY,
              fontFamily: 'zivoya',
              justifyContent: 'flex-end',
            }}>
            {' '}
            {'2'}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  renderPNRSearch = () => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 25,
          paddingRight: 25,
        }}
        onPress={() => {
          this.searchPNR();
        }}>
        <Text
          fontSize={16}
          style={{
            flexDirection: 'column',
            color: SECONDARY,
            justifyContent: 'flex-start',
          }}>
          {' '}
          {I18n.t('searchByPNR')}
        </Text>
        <Text
          fontSize={18}
          style={{
            flexDirection: 'column',
            color: SECONDARY,
            fontFamily: 'zivoya',
            justifyContent: 'flex-end',
          }}>
          {' '}
          {'-'}
        </Text>
      </TouchableOpacity>
    );
  };

  renderMyFlight = () => {
    const {id_account, user} = this.props.login;
    const {guestFlag} = this.props.passenger;
    if (
      !guestFlag &&
      id_account != '' &&
      id_account != null &&
      id_account != undefined
    ) {
      return (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 20,
            paddingBottom: 20,
            paddingLeft: 25,
            paddingRight: 25,
          }}
          onPress={() => {
            this.listMyFlight();
          }}>
          <Text
            fontSize={16}
            style={{
              flexDirection: 'column',
              color: SECONDARY,
              justifyContent: 'flex-start',
            }}>
            {' '}
            {I18n.t('myFlyght')}
          </Text>
          <Text
            fontSize={18}
            style={{
              flexDirection: 'column',
              color: SECONDARY,
              fontFamily: 'zivoya',
              justifyContent: 'flex-end',
            }}>
            {' '}
            {'20'}
          </Text>
        </TouchableOpacity>
      );
    } else return null;
  };

  render() {
    return (
      <Modal
        onModalHide={this.onModalHide}
        isVisible={this.props.visible}
        animationInTiming={300}
        onBackButtonPress={this.closeModal}
        animationOutTiming={300}
        animationIn={'fadeInRight'}
        animationOut={'fadeOutRight'}
        style={{
          width: '75%',
          height: '100%',
          margin: 0,
          padding: 0,
          marginLeft: '25%',
          justifyContent: 'flex-end',
        }}
        useNativeDriver={true}
        coverScreen={true}
        swipeThreshold={50}
        onBackdropPress={this.closeModal}>
        <View style={styles.containerModal}>
          {this.renderProfileItem()}

          {this.validateAccount()}

          <View style={{flexDirection: 'row', flex: 1}}>
            <View style={{flexDirection: 'column', flex: 1}}>
              {this.renderProfileLabel()}

              {this.loginButton()}

              <View
                style={{
                  backgroundColor: DISABLED,
                  flexDirection: 'row',
                  height: 1,
                }}
              />

              {this.renderPNRSearch()}

              {this.renderMyFlight()}

              <View
                style={{
                  backgroundColor: DISABLED,
                  flexDirection: 'row',
                  height: 1,
                }}
              />

              {this.renderLabelTranslation()}

              <View
                style={{
                  backgroundColor: DISABLED,
                  flexDirection: 'row',
                  height: 1,
                }}
              />

              {this.logOutButton()}
            </View>
          </View>

          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'column', flex: 1}}>
              <TouchableOpacity
                style={{
                  backgroundColor: OPTIONAL,
                  flexDirection: 'row',
                  paddingBottom: 15,
                  paddingTop: Platform.OS == 'android' ? 12 : 15,
                  paddingLeft: 25,
                  paddingRight: 25,
                  height: 55,
                }}
                onPress={() => {
                  this.shareAction();
                }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text fontSize={18} style={styles.shareLabel}>
                    {' '}
                    {I18n.t('shareThisApp')}
                  </Text>
                  <LottieView
                    source={require('../../../assets/animation/share.json')}
                    style={{width: 30, height: 30, justifyContent: 'flex-end'}}
                    autoPlay
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  paddingBottom: 25,
                  paddingTop: 25,
                  paddingLeft: 25,
                  paddingRight: 25,
                }}
                onPress={() => {
                  this.privacyPolicy();
                }}>
                <Text fontSize={16} style={styles.simpleItemText}>
                  {' '}
                  {I18n.t('privacyPolicy')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  paddingBottom: 40,
                  paddingLeft: 25,
                  paddingRight: 25,
                }}
                onPress={() => {
                  this.about();
                }}>
                <Text fontSize={16} style={styles.simpleItemText}>
                  {' '}
                  {I18n.t('about')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  containerModal: {
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
    flex: 1,
    margin: 0,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  buttonStyle: {
    color: PRIMARY,
  },
  linearGradient: {
    flex: 1,
  },
  simpleItem: {
    flexDirection: 'row',
    paddingBottom: 25,
    paddingTop: 25,
  },
  simpleItemText: {
    flexDirection: 'column',
    color: SECONDARY,
  },
  shareLabel: {
    flexDirection: 'column',
    color: 'white',
    justifyContent: 'flex-start',
    paddingTop: 3,
    fontWeight: 'bold',
  },
});

const mapStateToProps = state => ({...state});

export default connect(mapStateToProps, {
  saveIdAccount,
  continueAsAGuest,
  setLanguage,
  removeNotification,
  setNotification,
  logout_session,
})(SideMenu);
