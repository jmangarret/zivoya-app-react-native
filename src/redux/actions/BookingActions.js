import axios from 'axios';
import {
  URL_LOGIN,
  BASE_URL,
  URL_ENCRYPT,
  URL_LOCAL,
  TOKEN,
  USER_PASSWORD,
  BASE_LOCAL2,
  USER_NAME,
  URL_BASE_DEV,
  URL_PAY_FLIGHT,
} from '../../config';
import moment from 'moment';
import {
  GET_FlIGHTS_ID,
  GET_SSL_TXN_ID,
  GET_BOOKING_DATA,
  LIST_CREDITCARDS,
  SAVE_CC_DATA,
} from './types';
import middleware from '../../services/middleware';
import '../../components/encrypt/jsencrypt.min.js';
import I18n from '../../utils/i18n';
import pkg from '../../../package.json';
import {Platform} from 'react-native';

export const multiSaveFlight = data => async dispatch => {
  const {id_account} = data.login;
  const bodyFormData = new FormData();

  let returnFlight = null;

  const passengers = data.passenger.passengerData.map(passenger => ({
    title: passenger.gender === 'M' ? 'mr' : 'mss',
    first_name: passenger.first_name,
    last_name: passenger.last_name,
    gender: passenger.gender,
    birth_date: moment(passenger.birth_date, 'MM-DD-YYYY').format('YYYY-MM-DD'),
    email: passenger.email,
    phone_number: passenger.phone_number,
    address: passenger.address,
    city: passenger.city,
    state: passenger.state,
    country: passenger.country,
    zip: passenger.zip,
    frecuent_flyer: passenger.ff_number || '',
    ofac_code: passenger.ofac_code || '',
    nationality: passenger.nationality,
    cub_mother_maiden_name: passenger.cub_mother_maiden_name,
    foreign_address: passenger.foreign_address,
    foreign_city: passenger.foreign_city,
    foreign_province: passenger.foreign_province,
    foreign_zip: passenger.foreign_zip,
    emergency_name: passenger.emergency_name,
    emergency_phone: passenger.emergency_phone,
    cub_first_name: passenger.cub_first_name,
    cub_last_name: passenger.cub_last_name,
    usa_arrival_doc: passenger.usa_arrival_doc,
    usa_country: passenger.usa_country,
    usa_doc_number: passenger.usa_doc_number,
    usa_exp_date:
      moment(passenger.usa_exp_date, 'MM-DD-YYYY').format('YYYY-MM-DD') !=
      'Invalid Date'
        ? moment(passenger.usa_exp_date, 'MM-DD-YYYY').format('YYYY-MM-DD')
        : null,
    for_arrival_doc: passenger.for_arrival_doc,
    for_country: passenger.for_country,
    for_doc_number: passenger.for_doc_number,
    for_exp_date:
      passenger.for_exp_date !== ''
        ? moment(passenger.for_exp_date, 'MM-DD-YYYY').format('YYYY-MM-DD')
        : passenger.for_exp_date,
  }));

  const departureFlight = {
    flight_call: data.flight.full_fly_data.aleg.flight_call,
    airline_code: data.flight.full_fly_data.aleg.airline_code,
    flight_number: data.flight.full_fly_data.aleg.flight_number,
    date: data.flight.full_fly_data.aleg.date,
    departure_time: data.flight.full_fly_data.aleg.departure_time,
    origin_iata_airport_code:
      data.flight.full_fly_data.aleg.origin_iata_airport_code,
    destination_iata_airport_code:
      data.flight.full_fly_data.aleg.dest_iata_airport_code,
    charter_name: data.flight.full_fly_data.isCharter
      ? data.flight.full_fly_data.aleg.charter_name
      : data.flight.full_fly_data.aleg.airline_code,
  };

  if (!data.flight.selected_fly.oneWayAirline) {
    returnFlight = {
      flight_call: data.flight.full_fly_data.bleg.flight_call,
      airline_code: data.flight.full_fly_data.bleg.airline_code,
      flight_number: data.flight.full_fly_data.bleg.flight_number,
      date: data.flight.full_fly_data.bleg.date,
      departure_time: data.flight.full_fly_data.bleg.departure_time,
      origin_iata_airport_code:
        data.flight.full_fly_data.bleg.origin_iata_airport_code,
      destination_iata_airport_code:
        data.flight.full_fly_data.bleg.dest_iata_airport_code,
      charter_name: data.flight.full_fly_data.isCharter
        ? data.flight.full_fly_data.bleg.charter_name
        : data.flight.full_fly_data.bleg.airline_code,
    };
  }

  const fareFlight = {
    agency_adult_price: data.flight.full_fly_data.fare.cost.ADT,
    agency_child_price: data.flight.full_fly_data.fare.cost.CNN,
    agency_infant_price: data.flight.full_fly_data.fare.cost.INF,
    client_adult_price: data.flight.full_fly_data.isCharter
      ? data.flight.full_fly_data.fare.price.ADT
      : data.flight.full_fly_data.fare.Price.ADT,
    client_child_price: data.flight.full_fly_data.isCharter
      ? data.flight.full_fly_data.fare.price.ADT
      : data.flight.full_fly_data.fare.Price.CNN,
    client_infant_price: data.flight.full_fly_data.isCharter
      ? data.flight.full_fly_data.fare.price.ADT
      : data.flight.full_fly_data.fare.Price.INF,
  };

  const parameters = {
    id_account,
    agent: 'APP',
    passengers,
    departureFlight,
    returnFlight,
    fareFlight,
  };

  const data1 = JSON.stringify(parameters);

  bodyFormData.append('class', 'Flight');
  bodyFormData.append('function', 'multi_save_flight');
  bodyFormData.append('data', data1);
  let flightIds;
  let globalResponse;

  await axios({
    method: 'post',
    url: URL_LOGIN,
    data: bodyFormData,
    config: {headers: {'Content-Type': 'multipart/form-data'}},
  })
    .then(response => {
      flightIds = response.data.data;
      globalResponse = response.data;
      dispatch({
        type: GET_FlIGHTS_ID,
        payload: flightIds,
      });
      return response.data;
    })
    .catch(response => {
      flightIds = response.data.data;
      globalResponse = response.data;
    });
  return globalResponse;
};

