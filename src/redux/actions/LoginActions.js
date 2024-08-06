import axios from 'axios';
import {
  URL_BASE_DEV,
  URL_GUEST,
  URL_LOGIN_Z,
  URL_LOGOUT,
  URL_CHECKACCOUNT,
} from '../../config';
import publicIP from 'react-native-public-ip';
import {
  LOGIN_USER,
  GET_ID_ACCOUNT,
  SET_EMAIL,
  SET_CODE,
  CLOSE_SESSION,
} from './types';

import {Platform} from 'react-native';

import I18n from '../../utils/i18n';

import AsyncStorage from '@react-native-async-storage/async-storage';

import pkg from '../../../package.json';

export const login = user_data => async dispatch => {
  const user = {
    email: user_data.email,
    password: user_data.password,
    lang: I18n.currentLanguage() === 'es' ? 'es' : 'en',
  };

  let globalResponse;

  await axios({
    method: 'post',
    url: `${URL_BASE_DEV}${
      I18n.currentLanguage() === 'es' ? 'es' : 'en'
    }/${URL_LOGIN_Z}`,
    data: user,
    headers: {
      'Zivoya-Device': Platform.OS,
      'Zivoya-Version': pkg.version,
    },
  })
    .then(response => {
      response.data.email = user.email;

      dispatch({
        type: LOGIN_USER,
        payload: response.data,
      });

      if (response && response.status === 200) {
        setEmail(user.email);

        setUserData(response.data);
      }

      globalResponse = response.data;
    })
    .catch(response => {
      globalResponse = response.data;
    });

  if (globalResponse && globalResponse.status === 200) {
    await AsyncStorage.setItem('phone', globalResponse.phone || '');
    await AsyncStorage.setItem('email', globalResponse.email || '');
    await AsyncStorage.setItem(
      'code',
      JSON.stringify(globalResponse.code) || '',
    );
    await AsyncStorage.setItem('first_name', globalResponse.first_name || '');
    await AsyncStorage.setItem('last_name', globalResponse.last_name || '');
    await AsyncStorage.setItem('id_account', globalResponse.id_account || '');
  }

  return globalResponse;
};

export const setUserData = user => dispatch => {
  dispatch({
    type: LOGIN_USER,
    payload: user,
  });
};

export const setEmail = email => dispatch => {
  dispatch({
    type: SET_EMAIL,
    payload: email,
  });
};

export const saveIdAccount = id_account => async dispatch => {
  dispatch({
    type: GET_ID_ACCOUNT,
    payload: id_account,
  });
};

export const setCode = code => dispatch => {
  dispatch({
    type: SET_CODE,
    payload: code,
  });
};

export const guestLogin = guest => async dispatch => {
  const language = I18n.currentLanguage() === 'es' ? 'es' : 'en';
  const localIp = await publicIP();

  const guest_user = {
    first_name: guest[0].first_name,
    last_name: guest[0].last_name,
    full_name: `${guest[0].first_name} ${guest[0].last_name}`,
    email: guest[0].email,
    lang: language,
    notifications: 1,
    'pre-account': 1,
    ip_address: localIp,
  };

  let globalResponse;

  await axios({
    method: 'post',
    url: `${URL_BASE_DEV}${language}/${URL_GUEST}`,
    data: guest_user,
    config: {
      'Zivoya-Device': Platform.OS,
      'Zivoya-Version': pkg.version,
    },
  })
    .then(response => {
      if (response) {
        dispatch({
          type: GET_ID_ACCOUNT,
          payload: response?.data?.id_account,
        });
      }
    })
    .catch(response => {
      //TODO informar fallo
    });

  return globalResponse;
};

export const checkAccount = (id_account, uplogin) => async dispatch => {
  const lang = I18n.currentLanguage() === 'es' ? 'es' : 'en';

  const dataObject = {
    id_account: id_account,
    lang,
    uplogin: !!uplogin,
  };

  let globalResponse;
  await axios({
    method: 'post',
    url: `${URL_BASE_DEV}${lang}/${URL_CHECKACCOUNT}`,
    data: dataObject,
    headers: {
      'Zivoya-Device': Platform.OS,
      'Zivoya-Version': pkg.version,
    },
  })
    .then(response => {
      globalResponse = response;
    })
    .catch(response => {
      globalResponse = response;
    });

  return globalResponse;
};

export const logout_session = id_account => async dispatch => {
  const dataObject = {
    id_account: id_account,
    lang: I18n.currentLanguage() === 'es' ? 'es' : 'en',
  };

  let globalResponse;

  await axios({
    method: 'post',
    url: `${URL_BASE_DEV}${
      I18n.currentLanguage() === 'es' ? 'es' : 'en'
    }/${URL_LOGOUT}`,
    data: dataObject,
    headers: {
      'Zivoya-Device': Platform.OS,
      'Zivoya-Version': pkg.version,
    },
  })
    .then(response => {
      globalResponse = response;
    })
    .catch(response => {
      globalResponse = response;
    });

  dispatch({
    type: CLOSE_SESSION,
  });

  return globalResponse;
};
