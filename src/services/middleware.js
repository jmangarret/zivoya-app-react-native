import axios from 'axios';
import { Service } from 'axios-middleware';

const service = new Service(axios);

service.register({
  onRequest(config) {
    console.log('onRequest');
    console.log(config);
    config.headers = {
      ...config.headers,
    };
    return config;
  },
  onSync(promise) {
    console.log('onSync');
    return promise;
  },
  onResponse(response) {
    console.log('onResponse');
    console.log(response);
    return response;
  },

  onResponseError(error) {
    // handle the response error
    return error
    console.log(error);
  },

});

export default service;