export const payFlight = creditCardData => async dispatch => {
  const crypt = new JSEncrypt({default_key_size: 4096});

  const data_account = {
    id_account: creditCardData.id_account,
  };

  const dataEncode = JSON.stringify(data_account);
  const bodyFormData = new FormData();

  const cc_data = creditCardData.creditCardSelected;

  bodyFormData.append('class', 'Payments');
  bodyFormData.append('function', 'get_public_key');
  bodyFormData.append('data', dataEncode);
  let publicKey;
  await axios({
    method: 'post',
    url: URL_LOGIN,
    data: bodyFormData,
    config: {headers: {'Content-Type': 'multipart/form-data'}},
  })
    .then(response => {
      publicKey = response.data.data.publicKey;
      dispatch({
        type: SAVE_CC_DATA,
        payload: cc_data,
      });
    })
    .catch(response => {
      publicKey = response.data.data;
    });

  crypt.setPublicKey(publicKey);
  const bodyFormDataCC = new FormData();

  const data = {
    id_account: creditCardData.id_account,
    agent: 'APP',
    amount: creditCardData.amount,
    cc_data: creditCardData.creditCardSelected,
    cvv: crypt.encrypt(creditCardData.CVV),
  };

  const decodeData = JSON.stringify(data);

  bodyFormDataCC.append('class', 'Payments');
  bodyFormDataCC.append('function', 'pay_flight');
  bodyFormDataCC.append('data', decodeData);
  let ssl_txt_id;
  let status;

  await axios({
    method: 'post',
    url: URL_LOGIN,
    data: bodyFormDataCC,
    config: {headers: {'Content-Type': 'multipart/form-data'}},
  })
    .then(response => {
      ssl_txt_id = response.data.data;
      status = response.data.status;
      dispatch({
        type: GET_SSL_TXN_ID,
        payload: ssl_txt_id,
      });
    })
    .catch(response => {
      ssl_txt_id = response.data.data;
    });

  return status;
};

