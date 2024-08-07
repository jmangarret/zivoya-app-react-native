import axios from 'axios';
import {Service} from 'axios-middleware';
import middleware from './middleware';

import I18n from '../utils/i18n';

import {
  BASE_URL,
  DATA_FLY,
  TOKEN,
  USER_NAME,
  USER_PASSWORD,
  URL_AIRPORTS,
  URL_BASE_DEV,
} from '../config';
export const getAirports = async () => {
  const token = TOKEN;
  const user_name = USER_NAME;
  const user_password = USER_PASSWORD;

  const objeto = {
    token,
    user_name,
    user_password,
  };
  const flyData = JSON.stringify(objeto);
  const response = await middleware.http.post(`${BASE_URL}get_airports`, {
    data: flyData,
  });
  return response.data.response;
};

export const getCriteriaAirports = async text => {
  const bodyFormData = new FormData();

  const token = TOKEN;
  const user_name = USER_NAME;
  const user_password = USER_PASSWORD;

  const objeto = {
    // token,
    // user_name,
    // user_password,
    offset: 0,
    limit: 10,
    criteria: text,
  };

  Object.keys(objeto).forEach(k => {
    bodyFormData.append(k, objeto[k]);
  });

  let globalResponse;

  console.log(objeto);
  console.log(
    `${URL_BASE_DEV}${
      I18n.currentLanguage() == 'es' ? 'es' : 'en'
    }/${URL_AIRPORTS}`,
  );

  await axios({
    method: 'post',
    url: `${URL_BASE_DEV}${
      I18n.currentLanguage() == 'es' ? 'es' : 'en'
    }/${URL_AIRPORTS}`,
    data: objeto,
    //headers: { 'Content-Type': 'application/json' }
  })
    .then(response => {
      console.log(response);
      globalResponse = response?.data?.airports || [];
    })
    .catch(e => {
      console.log(e);
      /*
      globalResponse = response?.data;
      */
      globalResponse = [];
    });

  return globalResponse;
};

export const loadAirports = async (text, offset, limit) => {
  const bodyFormData = new FormData();

  const token = TOKEN;
  const user_name = USER_NAME;
  const user_password = USER_PASSWORD;

  const objeto = {
    token,
    user_name,
    user_password,
    limit,
    offset,
    criteria: text,
  };

  Object.keys(objeto).forEach(k => {
    bodyFormData.append(k, objeto[k]);
  });

  let globalResponse;

  await axios({
    method: 'post',
    url: `${URL_BASE_DEV}${
      I18n.currentLanguage() == 'es' ? 'es' : 'en'
    }/${URL_AIRPORTS}`,
    data: objeto,
    //headers: { 'Content-Type': 'multipart/form-data' }
  })
    .then(response => {
      console.log(response);

      globalResponse = response?.data?.airports || [];
    })
    .catch(() => {
      globalResponse = [];
    });

  return globalResponse;
};
