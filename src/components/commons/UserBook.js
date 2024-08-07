import React, {Component} from 'react';
import {Card, Text} from './';
import {StyleSheet, Platform, Image, TouchableOpacity, View} from 'react-native';
import {
  SECONDARY,
  GRAY02,
  GRAY01,
  PRIMARY,
  OPTIONAL,
} from '../../../assets/colors/colors';
import {connect} from 'react-redux';
import moment from 'moment';
import I18n from '../../utils/i18n';
const planeincard = require('../../../assets/images/planeincard.png');
const rangeCalendar = require('../../../assets/images/rangeCalendar.png');

class _UserBook extends Component {
  constructor(props) {
    super(props);
  }
  toUpperCaseFirst = str => {
    const splitStr = str.toLowerCase().split(' ');

    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }

    return splitStr.join(' ');
  };

  renderFligthNumber = (isCharter, flight_number) => {
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
          {flight_number}
        </Text>
      </View>
    );
  };

  renderCode = str => {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        <Text
          style={{
            marginTop: Platform.OS === 'ios' ? 2 : 0,
            fontFamily: 'Roboto-Medium',
          }}
          fontSize={14}
          color={SECONDARY}>
          {I18n.t('bookCode')}:
        </Text>
        <Text
          style={{marginLeft: 10, marginTop: Platform.OS === 'ios' ? 2 : 0}}
          fontSize={14}
          color={SECONDARY}>
          {this.props.item.sabre_pnr}
        </Text>
      </View>
    );
  };

  renderNonStops = stops => {
    let text = moment(this.props.item.departure_date).format('LL');

    let icon = (
      <Image
        style={{width: 20, height: 20, top: Platform.OS === 'ios' ? 6 : 8}}
        source={rangeCalendar}
      />
    );
    let color = SECONDARY;

    return (
      <View style={{flexDirection: 'row', paddingLeft: 0}}>
        <Text
          color={color}
          fontSize={14}
          style={{flexDirection: 'row', fontFamily: 'Roboto-Medium'}}>
          {I18n.t('dateDeparture')}:
        </Text>
        <Text
          color={color}
          fontSize={14}
          style={{
            flexDirection: 'row',
            marginLeft: 10,
            fontFamily: 'Roboto-Regular',
          }}>
          {text}
        </Text>
      </View>
    );
  };

  /*
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
  */

  renderRowCard = () => {
    return (
      <View animation="fadeIn">
        <View style={{flexDirection: 'row'}}>
          <View style={styles.containerCard}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {this.renderCode()}
              {this.renderFligthNumber(false, this.props.item.departure_number)}
            </View>

            <View style={{flexDirection: 'row'}}>{this.renderNonStops()}</View>

            <View style={styles.rowCardMid}>
              <View
                style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                <Text
                  color={PRIMARY}
                  style={{fontSize: 16, fontFamily: 'Roboto-Medium'}}>
                  {' '}
                  {this.props.item.d_depart_code}{' '}
                </Text>

                <Text
                  color={SECONDARY}
                  style={{
                    fontSize: 16,
                    fontFamily: 'Roboto-Medium',
                    paddingLeft: 5,
                  }}>
                  {moment(this.props.item.departure_hour_min, 'hh:mm').format(
                    'hh:mm A',
                  )}
                </Text>
              </View>

              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Image style={styles.airplaneImg} source={planeincard} />
              </View>

              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Text
                  color={SECONDARY}
                  style={{fontSize: 16, fontFamily: 'Roboto-Medium'}}>
                  {moment(this.props.item.return_hour_min, 'hh:mm').format(
                    'hh:mm A',
                  )}
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
                  {this.props.item.d_arrival_code}{' '}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingBottom: 5,
                paddingTop: 0,
              }}></View>

            <View
              style={{
                borderBottomColor: GRAY02,
                borderBottomWidth: 1,
                paddingTop: 4,
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View
        style={{
          marginLeft: '2%',
          marginRight: '2%',
          marginBottom: '4%',
          marginTop: '1%',
          backgroundColor: GRAY02,
        }}
        key={this.props.index}>
        <Card
          style={styles.card}
          onCardPress={() => {
            //  selectedFly(this.props.item);
          }}
          key={this.props.index}>
          {this.renderRowCard()}
          <View style={{marginBottom: 4, marginTop: 4}} />
          {
            <View style={styles.detailsSection}>
              <View style={{justifyContent: 'center'}}>
                <View style={{flexDirection: 'row'}}>
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
                    <Text
                      fontSize={14}
                      style={{fontFamily: 'Roboto-Regular'}}
                      color={SECONDARY}>
                      {' ' + this.props.item.first_name + ' '}
                      {' ' + this.props.item.last_name + ' '}
                    </Text>
                  </Text>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Text
                  fontSize={20}
                  style={{fontFamily: 'Roboto-Bold', color: OPTIONAL}}
                  color={OPTIONAL}>
                  {' '}
                  {'USD $' + this.props.item?.cost}
                </Text>
              </View>
            </View>
          }
        </Card>
      </View>
    );
  }
}

_UserBook.defaultProps = {
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

const UserBook = connect(mapStateToProps, {})(_UserBook);

export {UserBook};