export const payFlightAirline = (props, state) => async dispatch => {
  let data = {
    token: TOKEN,
    user_name: USER_NAME,
    user_password: USER_PASSWORD,
  };

  const dataToJson = JSON.stringify(data);

  const response = await middleware.http.post(`${URL_ENCRYPT}get_public_key`, {
    data: dataToJson,
  });

  const crypt = new JSEncrypt({default_key_size: 1024});

  crypt.setPublicKey(response.data.public_key);

  const decodeData = {
    id_account: state.id_account,
    cc_data: {
      cc_name: state.creditCardSelected.cc_name,
      cc_number: state.creditCardSelected.cc_number,
    },
    public_key: response.data.public_key,
  };

  const dataPay = JSON.stringify(decodeData);

  const cc_data = state.creditCardSelected;

  const bodyFormPay = new FormData();
  bodyFormPay.append('class', 'Payments');
  bodyFormPay.append('function', 'pay_card');
  bodyFormPay.append('data', dataPay);

  let responsePay;
  await axios({
    method: 'post',
    url: URL_LOGIN,
    data: bodyFormPay,
    config: {headers: {'Content-Type': 'multipart/form-data'}},
  })
    .then(response => {
      responsePay = response.data.data;
      dispatch({
        type: SAVE_CC_DATA,
        payload: cc_data,
      });
    })
    .catch(response => {});

  const dataEncrypt = {
    expdate: responsePay.exp_date,
    full_name: responsePay.name,
    number: responsePay.number,
    cvv: crypt.encrypt(state.CVV),
  };

  return dataEncrypt;
};

