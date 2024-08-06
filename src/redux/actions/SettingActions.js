import axios from 'axios';
import I18n from '../../utils/i18n';
import {URL_BASE_DEV, URL_GET_CLASSES} from '../../config';
import {Platform} from 'react-native';
import pkg from '../../../package.json';
import {SET_LANGUAGE, SET_CLASSES} from './types';

export const setLanguage = lang => async dispatch => {
  dispatch({
    type: SET_LANGUAGE,
    payload: lang,
  });
};

/**
 * Obtener clases
 * @param {*} object
 */
export const getClasses = object => async dispatch => {
  let globalResponse = null;

  await axios({
    method: 'post',
    url: `${URL_BASE_DEV}${
      I18n.currentLanguage() === 'es' ? 'es' : 'en'
    }/${URL_GET_CLASSES}`,
    data: {},
    headers: {
      'Zivoya-Device': Platform.OS,
      'Zivoya-Version': pkg.version,
    },
  })
    .then(({data}) => {
      if (data.status === 200 && data.message === 'OK') {
        dispatch({
          type: SET_CLASSES,
          payload: data.classes,
        });
      }
      globalResponse = data;
    })
    .catch(response => {
      globalResponse = response;
    });

  return globalResponse;
};
