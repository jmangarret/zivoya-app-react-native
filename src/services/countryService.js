import axios from 'axios';
import {URL_LOGIN} from '../config';

export const getCountries = async () => {
  const bodyFormData = new FormData();

  bodyFormData.append('class', 'Nomenclators');
  bodyFormData.append('function', 'country_codes');
  let globalResponse;
  await axios({
    method: 'post',
    url: URL_LOGIN,
    data: bodyFormData,
    config: {headers: {'Content-Type': 'multipart/form-data'}},
  })
    .then(response => {
      globalResponse = response.data.data;
    })
    .catch(response => {
      globalResponse = response.data.data;
    });
  return globalResponse;
};