export const bookingExternalFunction = (props, cardData) => async dispatch => {
  const token = TOKEN;
  const user_name = USER_NAME;
  const user_password = USER_PASSWORD;

  let returnFlightNumber = props.flight.selected_fly.oneWayAirline
    ? (returnFlightNumber = '')
    : (returnFlightNumber = props.flight.full_fly_data.bleg.flight_number);
  const flightParameters = {
    token: TOKEN,
    user_name: USER_NAME,
    user_password: USER_PASSWORD,
    agent_code_dp: 558000,
    action: 'get',
    organization_id: 3509,
    flight_departure: 'departure',
    flight_return: props.flight.selected_fly.oneWayAirline ? '' : 'return',
    departure_flight_number: props.flight.full_fly_data.aleg.flight_number,
    return_flight_number: returnFlightNumber,
    charter_id: props.flight.full_fly_data.aleg.charter_id,
    charter_id_orig: props.flight.full_fly_data.aleg.charter_id,
    date_from: props.flight.full_fly_data.aleg.date,
    date_to: props.flight.selected_fly.endDateFinal,
    departure_city: props.flight.full_fly_data.aleg.origin_iata_airport_code,
    destination_city: props.flight.full_fly_data.aleg.dest_iata_airport_code,
    return_to_city: props.flight.full_fly_data.aleg.origin_iata_airport_code,
    return_from_city: props.flight.full_fly_data.aleg.dest_iata_airport_code,
    flight_type: props.flight.selected_fly.oneWayAirline ? 1 : 2,
  };

  const arrayPassenger = props.passenger.passengerData;

  const passengersAPI = arrayPassenger.map(passenger => ({
    first_name: passenger.first_name,
    last_name: passenger.last_name,
    gender: passenger.gender,
    title: passenger.gender === 'M' ? 'mr' : 'mss',
    birth_date_input: moment(passenger.birth_date, 'MM-DD-YYYY').format(
      'YYYY-MM-DD',
    ),
    email: passenger.email,
    phone: passenger.phone_number,
    ofac_code: passenger.ofac_code || '',
    nationality: passenger.nationality,
    cub_mother_maiden_name: passenger.cub_mother_maiden_name,
    cub_first_name: passenger.cub_first_name,
    cub_last_name: passenger.cub_last_name,
    usa_arrival_doc: passenger.usa_arrival_doc,
    usa_country: passenger.usa_country,
    usa_doc_number: passenger.usa_doc_number,
    usa_exp_date_input: moment(passenger.usa_exp_date, 'MM-DD-YYYY').format(
      'YYYY-MM-DD',
    ),
    for_arrival_doc: passenger.for_arrival_doc,
    for_country: passenger.for_country,
    for_doc_number: passenger.for_doc_number,
    for_exp_date_input:
      passenger.for_exp_date !== ''
        ? moment(passenger.for_exp_date, 'MM-DD-YYYY').format('YYYY-MM-DD')
        : passenger.for_exp_date,
    address: passenger.address,
    city: passenger.city,
    state: passenger.state,
    country: passenger.country,
    zip: passenger.zip,
    foreign_address: passenger.foreign_address,
    foreign_city: passenger.foreign_city,
    foreign_province: passenger.foreign_province,
    foreign_zip: passenger.foreign_zip,
    emergency_phone: passenger.emergency_phone,
    emergency_name: passenger.emergency_name,
    notes: '',
    flight_type: props.flight.selected_fly.oneWayAirline ? 0 : 1,
  }));

  const objPassenger = {};
  for (let i = 0; i < passengersAPI.length; i++) {
    objPassenger[i + 1] = passengersAPI[i];
  }

  const card_info = [];
  card_info.push({card_info: cardData, encrypted: 1, type: 'card'});

  const parameters = {
    passengers: objPassenger,
    flight_info_dep: props.flight.full_fly_data.aleg,
    flight_info_ret: props.flight.selected_fly.oneWayAirline
      ? null
      : props.flight.full_fly_data.bleg,
    fop: card_info[0],
    iata_airline_code: props.flight.full_fly_data.aleg.airline_code,
    agent_name: 'WEB_MNL',
    flight_type: props.flight.selected_fly.oneWayAirline ? 1 : 2,
    token: TOKEN,
    user_name,
    password: user_password,
    user_password,
    agent_code_dp: 558987,
    action: 'get',
    organization_id: 3509,
    flight_departure: 'departure',
    flight_return: props.flight.selected_fly.oneWayAirline ? '' : 'return',
    departure_flight_number: props.flight.full_fly_data.aleg.flight_number,
    return_flight_number: returnFlightNumber,
    charter_id: props.flight.full_fly_data.aleg.charter_id,
    charter_id_orig: props.flight.full_fly_data.aleg.charter_id,
    date_from: props.flight.full_fly_data.aleg.date,
    date_to: props.flight.selected_fly.endDateFinal,
    departure_city: props.flight.full_fly_data.aleg.origin_iata_airport_code,
    destination_city: props.flight.full_fly_data.aleg.dest_iata_airport_code,
    return_to_city: props.flight.full_fly_data.aleg.origin_iata_airport_code,
    return_from_city: props.flight.full_fly_data.aleg.dest_iata_airport_code,
  };

  const parametersToJ = JSON.stringify(parameters);

  try {
    //const response = await middleware.http.post('http://172.10.1.56/ATC/custom_APIs/mnlConnect/public/index.php/flights/booking_external', { data: parametersToJ });
    //const response = await middleware.http.post('http://172.10.1.65/PegaleAEsta/custom_APIs/mnlConnect/public/index.php/flights/booking_external', { data: parametersToJ });

    // const response = await middleware.http.post('http://172.10.1.56/ATC/custom_APIs/mnlConnect/public/index.php/flights/booking_external', { data: parametersToJ });
    // const response = await middleware.http.post('http://172.10.1.65/AirConnect/custom_APIs/mnlConnect/public/index.php/flights/booking_external', { data: parametersToJ });

    const response = await middleware.http.post(`${BASE_URL}booking_external`, {
      data: parameters,
    });

    // const response = await middleware.http.post('http://dev-mnl.folderit.net/custom_APIs/mnlConnect/public/index.php/flights/booking_external', { data: parametersToJ });

    if (response.data.response.status == 'Complete') {
      dispatch({
        type: GET_BOOKING_DATA,
        payload: response.data,
      });
    }
    return response;
  } catch (e) {
    return 'Error';
  }
};

export const removeFlightBook = data => async dispatch => {
  const bodyFormData = new FormData();
  const {id_account} = data.login;

  const dataToSend = {
    id_account,
    flight_ids: data.booking.flightsId.flight_ids,
  };

  const dataEncode = JSON.stringify(dataToSend);

  bodyFormData.append('class', 'Flight');
  bodyFormData.append('function', 'remove_flight_book');
  bodyFormData.append('data', dataEncode);
  let bookingRemoved;
  await axios({
    method: 'post',
    url: URL_LOGIN,
    data: bodyFormData,
    config: {headers: {'Content-Type': 'multipart/form-data'}},
  })
    .then(response => {
      bookingRemoved = response.data.data;
    })
    .catch(response => {});
  return bookingRemoved;
};

