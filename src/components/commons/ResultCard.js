import React, {useState, useEffect} from 'react';
import {Card, Text, Button} from './';
import {StyleSheet, Image, TouchableOpacity, Platform, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  PRIMARY,
  SECONDARY,
  GRAY02,
  GRAY01,
  OPTIONAL,
  DISABLED_01,
} from '../../../assets/colors/colors';
import {connect} from 'react-redux';
import moment from 'moment';
import { useRoute } from '@react-navigation/native';
import I18n from './../../utils/i18n';
import {
  fullFlightSelected,
  selectedFly,
  getFlights,
  calculatePrice,
} from '../../redux/actions';

const planeincard = require('../../../assets/images/planeincard.png');

const seat2 = require('../../../assets/images/seat2.png');

const scaleIcon = require('../../../assets/images/escalas2.png');

const _ResultCard = ({item, index, oneWay, clickScale, fullFlightSelected}) => {
  renderLogoAndName = (isCharter, leg, isSunrise) => {
    let img;

    let name;

    if (isCharter) {
      name = leg.charter_name;

      img = (
        <FastImage
          style={{width: 20, height: 20}}
          source={{
            uri: `https://atc-img.s3.amazonaws.com/charter/logo/${leg.charter_id}.png`,
          }}
        />
      );
    } else {
      if (isSunrise) {
        name = leg.airline_name;
        img = (
          <FastImage
            style={{width: 20, height: 20}}
            source={{
              uri: `https://www.gstatic.com/flights/airline_logos/70px/${leg.airline_code}.png`,
            }}
          />
        );
      } else {
        name = leg.details[0].MarketingAirline.Name;
        img = (
          <FastImage
            style={{width: 20, height: 20}}
            source={{
              uri: `https://www.gstatic.com/flights/airline_logos/70px/${leg.details[0].MarketingAirline.Code}.png`,
            }}
          />
        );
      }
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          paddingLeft: 3,
        }}>
        {img}

        <Text
          style={{marginTop: Platform.OS === 'ios' ? 2 : 0}}
          fontSize={14}
          color={SECONDARY}>
          {' '}
          {this.toUpperCaseFirst(name)}
        </Text>
      </View>
    );
  };

  toUpperCaseFirst = str => {
    const splitStr = str.toLowerCase().split(' ');

    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }

    return splitStr.join(' ');
  };

  renderFligthNumber = (isCharter, airline_code, flight_number) => {
    const charterLabel = isCharter ? (
      <View style={styles.charterContainer}>
        <Text style={{color: GRAY01, fontSize: 14, textAlign: 'center'}}>
          Charter
        </Text>
      </View>
    ) : null;

    return (
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        {charterLabel}
        <Text
          style={{marginTop: Platform.OS === 'ios' ? 2 : 0}}
          fontSize={14}
          color={SECONDARY}>
          {airline_code + '-' + flight_number}
        </Text>
      </View>
    );
  };

  renderNonStops = stops => {
    let text;

    let icon = (
      <Image
        style={{width: 13, height: 5, top: Platform.OS === 'ios' ? 6 : 8}}
        source={scaleIcon}
      />
    );

    let color = SECONDARY;

    let padding = 5;

    switch (true) {
      case stops === 0:
        text = I18n.t('nonStop');
        color = '#C9C9C9';
        padding = 0;
        break;
      case stops === 1:
        text = `  ${stops} ${I18n.t('scale')}`;
        break;
      default:
        text = `  ${stops} ${I18n.t('scales')}`;
        break;
    }

    return (
      <View style={{flexDirection: 'row', paddingLeft: padding}}>
        {stops > 0 ? icon : null}
        <Text
          color={color}
          fontSize={14}
          style={{flexDirection: 'row', fontFamily: 'Roboto-Regular'}}>
          {text}
        </Text>
      </View>
    );
  };

  quantitySeats = seats => {
    if (seats > 10) {
      return ' 10+';
    }
    return ` ${seats}`;
  };

  showDetails = item => {
    Actions.flightDetail({item});
  };

  const selectedFly = async item => {
    fullFlightSelected(item);

    Actions.ConfirmSelection();
  };

  renderOperatingBy = (leg, isCharter, isSunrise) => {
    if (!isCharter && !isSunrise) {
      if (
        leg.details[0].OperatingAirline.Code !=
        leg.details[0].MarketingAirline.Code
      ) {
        return (
          <View
            style={{
              paddingLeft: 5,
              marginVertical: Platform.OS == 'ios' ? 7 : 0,
            }}>
            <Text fontSize={12} color={SECONDARY}>
              {I18n.t('operatedBy')} {leg.details[0].OperatingAirline.Name}
            </Text>
          </View>
        );
      } else {
        return true;
      }
    }
  };

  renderRowCard = (isCharter, leg, isDeparture, isSunrise) => {
    return (
      <View animation="fadeIn">
        <View style={{flexDirection: 'row'}}>
          <View style={styles.containerCard}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {this.renderLogoAndName(isCharter, leg, isSunrise)}

              {this.renderFligthNumber(
                isCharter,
                leg.airline_code,
                leg.flight_number,
              )}
            </View>

            <View style={styles.rowCardMid}>
              <View
                style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                <Text
                  color={PRIMARY}
                  style={{fontSize: 16, fontFamily: 'Roboto-Medium'}}>
                  {' '}
                  {leg.origin_iata_airport_code}{' '}
                </Text>

                <Text
                  color={SECONDARY}
                  style={{
                    fontSize: 16,
                    fontFamily: 'Roboto-Medium',
                    paddingLeft: 5,
                  }}>
                  {moment(leg.departure_time, 'hh:mm').format('hh:mm A')}
                </Text>
              </View>

              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Image style={styles.airplaneImg} source={planeincard} />
              </View>

              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Text
                  color={SECONDARY}
                  style={{fontSize: 16, fontFamily: 'Roboto-Medium'}}>
                  {moment(leg.arrival_time, 'hh:mm').format('hh:mm A')}
                </Text>
                <Text
                  color={PRIMARY}
                  style={{
                    textAlign: 'right',
                    paddingLeft: 5,
                    fontSize: 16,
                    fontFamily: 'Roboto-Medium',
                  }}>
                  {' '}
                  {leg.dest_iata_airport_code}{' '}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingBottom: 5,
                paddingTop: 0,
              }}>
              <TouchableOpacity onPress={() => clickScale(leg)}>
                {this.renderNonStops(leg.stops)}
              </TouchableOpacity>

              <View
                style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                <Text fontSize={14} color={SECONDARY}>
                  {leg.travel_class_name}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    fontSize={14}
                    style={{fontFamily: 'Roboto-Regular'}}
                    color={SECONDARY}>
                    {' ' + this.quantitySeats(leg.seats) + ' '}
                  </Text>
                  <Text
                    style={{
                      color: SECONDARY,
                      marginTop: 2,
                      fontFamily: 'zivoya',
                      fontSize: 14,
                      letterSpacing: 0,
                      textAlign: 'center',
                    }}>
                    {')'}{' '}
                  </Text>
                </View>
              </View>
            </View>

            <View>{this.renderOperatingBy(leg, isCharter, isSunrise)}</View>

            {isDeparture === true ? (
              <View
                style={{
                  borderBottomColor: GRAY02,
                  borderBottomWidth: 1,
                  paddingTop: 4,
                }}
              />
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        marginLeft: '2%',
        marginRight: '2%',
        marginBottom: '4%',
        backgroundColor: GRAY02,
      }}
      key={item + index}>
      <Card
        style={styles.card}
        onCardPress={() => {
          selectedFly(item);
        }}
        key={item + index}>
        {this.renderRowCard(item.isCharter, item.aleg, !oneWay, item.isSunrise)}

        <View style={{marginBottom: 4, marginTop: 4}} />

        {!oneWay
          ? this.renderRowCard(
              item.isCharter,
              item.bleg,
              !oneWay,
              item.isSunrise,
            )
          : null}

        <View style={styles.detailsSection}>
          <View style={{justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() => this.showDetails(item)}
              style={{
                justifyContent: 'center',
                fontFamily: 'Roboto-Regular',
                fontSize: 14,
                backgroundColor: PRIMARY,
                height: 24,
                width: 127,
                borderRadius: 3,
              }}>
              <Text
                style={{color: 'white', letterSpacing: 0, textAlign: 'center'}}>
                {I18n.t('seeDetails')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{justifyContent: 'center'}}>
            <Text
              fontSize={20}
              style={{fontFamily: 'Roboto-Bold', color: OPTIONAL}}
              color={OPTIONAL}>
              {' '}
              {'USD $' + item.fare.Client.toFixed(2)}
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

_ResultCard.defaultProps = {
  item: {},
  index: 0,
};

const styles = StyleSheet.create({
  airplaneImg: {
    width: 68,
    height: 12,
    marginTop: 5,
  },
  textDestiny: {
    flex: 1,
    width: '40%',
  },
  containerCard: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    flexGrow: 1,
  },
  rowCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowCardMid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 0,
  },
  card: {
    paddingTop: '3%',
    paddingBottom: '1%',
    elevation: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  detailsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingLeft: 5,
  },
  charterContainer: {
    borderColor: GRAY01,
    borderStyle: 'solid',
    width: 55,
    height: 20,
    borderWidth: 1,
    borderRadius: 3,
    marginRight: 10,
    justifyContent: 'center',
  },
});

const mapStateToProps = state => ({...state});

const ResultCard = connect(mapStateToProps, {
  selectedFly,
  getFlights,
  calculatePrice,
  fullFlightSelected,
})(_ResultCard);

export {ResultCard};
