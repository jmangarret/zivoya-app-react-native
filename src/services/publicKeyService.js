/* eslint-disable camelcase */
import {URL_BASE_DEV, URL_GET_PUBLIC_KEY} from '../config';
import axios from 'axios';
import '../components/encrypt/jsencrypt.min.js';
import I18n from '../utils/i18n';
import pkg from '../../package.json';
import {Platform} from 'react-native';

export const getPublicKey = async id_account => {
  const data_account = {
    id_account,
  };

  let publicKey;

  await axios({
    method: 'post',
    url: `${URL_BASE_DEV}${
      I18n.currentLanguage() === 'es' ? 'es' : 'en'
    }/${URL_GET_PUBLIC_KEY}`,
    data: data_account,
    headers: {
      'Zivoya-Device': Platform.OS,
      'Zivoya-Version': pkg.version,
    },
  })
    .then(response => {
      publicKey = response.data.public_key;
    })
    .catch(err => {
      console.log(err);
      publicKey = null;
    });

  return publicKey;
};