export const removeTxnId = data => async dispatch => {
  const bodyFormData = new FormData();
  const {Client} = data.flight.full_fly_data.fare;
  const {user} = data.login;

  const dataToSend = {
    id_account: user.id_account,
    ssl_txn_id: data.booking.sslTxnId.ssl_txn_id,
    txn_type: 'ccdelete',
    cc_type: data.booking.cc_data.cc_type,
    amount: Client,
  };

  const dataEncode = JSON.stringify(dataToSend);

  bodyFormData.append('class', 'Payments');
  bodyFormData.append('function', 'modify_txn');
  bodyFormData.append('data', dataEncode);
  let txtIdRemoved;
  await axios({
    method: 'post',
    url: URL_LOGIN,
    data: bodyFormData,
    config: {headers: {'Content-Type': 'multipart/form-data'}},
  })
    .then(response => {
      txtIdRemoved = response.data.data;
    })
    .catch(response => {});
  return txtIdRemoved;
};

export const addPnr = data => async dispatch => {
  const bodyFormData = new FormData();
  const {user} = data.login;

  const dataToSend = {
    is_charter: data.flight.full_fly_data.isCharter,
    id_account: user.id_account,
    flight_ids: data.booking.flightsId.flight_ids,
    pnr: data.booking.bookingData.response.pnr,
  };

  const dataEncode = JSON.stringify(dataToSend);

  bodyFormData.append('class', 'Flight');
  bodyFormData.append('function', 'add_pnr_book_flight');
  bodyFormData.append('data', dataEncode);
  let pnrAdded;
  await axios({
    method: 'post',
    url: URL_LOGIN,
    data: bodyFormData,
    config: {headers: {'Content-Type': 'multipart/form-data'}},
  })
    .then(response => {
      pnrAdded = response.data;
    })
    .catch(response => {});

  return pnrAdded;
};

export const modifyTxn = data => async dispatch => {
  const bodyFormData = new FormData();

  const {Client} = data.flight.full_fly_data.fare;
  const {user} = data.login;

  const dataToSend = {
    id_account: user.id_account,
    ssl_txn_id: data.booking.sslTxnId.ssl_txn_id,
    txn_type: 'cccomplete',
    amount: Client,
  };

  const dataEncode = JSON.stringify(dataToSend);

  bodyFormData.append('class', 'Payments');
  bodyFormData.append('function', 'modify_txn');
  bodyFormData.append('data', dataEncode);
  let txtIdRemoved;
  await axios({
    method: 'post',
    url: URL_LOGIN,
    data: bodyFormData,
    config: {headers: {'Content-Type': 'multipart/form-data'}},
  })
    .then(response => {
      txtIdRemoved = response.data.data;
    })
    .catch(response => {});
  return txtIdRemoved;
};

