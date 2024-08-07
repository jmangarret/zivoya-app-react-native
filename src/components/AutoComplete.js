/* eslint-disable react/no-array-index-key */
/* eslint-disable arrow-parens */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
import React, {Component, PureComponent} from 'react';
import {
  View,
  TouchableHighlight,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Dimensions,
  Keyboard,
  FlatList,
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Entypo';
import {Text, Input} from './commons';
import {getCriteriaAirports, loadAirports} from '../services/flyService';
import {GRAY01, PRIMARY, GRAY02, SECONDARY} from '../../assets/colors/colors';
import I18n from '../utils/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

class CustomAutoComplete extends React.PureComponent {
  state = {
    airport: this.props.firstValue,
    suggestionAirports: [],
    id_interval: null,
    resultContainer: 0,
    offset: 0,
    limit: 10,
    recentSearch: [],
  };

  onChangeText = text => {
    if (this.state.id_interval) {
      clearInterval(this.state.id_interval);
    }

    if (text.length > 2) {
      this.setState({
        airport: text,
        animating: true,
        id_interval: setInterval(() => {
          this.getAirportsCriteria(text);
        }, 500),
      });
    } else {
      this.setState({
        animating: false,
        airport: text,
        suggestionAirports: [],
        id_interval: null,
      });
    }

    if (text.length < 2) {
      this.setState({
        animating: false,
        airport: text,
        suggestionAirports: [],
        id_interval: null,
      });
    }
  };

  getAirportsCriteria = async text => {
    const response = await getCriteriaAirports(text);

    this.updateSuggestion(response);
  };

  updateSuggestion = async suggestions => {
    await this.setState({suggestionAirports: suggestions});
    clearInterval(this.state.id_interval);
    this.setState({animating: false});
  };

  loadMoreAirports = async () => {
    const {airport, suggestionAirports, offset, limit} = this.state;
    this.setState({offset: offset + 10});
    if (suggestionAirports.length > 2) {
      const response = await loadAirports(airport, offset, limit);
      let airportArray = suggestionAirports;
      if (response) {
        airportArray = [...suggestionAirports, ...response];
        this.setState({suggestionAirports: airportArray});
      }
    }
  };

  loading() {
    const {animating} = this.state;
    if (animating) {
      return (
        <View
          style={{
            marginTop: 15,
            alignSelf: 'flex-start',
            position: 'absolute',
            right: 12,
          }}>
          <ActivityIndicator size="large" color={PRIMARY} animating />
        </View>
      );
    }
    return true;
  }

  suggestionClick = (iataCode, country, airport) => async () => {
    let item = {iataCode, airport, country};

    listRecent = this.state.recentSearch;

    let flag = true;

    listRecent.forEach(obj => {
      if (obj.iataCode == item.iataCode) {
        flag = false;
      }
    });

    if (flag) {
      listRecent.push(item);
    }

    if (listRecent.length > 3) {
      listRecent = listRecent.slice(-3);
    }

    AsyncStorage.setItem('recentSearch', JSON.stringify(listRecent));

    const {onSelect} = this.props;

    this.setState({airport: iataCode, recentSearch: listRecent});

    onSelect(iataCode, country, airport);
  };

  componentWillMount = async () => {
    const {firstValue} = this.props;

    if (firstValue.length !== 0) {
      const response = await getCriteriaAirports(firstValue);
      this.updateSuggestion(response);
    }

    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );
  };

  componentDidMount = async () => {
    //await AsyncStorage.setItem('recentSearch', null);
    let recentSearchs = await AsyncStorage.getItem('recentSearch');

    if (recentSearchs != null) {
      recentSearchs = JSON.parse(recentSearchs);
      this.setState({recentSearch: recentSearchs});
    }
  };

  /*componentWillUpdate = async () => {
    

  }*/

  componentDidUpdate = async (nextProps, prevProps) => {
    const {firstValue} = this.props;
    if (
      nextProps.modalVisible != this.props.modalVisible &&
      firstValue.length !== 0
    ) {
      this.setState({airport: firstValue, animating: true});
      const response = await getCriteriaAirports(firstValue);
      this.updateSuggestion(response);
    }

    let recentSearchs = await AsyncStorage.getItem('recentSearch');

    if (recentSearchs != null) {
      recentSearchs = JSON.parse(recentSearchs);
      if (
        JSON.stringify(recentSearchs) != JSON.stringify(this.state.recentSearch)
      ) {
        this.setState({recentSearch: recentSearchs});
      }
    }
  };

  keyboardDidShow = e => {
    const keyboardHeight = e.endCoordinates.height;
    const totalHeight = Dimensions.get('window').height;
    const shortHeight = totalHeight - keyboardHeight - 100;
    const resultContainer = totalHeight - keyboardHeight - 200;
    this.setState({shortHeight, resultContainer});
  };

  getKeyboardHeight() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow,
    );
  }

  keyboardDidHide = () => {
    const resultContainer = Dimensions.get('window').height - 250;
    this.setState({
      shortHeight: Dimensions.get('window').height - 150,
      resultContainer,
    });
  };

  renderSuggestions = () => {
    const {suggestionAirports, animating, airport, resultContainer} =
      this.state;

    if (suggestionAirports.length === 0 && !animating && airport.length < 2) {
      return (
        <View style={{flexDirection: 'column'}}>
          <Text
            color={GRAY01}
            fontSize={16}
            width={500}
            style={{marginLeft: 10, flexDirection: 'row', marginTop: 0}}>
            {this.state.recentSearch.length > 0 ? I18n.t('recentSearch') : null}
          </Text>
          <View
            style={{
              height: resultContainer,
              marginLeft: 5,
              marginTop: 5,
              paddingBottom: 10,
            }}>
            <FlatList
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item, index) => index.toString()}
              data={this.state.recentSearch}
              renderItem={({item, index}) => (
                <TouchableHighlight
                  key={index}
                  suggestionText={item}
                  style={{
                    width: '100%',
                    height: 40,
                    padding: 5,
                    borderBottomColor: '#ddd',
                    borderBottomWidth: 1,
                  }}
                  onPress={this.suggestionClick(
                    item.iataCode,
                    item.country,
                    item.airport,
                  )}
                  underlayColor="white">
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={{
                        marginTop: 2,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        flex: 1,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Roboto-Bold',
                          fontSize: 14,
                          color: GRAY01,
                          flexDirection: 'column',
                        }}>
                        {item.iataCode}
                      </Text>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                          fontFamily: 'Roboto-Regular',
                          fontSize: 14,
                          color: GRAY01,
                          flexDirection: 'column',
                          flex: 1,
                        }}>
                        {' - ' + item.country + ', ' + item.airport}
                      </Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )}
            />
          </View>
        </View>
      );
    } else if (
      suggestionAirports.length === 0 &&
      !animating &&
      airport.length > 2
    ) {
      return (
        <Text color={GRAY01} fontSize={13} style={{marginLeft: 10}}>
          {I18n.t('noAirports')}
        </Text>
      );
    } else if (suggestionAirports.length !== 0) {
      return (
        <View style={{height: resultContainer - 15}}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item, index) => index.toString()}
            data={this.state.suggestionAirports}
            onEndReached={() => this.loadMoreAirports()}
            onEndReachedThreshold={0.5}
            renderItem={({item, index}) => (
              <TouchableHighlight
                key={index}
                suggestionText={item}
                style={styles.suggestion}
                onPress={this.suggestionClick(
                  item.iata_airport_code,
                  item.city,
                  item.name,
                )}
                underlayColor="white">
                <View style={{flexDirection: 'row', flex: 1}}>
                  <Icon
                    name="location-pin"
                    top={50}
                    size={30}
                    style={{paddingLeft: 5, marginRight: 5, marginTop: 5}}
                  />
                  <View
                    style={{
                      flexDirection: 'column',
                      flex: 1,
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.principalText}>
                      {item.iata_airport_code} - {item.city}
                    </Text>

                    <Text
                      style={styles.secondaryText}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {item.name}, {item.iata_country_code}
                    </Text>
                  </View>
                </View>
              </TouchableHighlight>
            )}
          />
        </View>
      );
    } else {
      return true;
    }
  };

  close() {
    const {onClose} = this.props;
    onClose(this.setState({modalVisible: false}));
  }

  render() {
    const {modalVisible, onClose, origin} = this.props;
    const {airport, shortHeight} = this.state;
    return (
      <View style={{marginLeft: 20, marginRight: 20}}>
        <Modal
          animationType="slide"
          onRequestClose={() => this.close()}
          transparent
          visible={modalVisible}>
          <View style={{backgroundColor: 'rgba(0,0,0,0.8)', height: '100%'}}>
            <View style={[styles.containerModal, {height: shortHeight}]}>
              <View style={{flexDirection: 'row-reverse'}}>
                <Icon
                  name="cross"
                  right={80}
                  top={50}
                  size={30}
                  style={{paddingLeft: 5, marginRight: 5, marginTop: 5}}
                  onPress={() => onClose()}
                />
              </View>

              <View style={{marginLeft: 20, marginRight: 20, marginTop: -5}}>
                <Input
                  autoFocus
                  onFocus={() => this.getKeyboardHeight()}
                  style={{
                    backgroundColor: 'white',
                    marginBottom: 0,
                    position: 'relative',
                  }}
                  value={airport}
                  onChangeText={event => this.onChangeText(event.text)}
                  modeInput="flat"
                  label={
                    origin === 'departure'
                      ? I18n.t('originPlaceHolder')
                      : I18n.t('destinationPlaceHolder')
                  }
                  placeholder={I18n.t('search')}
                />
                {this.loading()}
                {this.renderSuggestions()}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  suggestionsWrapper: {
    height: 180,
  },
  suggestion: {
    width: '100%',
    height: 60,
    padding: 5,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    flex: 1,
  },
  suggestionText: {
    fontSize: 15,
  },
  input: {
    fontSize: 15,
  },
  wrapper: {
    flex: 1,
  },
  principalText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: 'black',
    flex: 1,
  },
  secondaryText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: GRAY01,
    flex: 1,
  },
  containerModal: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    margin: 20,
    // height: 300,
    paddingBottom: 10,
    marginTop: '15%',
    backgroundColor: 'white',
  },
  containerModalWithKeyboard: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    margin: 20,
    height: 150,
    paddingBottom: 10,
    marginTop: '15%',
    backgroundColor: 'white',
  },
});

const mapStateToProps = state => ({...state});

export default connect(mapStateToProps, {})(CustomAutoComplete);
