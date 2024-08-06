import axios from 'axios';
import {URL_LOGIN, URL_SEARCH_BY_PNR, URL_BASE_DEV} from '../../config';
import publicIP from 'react-native-public-ip';
import {
  SAVE_PASSENGER,
  GET_PASSENGERS,
  GUEST_USER,
  GET_USER_FLIGHTS,
} from './types';
import I18n from '../../utils/i18n';

export const savePassenger = passengers => async dispatch => {
  dispatch({
    type: SAVE_PASSENGER,
    payload: passengers,
  });
};

export const continueAsAGuest = guestFlag => async dispatch => {
  dispatch({
    type: GUEST_USER,
    payload: guestFlag,
  });

  return guestFlag;
};

export const getPassengerList = id_account => async dispatch => {
  const bodyFormData = new FormData();

  const data = {
    id_account,
  };

  const dataDecode = JSON.stringify(data);

  bodyFormData.append('class', 'Flight');
  bodyFormData.append('function', 'get_passengers_flight');
  bodyFormData.append('data', dataDecode);
  let globalResponse;
  await axios({
    method: 'post',
    url: URL_LOGIN,
    data: bodyFormData,
    config: {headers: {'Content-Type': 'multipart/form-data'}},
  })
    .then(response => {
      dispatch({
        type: GET_PASSENGERS,
        payload: response.data.data,
      });

      globalResponse = response.data;
    })
    .catch(response => {
      globalResponse = response.data;
    });

  return globalResponse;
};

export const searchByPNR = object => async dispatch => {
  const bodyFormData = new FormData();

  const dataObject = {
    first_name: object.nameInput.value,
    last_name: object.lastNameInput.value,
    pnr: object.PNRInput.value.toUpperCase(),
  };

  Object.keys(dataObject).forEach(k => {
    bodyFormData.append(k, dataObject[k]);
  });

  console.log(dataObject);
  console.log(
    `${URL_BASE_DEV}${
      I18n.currentLanguage() == 'es' ? 'es' : 'en'
    }/${'zv-search-booking'}`,
  );
  let globalResponse = null;
  await axios({
    method: 'post',
    url: `${URL_BASE_DEV}${
      I18n.currentLanguage() == 'es' ? 'es' : 'en'
    }/${'zv-search-booking'}`,
    data: dataObject,
    // headers: {'Content-Type': 'multipart/form-data'},
  })
    .then(({data}) => {
      console.log(data);

      globalResponse = data;
    })
    .catch(response => {
      console.log(response);
      globalResponse = response;
    });

  return globalResponse;
};

export const fetchUserFlights = id_account => async dispatch => {
  const bodyFormData = new FormData();
  const dataObject = {
    id_account,
  };
  Object.keys(dataObject).forEach(k => {
    bodyFormData.append(k, dataObject[k]);
  });
  let globalResponse = null;
  await axios({
    method: 'post',
    url: `${URL_BASE_DEV}${
      I18n.currentLanguage() == 'es' ? 'es' : 'en'
    }/${'zv-my-flights'}`,
    data: bodyFormData,
  })
    .then(({data}) => {
      console.log('/////////');
      console.log(data);
      console.log('/////////');

      dispatch({
        type: GET_USER_FLIGHTS,
        payload: data,
      });
      globalResponse = data;
    })
    .catch(response => {
      globalResponse = response;
    });

  return globalResponse;
};