export const getPnr = data => async dispatch => {
  const {user} = data.login;
  const token = TOKEN;
  const user_name = USER_NAME;
  const user_password = USER_PASSWORD;

  const passengersAPI = data.passenger.passengerData.map(passenger => ({
    first_name: passenger.first_name,
    last_name: passenger.last_name,
    gender: passenger.gender,
    title: passenger.gender === 'M' ? 'mr' : 'mss',
    birth_date_input: moment(passenger.birth_date, 'MM-DD-YYYY').format(
      'YYYY-MM-DD',
    ),
    email: passenger.email,
    phone: passenger.phone_number,
    ofac_code: passenger.ofac_code || '',
    nationality: passenger.nationality,
    cub_mother_maiden_name: passenger.cub_mother_maiden_name,
    cub_first_name: passenger.cub_first_name,
    cub_last_name: passenger.cub_last_name,
    usa_arrival_doc: passenger.usa_arrival_doc,
    usa_country: passenger.usa_country,
    usa_doc_number: passenger.usa_doc_number,
    usa_exp_date_input: moment(passenger.usa_exp_date, 'MM-DD-YYYY').format(
      'YYYY-MM-DD',
    ),
    for_arrival_doc: passenger.for_arrival_doc,
    for_country: passenger.for_country,
    for_doc_number: passenger.for_doc_number,
    for_exp_date_input:
      passenger.for_exp_date !== ''
        ? moment(passenger.for_exp_date, 'MM-DD-YYYY').format('YYYY-MM-DD')
        : passenger.for_exp_date,
    address: passenger.address,
    city: passenger.city,
    state: passenger.state,
    country: passenger.country,
    zip: passenger.zip,
    foreign_address: passenger.foreign_address,
    foreign_city: passenger.foreign_city,
    foreign_province: passenger.foreign_province,
    foreign_zip: passenger.foreign_zip,
    emergency_phone: passenger.emergency_phone,
    emergency_name: passenger.emergency_name,
    notes: '',
    flight_type: data.flight.selected_fly.oneWayAirline ? 0 : 1,
  }));

  let returnFlightNumber = data.flight.selected_fly.oneWayAirline
    ? (returnFlightNumber = '')
    : (returnFlightNumber = data.flight.full_fly_data.bleg.flight_number);

  let ret_travel_class = data.flight.selected_fly.oneWayAirline
    ? null
    : data.flight.full_fly_data.bleg.travel_class;

  const parameters = {
    token,
    user_name,
    password: user_password,
    user_password,
    agent_code_dp: 558987,
    charter_id: data.flight.full_fly_data.aleg.charter_id,
    charter_id_orig: data.flight.full_fly_data.aleg.charter_id,
    organization_id: 3509,
    organization_id_origin: 3509,
    action: 'get',
    agent_name: 'WEB_MNL',
    departure_date: data.flight.selected_fly.startDateFinal,
    dep_travel_class: data.flight.full_fly_data.aleg.travel_class,
    ret_travel_class,
    adults: data.flight.selected_fly.adult,
    infants: data.flight.selected_fly.infant,
    childs: data.flight.selected_fly.child,
    departure_city: data.flight.full_fly_data.aleg.origin_iata_airport_code,
    destination_city: data.flight.full_fly_data.aleg.dest_iata_airport_code,
    return_to_city: data.flight.full_fly_data.aleg.origin_iata_airport_code,
    return_from_city: data.flight.full_fly_data.aleg.dest_iata_airport_code,
    flight_type: data.flight.selected_fly.oneWayAirline ? 0 : 1,
    date_from: data.flight.selected_fly.startDateFinal,
    date_to: data.flight.selected_fly.endDateFinal,
    return_date: data.flight.selected_fly.endDateFinal,
    departure_flight_number: data.flight.full_fly_data.aleg.flight_number,
    return_flight_number: returnFlightNumber,
    flight_departure: 'departure',
    flight_return: data.flight.selected_fly.oneWayAirline ? '' : 'return',
    iata_airline_code: data.flight.full_fly_data.aleg.airline_code,
    passengers: passengersAPI,
  };

  const requestBookingId = JSON.stringify(parameters);

  // const response = await middleware.http.post('http://172.10.1.56/ATC/custom_APIs/mnlConnect/public/index.php/flights/external_search_mnl', { data: requestBookingId });

  //const response = await middleware.http.post('http://172.10.1.65/AirConnect/custom_APIs/mnlConnect/public/index.php/flights/external_search_mnl', { data: requestBookingId });

  // const response = await middleware.http.post('http://dev-mnl.folderit.net/custom_APIs/mnlConnect/public/index.php/flights/external_search_mnl', { data: requestBookingId });

  dispatch({
    type: GET_BOOKING_DATA,
    payload: response.data,
  });

  return response.data;
};

export const saveCreditCardsList = creditCardList => async dispatch => {
  dispatch({
    type: LIST_CREDITCARDS,
    payload: creditCardList,
  });
};

