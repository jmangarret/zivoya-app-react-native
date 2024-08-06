/* eslint-disable consistent-return */
/* eslint-disable camelcase */
import {
  URL_BASE_DEV,
  BASE_URL,
  TOKEN,
  USER_PASSWORD,
  USER_NAME,
  URL_GET_FLIGHTS,
} from '../../config';
import {PermissionsAndroid} from 'react-native';

import middleware from '../../services/middleware';
import {
  GET_FLY,
  SELECTED_FLY,
  CALCULATE_PRICES,
  FULL_FLIGHT_SELECTED,
  SAVE_PRICE_INFO,
  SET_FILTERS,
} from './types';
import axios from 'axios';
import I18n from '../../utils/i18n';

const filterCodes = {
  earlyMorning: '00000559',
  morning: '06001159',
  evening: '12001759',
  night: '18002359',
  noStop: '0',
  anyStops: '10',
  stop1: '1',
  stop2: '2',
  all: 'all',
  airline: 'airlines',
  charter: 'charters',
};

export const getFlights = (data1, filters) => async dispatch => {
  const bodyFormData = new FormData();
  let globalResponse;
  let localFilters = JSON.parse(JSON.stringify(filters));

  Object.keys(localFilters).forEach(k => {
    localFilters[k] = filterCodes[localFilters[k]];
  });

  const object = {
    departure_date: data1.oneWayAirline
      ? `${data1.singleDate}`
      : `${data1.startDateFinal}`,
    return_date: `${data1.endDateFinal}`,
    adults: data1.adult,
    infants: data1.infant,
    childs: data1.child,
    departure_code: data1.fromSave,
    destination_code: data1.toSave,
    flight_type: data1.oneWayAirline ? 0 : 1,
    travel_class_id: data1.travel_class_id,
    ...localFilters,
  };

  console.log('--------');
  console.log(object);
  console.log('--------');

  Object.keys(object).forEach(k => {
    bodyFormData.append(k, object[k]);
  });

  console.log('--------');
  console.log(bodyFormData);
  console.log(
    `${URL_BASE_DEV}${
      I18n.currentLanguage() == 'es' ? 'es' : 'en'
    }/${URL_GET_FLIGHTS}`,
  );
  console.log('--------');

  await axios({
    method: 'post',
    url: `${URL_BASE_DEV}${
      I18n.currentLanguage() == 'es' ? 'es' : 'en'
    }/${URL_GET_FLIGHTS}`,
    data: bodyFormData,
    headers: {'Content-Type': 'multipart/form-data'},
  })
    .then(({data}) => {
      console.log(data);

      if (data.flights.length > 0) {
        data.flights[0];
      }

      //APPLY FILTER SIDE CLIENT

      let flightsList = data.flights;
      //STOPPER FILTER
      if (object?.stops !== '10') {
        flightsList = data.flights.filter(
          e => `${e?.aleg?.stops}` === `${object?.stops}`,
        );
        Object.assign(data, {flights: flightsList});
      }

      if (object?.departure_time !== 'all') {
        const depTime = `${object?.departure_time}`;
        const startTime = `${depTime.slice(0, 2)}:${depTime.slice(2, 4)}`;
        const endTime = `${depTime.slice(4, 6)}:${depTime.slice(6, 8)}`;
        var start = new Date('01/01/2001 ' + startTime);
        var end = new Date('01/01/2001 ' + endTime);
        flightsList = data.flights.filter(e => {
          var current = new Date('01/01/2001 ' + e?.aleg?.departure_time);
          return current >= start && current <= end;
        });
        Object.assign(data, {flights: flightsList});
        console.log(flightsList);
      }

      if (object?.return_time !== 'all') {
        const depTime = `${object?.return_time}`;
        const startTime = `${depTime.slice(0, 2)}:${depTime.slice(2, 4)}`;
        const endTime = `${depTime.slice(4, 6)}:${depTime.slice(6, 8)}`;
        var start = new Date('01/01/2001 ' + startTime);
        var end = new Date('01/01/2001 ' + endTime);
        flightsList = data.flights.filter(e => {
          var current = new Date('01/01/2001 ' + e?.aleg?.arrival_time);
          return current >= start && current <= end;
        });
        Object.assign(data, {flights: flightsList});
        console.log(flightsList);
      }
      //APPLY FILTER SIDE CLIENT

      if (data.status === 200 && data.code === 0) {
        dispatch({
          type: GET_FLY,
          payload: data,
        });
      }

      globalResponse = data;
    })
    .catch(error => {
      globalResponse = 'TimeOut';
    });

  return globalResponse;
};

export const selectedFly = selected_fly => async dispatch => {
  dispatch({
    type: SELECTED_FLY,
    payload: selected_fly,
  });
};

export const setFilters = filters => async dispatch => {
  dispatch({
    type: SET_FILTERS,
    payload: filters,
  });
};

export const fullFlightSelected = flight => async dispatch => {
  dispatch({
    type: FULL_FLIGHT_SELECTED,
    payload: flight,
  });
};

export const calculatePrice = calculate_price => async dispatch => {
  const token = TOKEN;
  const user_name = USER_NAME;
  const user_password = USER_PASSWORD;

  const data = {
    token,
    user_name,
    user_password,
    organization_id: 3509,
    charter_id: null,
    flights_schedules: calculate_price.flights_schedules,
    adults: calculate_price.adult,
    childs: calculate_price.child,
    infants: calculate_price.infant,
    oneWayAirline: calculate_price.oneWayAirline,
  };

  const calculate_prices = JSON.stringify(data);

  const response = await middleware.http.post(`${BASE_URL}calculate_prices`, {
    data: calculate_prices,
  });

  dispatch({
    type: CALCULATE_PRICES,
    payload: response?.data?.response.flight_price_data,
  });
};

export const save_price_info = data => async dispatch => {
  dispatch({
    type: SAVE_PRICE_INFO,
    payload: data,
  });
};
