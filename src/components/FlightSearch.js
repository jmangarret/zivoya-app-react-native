import React from 'react';
import {
  Animated,
  View,
  StyleSheet,
  TouchableOpacity,
  AppState,
  ScrollView,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import 'moment/min/locales';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconFeather from 'react-native-vector-icons/Feather';
import {
  GRAY02,
  PRIMARY,
  OPTIONAL,
  DISABLED,
} from '../../assets/colors/colors';
import I18n from '../utils/i18n';
import {getAirports} from '../services/flyService';
import {getPublicKey} from '../services/publicKeyService';
import {
  getFlights,
  selectedFly,
  saveIdAccount,
  setEmail,
  setLanguage,
  setUserData,
  removeNotification,
  setFilters,
  checkAccount,
  setCode,
  setNotification,
  getClasses,
} from '../redux/actions';
import {Text, Button, Input, Spinner} from './commons';
import AnimatedButton from './commons/AnimatedButton';
import InvalidAccount from '../components/commons/InvalidAccount';
import CommunErrors from './commons/errors/CommunErrors';
import LoadPassengers from './LoadPassengers';
import CustomAutoComplete from './AutoComplete';
import DateRangeSelector from './DateRangeSelector';
import FilterModal from './FilterModal';
import CustomToast from './commons/CustomToast';
import LottieView from 'lottie-react-native';
import Share from 'react-native-share';

class FlightSearch extends React.PureComponent {
  state = {
    oneWayAirline: false,
    calendarMode: 'range',
    flight_direction: 'departure',
    fromCurrentValue: '',
    toCurrentValue: '',
    startDateFinal: moment().add(7, 'days').format('YYYY-MM-DD'),
    endDateFinal: moment().add(14, 'days').format('YYYY-MM-DD'),
    modalVisibleFrom: false,
    modalVisibleTo: false,
    loadPassenger: false,
    adultCountFlight: `1 `,
    childCountFlight: '',
    infantCountFlight: '',
    adult: 1,
    child: 0,
    infant: 0,
    data: [{}],
    from: '',
    fromSave: '',
    to: '',
    toSave: '',
    loading: false,
    errorFrom: false,
    errorTo: false,
    errorPassenger: false,
    errorType: '',
    errorVisible: false,
    childWarning: false,
    originCity: '',
    destinyCity: '',
    airportOrigin: '',
    airportDestiny: '',
    charterId: null,
    departure_time: '',
    arrival_time: '',
    flights_schedules: [],
    charter_logo: '',
    airline_code: '',
    flight_number: '',
    travel_class_name: '',
    flight_call: '',
    travel_class: '',
    charter_name: '',
    flight_duration: '',
    termsVisible: false,
    singleDate: moment().add(7, 'days').format('YYYY-MM-DD'),
    startDateRange: moment().add(7, 'days').format('YYYY-MM-DD'),
    endDateRange: moment().add(14, 'days').format('YYYY-MM-DD'),
    filtersModal: false,
    invalidAccountVisible: false,
    animation: true,
    appState: null,
    classDescription: 'Economy',
    classDescription_sp: 'Económica',
    travel_class_id: '1',
  };

  constructor(props) {
    super(props);
    this.setFilterModal = this.setFilterModal.bind(this);
    this.onSwipeComplete = this.onSwipeComplete.bind(this);
  }

  componentDidUpdate = async () => {
    const numberAccount = await AsyncStorage.getItem('id_account');

    if (numberAccount != null && numberAccount != '') {
      const response = await this.props.checkAccount(numberAccount);

      if (
        response.data &&
        response.data.status == 400 &&
        response.data.code == '22011'
      ) {
        this.setState({invalidAccountVisible: true});
      }
    }
  };

  componentWillUpdate(nextProps) {
    const { route } = this.props;
    if (
      nextProps.notification.show === true &&
      route.name== 'flightSearch'
    ) {
      this.refs.defaultToastBottom.ShowToastFunction(
        I18n.t(nextProps.notification.message),
      );
      this.props.removeNotification();
      return true;
    }
  }

  componentWillMount = async () => {
    this.animatedValue = new Animated.Value(0);
  };

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
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    const {appState} = this.state;
    if (
      appState &&
      appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (this._animation) {
        this._animation.play();
      }
    }
    this.setState({appState: nextAppState});
  };

  _setAnimation = ref => {
    this._animation = ref;
  };

  componentDidMount = async () => {
    AppState.addEventListener('change', this._handleAppStateChange);

    const fromVar = await AsyncStorage.getItem('from');
    const toVar = await AsyncStorage.getItem('to');
    const SaveVarFrom = await AsyncStorage.getItem('fromSave');
    const SaveVarTo = await AsyncStorage.getItem('toSave');
    const originAirportVar = await AsyncStorage.getItem('airportOrigin');
    const destinyAirport = await AsyncStorage.getItem('airportDestiny');
    const originCityVar = await AsyncStorage.getItem('originCity');
    const destinyCityVar = await AsyncStorage.getItem('destinyCity');

    if (fromVar != null) this.setState({from: fromVar});
    if (toVar != null) this.setState({to: toVar});
    if (SaveVarFrom != null) this.setState({fromSave: SaveVarFrom});
    if (SaveVarTo != null) this.setState({toSave: SaveVarTo});
    if (originAirportVar != null)
      this.setState({airportOrigin: originAirportVar});
    if (destinyAirport != null) this.setState({airportDestiny: destinyAirport});
    if (originCityVar != null) this.setState({originCity: originCityVar});
    if (destinyCityVar != null) this.setState({destinyCity: destinyCityVar});

    if (
      this.props.login.id_account != null &&
      this.props.login.id_account != ''
    ) {
      const response = await this.props.checkAccount(
        this.props.login.id_account,
        true,
      );

      if (
        response.data &&
        response.data.status === 400 &&
        response.data.code === 22011
      ) {
        this.setState({invalidAccountVisible: true});
      }
    }
  };

  customButton = onConfirm => (
    <Button
      onPress={onConfirm}
      buttonMode="contained"
      label={I18n.t('confirm')}
    />
  );

  changeToRoadTrip() {
    this.setState({
      oneWayAirline: false,
      calendarMode: 'range',
      startDateFinal: this.state.startDateRange,
      endDateFinal: this.state.endDateRange,
    });
  }

  changeToOneWay() {
    this.setState({
      oneWayAirline: true,
      calendarMode: 'single',
      singleDate: this.state.singleDate,
    });
  }

  onChangeFrom(text) {
    this.setState({fromCurrentValue: text});
  }

  setFilterModal(visible) {
    this.setState({filtersModal: visible});
  }
  onSwipeComplete() {
    this.setFilterModal(false);
  }

  onChangeTo(text) {
    this.setState({toCurrentValue: text});
  }

  onSelectFrom = (iataCode, country, airport) => {
    const valueFrom = `${iataCode} - ${country}`;
    this.setState({
      from: valueFrom,
      airportOrigin: airport,
      fromSave: iataCode,
      errorFrom: false,
      modalVisibleFrom: false,
    });
  };

  onSelectTo = (iataCode, country, airport) => {
    const valueTo = `${iataCode} - ${country}`;
    this.setState({
      to: valueTo,
      airportDestiny: airport,
      toSave: iataCode,
      errorTo: false,
      modalVisibleTo: false,
    });
  };

  loadPassenger(adultCount, childCount, infantCount, travel_class_id) {
    this.setState({
      adult: adultCount,
      child: childCount,
      infant: infantCount,
      errorPassenger: false,
      travel_class_id: travel_class_id,
    });

    if (adultCount > 0) {
      let adultCountAux;
      if (adultCount == 1) {
        adultCountAux = `${adultCount} ${I18n.t('adults')}`;
      }
      if (adultCount > 1) {
        adultCountAux = `${adultCount} ${I18n.t('adults')}s`;
      }

      this.setState({adultCountFlight: adultCountAux});
    } else if (adultCount === 0) {
      const adultCountAux = '';
      this.setState({adultCountFlight: adultCountAux});
    }

    if (childCount > 0 && adultCount > 0) {
      let childCountAux;
      if (childCount == 1) {
        childCountAux = `, ${childCount} ${I18n.t('childs')}`;
      }
      if (childCount > 1) {
        childCountAux = `, ${childCount} ${I18n.t('childs')}s`;
      }

      this.setState({childCountFlight: childCountAux});
    } else if (childCount === 0) {
      const childCountAux = '';
      this.setState({childCountFlight: childCountAux});
    }

    if (childCount > 0 && adultCount === 0) {
      let childCountAux;
      if (childCount == 1) {
        childCountAux = `${childCount} ${I18n.t('childs')}`;
      }
      if (childCount > 1) {
        childCountAux = `${childCount} ${I18n.t('childs')}s`;
      }
      this.setState({childCountFlight: childCountAux});
    } else if (childCount === 0) {
      const childCountAux = '';
      this.setState({childCountFlight: childCountAux});
    }

    if (infantCount > 0) {
      let infantCountAux;
      if (infantCount == 1) {
        infantCountAux = `, ${infantCount} ${I18n.t('infants')}`;
      }
      if (infantCount > 1) {
        infantCountAux = `, ${infantCount} ${I18n.t('infants')}s`;
      }
      this.setState({infantCountFlight: infantCountAux});
    } else if (infantCount === 0) {
      const infantCountAux = '';
      this.setState({infantCountFlight: infantCountAux});
    }
  }

  renderPassengers() {
    const {adult, child, infant} = this.state;

    let passengers = adult + child + infant;
    return `${passengers} ${
      passengers > 1 ? I18n.t('passengers') : I18n.t('passenger')
    }`;

    let adultCountFlight, childCountFlight, infantCountFlight;

    if (adult > 0) {
      if (adult == 1) {
        adultCountFlight = `${adult} ${I18n.t('adults')}`;
      }
      if (adult > 1) {
        adultCountFlight = `${adult} ${I18n.t('adults')}s`;
      }
    } else if (adult === 0) {
      adultCountFlight = '';
    }

    if (child > 0 && adult > 0) {
      if (child == 1) {
        childCountFlight = `, ${child} ${I18n.t('childs')}`;
      }
      if (child > 1) {
        childCountFlight = `, ${child} ${I18n.t('childs')}s`;
      }
    } else if (child === 0) {
      childCountFlight = '';
    }

    if (infant > 0) {
      if (infant == 1) {
        infantCountFlight = `, ${infant} ${I18n.t('infants')}`;
      }
      if (infant > 1) {
        infantCountFlight = `, ${infant} ${I18n.t('infants')}s`;
      }
    } else if (infant === 0) {
      infantCountFlight = '';
    }

    if (child == 1 && adult == 0) {
      childCountFlight = `${child} ${I18n.t('childs')}`;
    }

    //return `${adultCountFlight} ${childCountFlight} ${infantCountFlight}`;
  }

  modalVisibleFrom(visible) {
    const {from} = this.state;
    this.setState({modalVisibleFrom: visible, fromCurrentValue: from});
  }

  modalVisibleTo(visible) {
    const {to} = this.state;
    this.setState({modalVisibleTo: visible, toCurrentValue: to});
  }

  searchFlights = async () => {
    const {
      from,
      to,
      child,
      adult,
      childWarning,
      oneWayAirline,
      fromSave,
      toSave,
      airportOrigin,
      airportDestiny,
      originCity,
      destinyCity,
    } = this.state;
    if (from === '') this.setState({errorFrom: true});
    if (to === '') this.setState({errorTo: true});
    if (adult === 0 && child === 0) this.setState({errorPassenger: true});
    if (from === to && from !== '' && to !== '') {
      this.setState({errorVisible: true, errorType: 'showDifferentAirport'});
    }

    if (
      child > 0 &&
      adult === 0 &&
      !childWarning &&
      from !== '' &&
      to !== '' &&
      from !== to
    ) {
      this.setState({errorVisible: true, errorType: 'childWarning'});
    }

    if (
      from !== '' &&
      to !== '' &&
      from !== to &&
      (adult > 0 || childWarning)
    ) {
      await this.setState({
        loading: true,
        flight_direction: 'departure',
        charterId: null,
      });
      const response = await this.props.getFlights(
        this.state,
        this.props.flight.filters,
      );

      if (response !== 'TimeOut') {
        if (response.status === 200 && response.code === 0) {
          await AsyncStorage.setItem('from', from);
          await AsyncStorage.setItem('to', to);
          await AsyncStorage.setItem('fromSave', fromSave);
          await AsyncStorage.setItem('toSave', toSave);

          await AsyncStorage.setItem('airportOrigin', airportOrigin);
          await AsyncStorage.setItem('airportDestiny', airportDestiny);

          await AsyncStorage.setItem('originCity', originCity);
          await AsyncStorage.setItem('destinyCity', destinyCity);
          this.setState({loading: false, childWarning: false});
          this.props.selectedFly(this.state);
          Actions.FlightResults({searchObj: this.state});
        } else {
          this.setState({
            loading: false,
            errorVisible: true,
            errorType: 'showNoFlights',
          });
        }
      } else {
        this.setState({
          loading: false,
          errorVisible: true,
          errorType: 'backError',
        });
      }
    }
  };

  switchFromTo() {
    let from = this.state.from;
    let to = this.state.to;
    let fromSave = this.state.fromSave;
    let toSave = this.state.toSave;
    let airportDestiny = this.state.airportDestiny;
    let airportOrigin = this.state.airportOrigin;
    this.setState({
      from: to,
      to: from,
      fromSave: toSave,
      toSave: fromSave,
      airportDestiny: airportOrigin,
      airportOrigin: airportDestiny,
    });
  }

  renderCardProfile() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          height: 80,
          flexDirection: 'row',
          justifyContent: 'space-around',
          borderRadius: 10,
          margin: 10,
          marginBottom: 0,
        }}>
        <View
          style={{
            flexDirection: 'column',
            width: 80,
            justifyContent: 'center',
            paddingLeft: 20,
          }}>
          <View
            style={{
              height: 40,
              width: 40,
              backgroundColor: DISABLED,
              borderRadius: 80,
              textAlignVertical: 'center',
              justifyContent: 'center',
            }}>
            <Text
              width={800}
              style={{
                color: '#164369',
                fontFamily: 'zivoya',
                fontSize: 25,
                flexDirection: 'column',
                justifyContent: 'center',
                textAlignVertical: 'center',
                textAlign: 'center',
                marginLeft: Platform.OS == 'android' ? 5 : 0,
              }}>
              {'2'}{' '}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'column',
            paddingTop: 20,
            justifyContent: 'flex-start',
            flex: 1,
          }}>
          <Text
            color={'black'}
            style={{
              flexDirection: 'row',
              fontSize: Platform.OS == 'android' ? 18 : 20,
              paddingBottom: 2,
            }}>
            {I18n.t('welcome')}
          </Text>

          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <Text
                color={'black'}
                style={{
                  flexDirection: 'column',
                  fontSize: Platform.OS == 'android' ? 12 : 14,
                }}>
                {I18n.t('labelWelcome1')}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Actions.login();
                }}
                style={{flexDirection: 'column'}}>
                <Text
                  color={OPTIONAL}
                  fontSize={Platform.OS == 'android' ? 12 : 14}>
                  {I18n.t('labelSignIn')}
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              color={'black'}
              style={{
                flexDirection: 'column',
                fontSize: Platform.OS == 'android' ? 12 : 14,
              }}>
              {' ' + I18n.t('or') + ' '}
            </Text>
            <TouchableOpacity
              onPress={() => {
                Actions.Register();
              }}
              style={{flexDirection: 'column'}}>
              <Text
                color={OPTIONAL}
                fontSize={Platform.OS == 'android' ? 12 : 14}>
                {I18n.t('labelRegister')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  renderWhite() {
    return (
      <View
        style={{
          backgroundColor: 'transparent',
          height: 80,
          flexDirection: 'row',
          justifyContent: 'space-around',
          borderRadius: 10,
          margin: 10,
          marginBottom: 0,
        }}></View>
    );
  }

  renderButtonS() {
    if (Platform.OS === 'android') {
      return (
        <TouchableOpacity
          onPress={() => this.switchFromTo()}
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            borderRadius: 32,
            left: '46%',
            top: 13,
            backgroundColor: 'white',
            height: 32,
            width: 32,
            position: 'absolute',
            zIndex: 999999,
            textAlign: 'center',
          }}>
          <Text
            width={800}
            style={{
              backgroundColor: 'transparent',
              flexDirection: 'row',
              color: PRIMARY,
              fontFamily: 'zivoya',
              fontSize: 30,
              height: 30,
              width: 26,
            }}>
            {'A'}{' '}
          </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => this.switchFromTo()}
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            borderRadius: 32,
            left: '46%',
            top: 13,
            backgroundColor: 'white',
            height: 32,
            width: 32,
            position: 'absolute',
            zIndex: 999999,
            textAlign: 'center',
          }}>
          <Text
            width={800}
            style={{
              flex: 1,
              flexDirection: 'column',
              color: PRIMARY,
              fontFamily: 'zivoya',
              fontSize: 30,
              marginTop: Platform.OS == 'ios' ? 4 : 1,
              justifyContent: 'center',
              textAlign: 'center',
              textAlignVertical: 'center',
              marginLeft: Platform.OS == 'android' ? 2 : 0,
            }}>
            {'A'}{' '}
          </Text>
        </TouchableOpacity>
      );
    }
  }

  render() {
    const {
      oneWayAirline,
      calendarMode,
      fromSave,
      modalVisibleFrom,
      modalVisibleTo,
      toSave,
      fromCurrentValue,
      toCurrentValue,
      loadPassenger,
      data,
      errorFrom,
      errorTo,
      from,
      to,
      loading,
      errorType,
      errorVisible,
      termsVisible,
      errorPassenger,
      invalidAccountVisible,
    } = this.state;
    const { route } = this.props;
    const suggestion = data.map(index => ({
      text: `${index.iata_airport_code} ` + '-' + ` ${index.city}`,
      airport: index.name,
      value: index.id,
      iata_Code: index.iata_airport_code,
      city: index.city,
    }));

    return (
      <LinearGradient
        style={{backgroundColor: 'red', flex: 1}}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        colors={['white', '#e6e6e6']}>
        {Platform.OS === 'ios' && (
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.container}
            colors={['transparent', 'transparent']}
            ></LinearGradient>
        )}

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
          }}>
          {<Spinner visible={loading} autoPlay loop />}
          {/* Init modals errors */}
          <CommunErrors
            onConfirm={() => {
              this.setState({childWarning: true, errorVisible: false}, () =>
                this.searchFlights(),
              );
            }}
            onClose={() => this.setState({errorVisible: false})}
            type={errorType}
            visible={errorVisible}
          />
          <InvalidAccount
            onAccept={() => this.setState({invalidAccountVisible: false})}
            visible={invalidAccountVisible}
          />
          {/* End modals errors */}
          <View style={styles.searchContainer}>
            {this.state.filtersModal == true ? (
              <FilterModal
                visible={true}
                setFilterModal={this.setFilterModal}
                applyFilters={this.applyFilters}
                onSwipeComplete={this.onSwipeComplete}></FilterModal>
            ) : null}
            <View style={styles.buttonTextPosition}>
              <TouchableOpacity
                onPress={() => this.changeToRoadTrip()}
                style={[
                  oneWayAirline
                    ? styles.selectedColorLeft
                    : styles.selectedColorRight,
                  styles.leftButtonRadius,
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    justifyContent: 'center',
                    textAlignVertical: 'center',
                    paddingTop: 5,
                  }}>
                  <Text
                    width={800}
                    style={{
                      color: PRIMARY,
                      fontFamily: 'zivoya',
                      fontSize: 28,
                      flexDirection: 'column',
                      textAlign: 'center',
                    }}>
                    {'@'}
                  </Text>
                  <Text
                    fontSize={14}
                    color={oneWayAirline ? '#2F4253' : 'white'}
                    style={{
                      flexDirection: 'column',
                      paddingTop: 3,
                      paddingLeft: 4,
                    }}>
                    {I18n.t('roundTrip')}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.changeToOneWay()}
                style={[
                  oneWayAirline
                    ? styles.selectedColorRight
                    : styles.selectedColorLeft,
                  styles.rightButtonRadius,
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    justifyContent: 'center',
                    textAlignVertical: 'center',
                    paddingTop: 5,
                  }}>
                  <Text
                    width={800}
                    style={{
                      color: PRIMARY,
                      fontFamily: 'zivoya',
                      fontSize: 28,
                      flexDirection: 'column',
                    }}>
                    {'>'}
                  </Text>
                  <Text
                    fontSize={14}
                    color={oneWayAirline ? 'white' : '#2F4253'}
                    style={{
                      flexDirection: 'column',
                      paddingTop: 4,
                      paddingLeft: 4,
                    }}>
                    {I18n.t('oneWay')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity
                  onPress={() => this.modalVisibleFrom(true)}
                  style={{
                    flexDirection: 'column',
                    flex: 1,
                    justifyContent: 'center',
                    backgroundColor: '#3B4F61',
                    height: 60,
                    marginRight: 2,
                    borderBottomColor: 'red',
                    borderBottomWidth: this.state.errorFrom ? 1 : 0,
                  }}>
                  <View
                    pointerEvents="none"
                    style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <View
                      style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        flex: 1,
                      }}>
                      <Text
                        width={800}
                        color={this.state.errorFrom ? 'red' : 'white'}
                        style={{
                          fontSize: 24,
                          flexDirection: 'row',
                          textAlign: 'center',
                          fontFamily: 'Quicksand-Bold',
                        }}>
                        {from != '' ? from.split(' - ')[0] : I18n.t('from')}
                      </Text>
                      <Text
                        width={500}
                        color={this.state.errorFrom ? 'red' : 'white'}
                        style={{
                          fontSize: 12,
                          flexDirection: 'row',
                          textAlign: 'center',
                          fontFamily: 'Quicksand-Bold',
                        }}>
                        {from != ''
                          ? from.split(' - ')[1]
                          : I18n.t('selectCity')}{' '}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {this.renderButtonS()}

                <TouchableOpacity
                  onPress={() => this.modalVisibleTo(true)}
                  style={{
                    flexDirection: 'column',
                    flex: 1,
                    justifyContent: 'center',
                    backgroundColor: '#394e60',
                    height: 60,
                    marginLeft: 2,
                    borderBottomColor: 'red',
                    borderBottomWidth: this.state.errorTo ? 1 : 0,
                  }}>
                  <View
                    pointerEvents="none"
                    style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <View
                      style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        flex: 1,
                      }}>
                      <Text
                        width={800}
                        color={this.state.errorTo ? 'red' : 'white'}
                        style={{
                          fontSize: 24,
                          flexDirection: 'row',
                          textAlign: 'center',
                          fontFamily: 'Quicksand-Bold',
                        }}>
                        {to != '' ? to.split(' - ')[0] : I18n.t('to')}
                      </Text>
                      <Text
                        width={500}
                        color={this.state.errorTo ? 'red' : 'white'}
                        style={{
                          fontSize: 12,
                          flexDirection: 'row',
                          textAlign: 'center',
                          fontFamily: 'Quicksand-Bold',
                        }}>
                        {to != '' ? to.split(' - ')[1] : I18n.t('selectCity')}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{marginTop: 10}}></View>

              <DateRangeSelector
                style={{height: 50}}
                customStyles={{
                  contentInput: {
                    backgroundColor: 'white',
                    borderBottomColor: 'black',
                  },
                }}
                centerAlign // optional text will align center or not
                mode={calendarMode}
                selectedBgColor={'#2F4253'}
                selectedTextColor="white"
                markText={I18n.t('selectRange')}
                startDate={this.state.startDateRange}
                endDate={this.state.endDateRange}
                singleDate={this.state.singleDate}
                customButton={this.customButton}
                blockBefore
                onConfirmRange={(startDate, endDate) => {
                  this.setState({
                    startDateFinal: startDate,
                    startDateRange: startDate,
                    endDateFinal: endDate,
                    endDateRange: endDate,
                  });
                }}
                onConfirmSingle={startDate => {
                  this.setState({singleDate: startDate});
                }}
              />
              <CustomAutoComplete
                origin="departure"
                firstValue={fromSave}
                modalVisible={modalVisibleFrom}
                onSelect={(iataCode, country, airport) =>
                  this.onSelectFrom(iataCode, country, airport)
                }
                onClose={() => this.setState({modalVisibleFrom: false})}
              />

              <CustomAutoComplete
                origin="destination"
                firstValue={toSave}
                modalVisible={modalVisibleTo}
                onSelect={(iataCode, country, airport) =>
                  this.onSelectTo(iataCode, country, airport)
                }
                onClose={() => this.setState({modalVisibleTo: false})}
              />

              <View style={{margin: 5}}></View>

              <View
                style={{
                  flex: 1,
                  marginRight: 10,
                  marginLeft: 10,
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'white',
                    flex: 1,
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    height: 40,
                    borderRadius: 5,
                  }}
                  onPress={() => this.setState({loadPassenger: true})}>
                  <IconFeather
                    style={{
                      color: PRIMARY,
                      flexDirection: 'column',
                      textAlignVertical: 'center',
                      padding: 5,
                      paddingLeft: 10,
                      marginRight: 10,
                    }}
                    name="users"
                    size={25}
                  />

                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      textAlignVertical: 'center',
                      height: 40,
                      paddingRight: 10,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        textAlignVertical: 'center',
                        height: 40,
                      }}>
                      <Text
                        color={'black'}
                        style={{
                          fontSize: 16,
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          paddingTop: Platform.OS == 'ios' ? 12 : 0,
                        }}>
                        {this.renderPassengers()}
                      </Text>

                      <Text
                        color={'#88929A'}
                        style={{
                          fontSize: 14,
                          textAlign: 'right',
                          textAlignVertical: 'center',
                          paddingTop: Platform.OS == 'ios' ? 14 : 0,
                        }}>
                        {I18n.currentLanguage() == 'es'
                          ? this.state.classDescription_sp
                          : this.state.classDescription}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <LoadPassengers
                onCancel={() => this.setState({loadPassenger: false})}
                visible={loadPassenger}
                onConfirm={({
                  adultCount,
                  childCount,
                  infantCount,
                  travel_class_id,
                  classDescription,
                  classDescription_sp,
                }) => {
                  this.loadPassenger(
                    adultCount,
                    childCount,
                    infantCount,
                    travel_class_id,
                  );
                  this.setState({
                    loadPassenger: false,
                    classDescription: classDescription,
                    classDescription_sp: classDescription_sp,
                  });
                }}
              />
              <View style={{margin: 10}}></View>
              <View style={{justifyContent: 'center', flexDirection: 'row'}}>
                <AnimatedButton
                  icon={'-'}
                  text={I18n.t('searchFlight')}
                  action={this.searchFlights}
                  height={50}
                  width={200}
                  style={{
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}></AnimatedButton>
              </View>
              <View style={{margin: 3}}></View>
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#2F4253',
              height: 35,
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
              marginTop: -5,
            }}
          />

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              bottom: 25,
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={styles.filtersButton}
              onPress={() => this.setFilterModal(true)}>
              <Text
                width={500}
                style={{
                  flexDirection: 'column',
                  color: 'white',
                  fontFamily: 'zivoya',
                  fontSize: 20,
                  paddingTop: 11,
                  textAlign: 'right',
                }}>
                {'%'}{' '}
              </Text>
              <Text
                width={500}
                style={{
                  flexDirection: 'column',
                  paddingTop: Platform.OS === 'ios' ? 11 : 8,
                  fontSize: 18,
                }}>
                {' '}
                {I18n.t('filters')}{' '}
                {this.props.flight.appliedFilters > 0
                  ? '(' + this.props.flight.appliedFilters + ') '
                  : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View
          style={{
            justifyContent: 'flex-end',
            flex: 1,
            flexDirection: 'row',
            position: 'absolute',
            bottom: 5,
            height: 200,
            width: '100%',
          }}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            {this.props.login.id_account == '' ||
            this.props.login.id_account == null ||
            this.props.login.id_account == undefined
              ? this.renderCardProfile()
              : this.renderWhite()}

            <TouchableOpacity
              onPress={() => {
                this.shareAction();
              }}
              style={{
                backgroundColor: OPTIONAL,
                height: 80,
                flexDirection: 'row',
                justifyContent: 'center',
                borderRadius: 10,
                margin: 10,
                paddingBottom: 30,
              }}>
              <View
                style={{
                  flexDirection: 'column',
                  width: 80,
                  paddingTop: 20,
                  paddingLeft: 20,
                }}>
                <View
                  style={{
                    height: 40,
                    width: 40,
                    backgroundColor: '#164369',
                    borderRadius: 80,
                    padding: 10,
                  }}>
                  <LottieView
                    source={require('../../assets/animation/share.json')}
                    style={{width: 20, height: 20, justifyContent: 'center'}}
                    autoPlay={this.state.animation}
                    ref={this._setAnimation}
                  />
                </View>
              </View>

              <View style={{flexDirection: 'column', paddingTop: 20, flex: 1}}>
                <Text style={{fontSize: 20, paddingBottom: 2}}>
                  {I18n.t('shareZivoya')}
                </Text>
                <Text style={{fontSize: Platform.OS == 'android' ? 12 : 14}}>
                  {I18n.t('labelShare')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <CustomToast
          ref="defaultToastBottom"
          backgroundColor="black"
          position="bottom"
        />
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'ios' ? 100 : 0,
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
    backgroundColor: 'transparent',
    height: 1000,
    position: 'absolute',
    top: -1000,
    left: 0,
    right: 0,
  },
  typeOfTripContainer: {
    backgroundColor: GRAY02,
  },
  textStyle: {
    marginBottom: 35,
    fontSize: 35,
    textAlign: 'center',
    fontFamily: 'Quicksand-Regular',
  },
  searchContainer: {
    backgroundColor: 'transparent',
  },
  line: {
    borderBottomColor: '#2F4253',
    borderBottomWidth: 3,
  },
  buttonTextPosition: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'transparent',
    height: 35,
  },
  leftButtonRadius: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  rightButtonRadius: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  selectedColorLeft: {
    width: '50%',
    backgroundColor: 'transparent',
    textAlignVertical: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  selectedColorRight: {
    width: '50%',
    backgroundColor: '#2F4253',
    textAlignVertical: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  leftButton: {
    flexDirection: 'column',
    textAlign: 'center',
    alignContent: 'center',
  },
  rightButton: {
    flexDirection: 'column',
    textAlign: 'center',
    alignContent: 'center',
  },
  inputContainer: {
    backgroundColor: '#2F4253',
    paddingTop: 15,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  marginDatePicker: {
    marginTop: '4%',
    height: 45,
  },
  searchButton: {
    height: 60,
    textAlign: 'center',
    justifyContent: 'center',
  },
  textWrapper: {
    flex: 1,
    width: '40%',
  },
  leftColorButton: {
    color: '#2F4253',
  },
  rightColorButton: {
    color: '#2F4253',
  },
  iconUser: {
    position: 'absolute',
    top: 15,
    left: 10,
    color: PRIMARY,
    zIndex: 1200,
  },
  filtersButton: {
    height: 40,
    width: 160,
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A3946',
    borderRadius: 25,
    flexDirection: 'row',
  },
  button: {
    backgroundColor: PRIMARY,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    backgroundColor: 'red',
    height: 1000,
    position: 'absolute',
    top: -1000,
    left: 0,
    right: 0,
  },
  textRegular: {
    color: 'black',
    top: 17,
    fontSize: 16,
    left: 55,
    position: 'absolute',
  },
});

const mapStateToProps = state => ({...state});

export default connect(mapStateToProps, {
  getAirports,
  getFlights,
  selectedFly,
  saveIdAccount,
  setEmail,
  setLanguage,
  setUserData,
  removeNotification,
  setFilters,
  checkAccount,
  setCode,
  setNotification,
  getPublicKey,
  getClasses,
})(FlightSearch);
