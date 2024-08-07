/* eslint-disable no-underscore-dangle */
import React from 'react';
import { connect } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import {
  StyleSheet, View, Image, TouchableOpacity, Platform
} from 'react-native';
import { Text } from './Text';
import I18n from '../../utils/i18n';
import { PRIMARY, SECONDARY } from '../../../assets/colors/colors';

const _ModifySearch = ({ topViewStyle, title }) => (
  <View style={topViewStyle}>
    <Text title={title} fontSize={16} style={{ fontFamily: 'Quicksand-Bold' }} color={SECONDARY}>
      {title}
      {' '}
    </Text>
    <View style={styles.resultAndSearchContainer}>
      <TouchableOpacity
        style={styles.resultAndSearchContainer}
        onPress={() => { Actions.flightSearch(); }} >
        <Text style={{ flexDirection: 'column', color: PRIMARY, fontFamily: 'zivoya', fontSize: 16, paddingTop: 4, textAlign: 'left' }} >{'%'} </Text>        

        <Text fontSize={16} color={PRIMARY}>{I18n.t('modifySearch')}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

_ModifySearch.defaultProps = {
  title: "",
  topViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
};

const styles = StyleSheet.create({
  resultAndSearchContainer: {
    flexDirection: 'row',
   
  },
  imageFilter: {
    marginTop: Platform.OS == 'ios' ? '4%' : '5%',
    marginRight: '2%',
    width: 10,
    height: 10

  },
});

const mapStateToProps = state => (
  { ...state });

const ModifySearch = connect(mapStateToProps, {})(_ModifySearch);

export { ModifySearch };