export const book = (props, state) => async dispatch => {
  let crypt;

  if (
    !props.flight.full_fly_data.isSunrise &&
    !props.flight.full_fly_data.isCharter
  ) {
    let data = {
      token: TOKEN,
      user_name: USER_NAME,
      user_password: USER_PASSWORD,
    };

    const dataToJson = JSON.stringify(data);

    const response = await middleware.http.post(
      `${URL_ENCRYPT}get_public_key`,
      {data: dataToJson},
    );

    crypt = new JSEncrypt({default_key_size: 1024});

    crypt.setPublicKey(response.data.public_key);
  } else {
    let data = {
      id_account: props.login.id_account,
    };

    const dataToJson = JSON.stringify(data);

    crypt = new JSEncrypt({default_key_size: 4096});
    const bodyFormData = new FormData();

    bodyFormData.append('class', 'Payments');
    bodyFormData.append('function', 'get_public_key');
    bodyFormData.append('data', dataToJson);

    let publicKey;
    await axios({
      method: 'post',
      url: URL_LOGIN,
      data: bodyFormData,
      config: {headers: {'Content-Type': 'multipart/form-data'}},
    })
      .then(response => {
        publicKey = response.data.data.publicKey;
      })
      .catch(response => {
        publicKey = response.data.data;
      });

    crypt.setPublicKey(publicKey);
  }

  const passengersAPI = props.passenger.passengerData.map(passenger => ({
    first_name: passenger.first_name,
    last_name: passenger.last_name,
    gender: passenger.gender,
    title: passenger.gender === 'M' ? 'Mr.' : 'Mrs.',
    birth_date: moment(passenger.birth_date, 'MM-DD-YYYY').format('YYYY-MM-DD'),
    email: passenger.email,
    phone_number: passenger.phone_number,
    ofac_code: passenger.ofac_code || '',
    nationality: passenger.nationality,
    cub_mother_maiden_name: passenger.cub_mother_maiden_name,
    cub_first_name: passenger.cub_first_name,
    cub_last_name: passenger.cub_last_name,
    usa_arrival_doc: passenger.usa_arrival_doc,
    usa_country: passenger.usa_country,
    usa_doc_number: passenger.usa_doc_number,
    usa_exp_date: moment(passenger.usa_exp_date, 'MM-DD-YYYY').format(
      'YYYY-MM-DD',
    ),
    for_arrival_doc: passenger.for_arrival_doc,
    for_country: passenger.for_country,
    for_doc_number: passenger.for_doc_number,
    for_exp_date:
      passenger.for_exp_date !== ''
        ? moment(passenger.for_exp_date, 'MM-DD-YYYY').format('YYYY-MM-DD')
        : passenger.for_exp_date,
    address: passenger.address,
    city: passenger.city,
    state: passenger.state,
    country: passenger.country,
    zip: passenger.zip,
    foreign_address: passenger.foreign_address,
    foreign_city: passenger.foreign_city,
    foreign_province: passenger.foreign_province,
    foreign_zip: passenger.foreign_zip,
    emergency_phone: passenger.emergency_phone,
    emergency_name: passenger.emergency_name,
    notes: '',
    flight_type: props.flight.selected_fly.oneWayAirline ? 0 : 1,
  }));

  const parameters = {
    id_account: props.login.id_account,
    passengers: passengersAPI,
    flight_id: props.flight.full_fly_data.flight_id,
    fop: {
      last_four: state.creditCardSelected.cc_number,
      cc_type: state.creditCardSelected.cc_type,
      cc_name: state.creditCardSelected.cc_name,
      cvv: crypt.encrypt(state.CVV),
    },
  };

  let globalResponse;

  await axios({
    method: 'post',
    url: `${URL_BASE_DEV}${
      I18n.currentLanguage() === 'es' ? 'es' : 'en'
    }/${URL_PAY_FLIGHT}`,
    data: parameters,
    config: {
      'Zivoya-Device': Platform.OS,
      'Zivoya-Version': pkg.version,
    },
  })
    .then(responseToBooking => {
      if (
        responseToBooking.data.status == 200 &&
        (responseToBooking.data.code == 0 ||
          responseToBooking.data.code == 60000 ||
          responseToBooking.data.code == 88403)
      ) {
        dispatch({
          type: GET_BOOKING_DATA,
          payload: responseToBooking.data,
        });
      }
      globalResponse = responseToBooking;
    })
    .catch(response => {
      console.log(response);
      globalResponse = responseToBooking;
    });

  return globalResponse;
};
