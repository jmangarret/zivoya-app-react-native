import {URL_EMAIL_SENDER, URL_BASE_DEV, URL_PDF_DOWNLOAD_NEW} from '../config';
import axios from 'axios';
import {Service} from 'axios-middleware';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';
import {PermissionsAndroid, Platform} from 'react-native';
import middleware from './middleware';
import I18n from '../utils/i18n';

export const sendEmail = async data => {
  const arrayPassenger = data.passenger.passengerData;

  const passengers = arrayPassenger.map(passenger => ({
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
  }));
  const emails = [];
  const criteriaData = {
    date_from: data.flight.selected_fly.startDateFinal,
    date_to: data.flight.selected_fly.endDateFinal,
    flight_type: data.flight.selected_fly.oneWayAirline ? 1 : 2,
    adults: data.flight.selected_fly.adult,
    infants: data.flight.selected_fly.infant,
    childs: data.flight.selected_fly.child,
    dep_code: data.flight.selected_fly.fromSave,
    dep_city_name: data.flight.selected_fly.airportOrigin,
    dep_city: data.flight.full_fly_data.aleg.origin_airport.city,
    des_code: data.flight.selected_fly.toSave,
    des_city_name: data.flight.selected_fly.airportDestiny,
    des_city: data.flight.full_fly_data.aleg.destination_airport.city,
  };

  const cc_used = {
    cc_type: data.booking.cc_data.cc_type,
    last_four: data.booking.cc_data.cc_number,
  };
  emails.push(data.passenger.passengerData[0].email);
  let object = {
    amount: data.flight.price_info.totalBase,
    tax: data.flight.price_info.totalTax,
    total: data.flight.price_info.total,
    cc_used,
    emails,
    departureFlight: data.flight.full_fly_data.aleg,
    returnFlight: data.flight.selected_fly.oneWayAirline
      ? null
      : data.flight.full_fly_data.bleg,
    criteriaData,
    passengers,
    booking_ids: data.booking.bookingData.response.booking_ids,
    pnr: data.booking.bookingData.response.pnr,
  };
  object.returnFlight.charter_logo = '';
  object.departureFlight.charter_logo = '';

  let dataJson = JSON.stringify(object);

  dataJson = dataJson.replace(/á/g, 'a');
  dataJson = dataJson.replace(/é/g, 'e');
  dataJson = dataJson.replace(/í/g, 'i');
  dataJson = dataJson.replace(/ó/g, 'o');
  dataJson = dataJson.replace(/ú/g, 'u');

  object = JSON.parse(dataJson);

  const response = await middleware.http.post(
    `${URL_BASE_DEV}${
      I18n.currentLanguage() == 'es' ? 'es' : 'en'
    }/${URL_EMAIL_SENDER}`,

    {data: object},
    {timeout: 20000},
  );
  return response;
};

export const downloadPdf = async data => {
  console.log(data);
  const arrayPassenger = data.passenger.passengerData;

  const passengers = arrayPassenger.map(passenger => ({
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
  }));

  const criteriaData = {
    date_from: data.flight.selected_fly.startDateFinal,
    date_to: data.flight.selected_fly.endDateFinal,
    flight_type: data.flight.selected_fly.oneWayAirline ? 1 : 2,
    adults: data.flight.selected_fly.adult,
    infants: data.flight.selected_fly.infant,
    childs: data.flight.selected_fly.child,
    dep_code: data.flight.selected_fly.fromSave,
    dep_city_name: data.flight.selected_fly.airportOrigin,
    dep_city: data.flight.full_fly_data.aleg.origin_airport.city,
    des_code: data.flight.selected_fly.toSave,
    des_city_name: data.flight.selected_fly.airportDestiny,
    des_city: data.flight.full_fly_data.aleg.destination_airport.city,
  };

  const object = {
    departureFlight: data.flight.full_fly_data.aleg,
    returnFlight: data.flight.selected_fly.oneWayAirline
      ? null
      : data.flight.full_fly_data.bleg,
    criteriaData,
    passengers,
    booking_ids: data.booking.bookingData.booking_ids,
    pnr: data.booking.bookingData.pnr,
  };
  object.returnFlight.charter_logo = '';
  object.departureFlight.charter_logo = '';

  let dataJson = JSON.stringify(object);

  dataJson = dataJson.replace(/á/g, 'a');
  dataJson = dataJson.replace(/é/g, 'e');
  dataJson = dataJson.replace(/í/g, 'i');
  dataJson = dataJson.replace(/ó/g, 'o');
  dataJson = dataJson.replace(/ú/g, 'u');

  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Zivoya App storage Permission',
          message: 'Zivoya App needs access to your storage ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      } else {
      }
    } catch (err) {
      return 'error';
    }

    let lang;
    if (moment.locale() == 'es-us' || moment.locale() == 'es') {
      lang = 'es';
    } else {
      lang = 'en';
    }

    try {
      RNFetchBlob.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          mediaScannable: true,
          title: 'itinerary.pdf',
          path: RNFetchBlob.fs.dirs.DownloadDir + '/' + 'itinerary.pdf',
        },
      })
        .fetch(
          'POST',
          `${URL_BASE_DEV}${
            I18n.currentLanguage() == 'es' ? 'es' : 'en'
          }/${URL_PDF_DOWNLOAD_NEW}`,
          // 'http://172.10.1.57/mnl/5/mnl_online/web/app_dev.php/en/zivoya-pdf-download',

          {
            body: dataJson,
            // 'Content-Type': 'multipart/form-data',
          },
        )
        .then(res => {
          console.log('----');
          console.log(res);
          console.log('----');
          // the temp file path
          data.setNotification('downloadEnd').then();
          return res;
        })
        .catch(res => console.log(res));
    } catch (e) {
      console.log('----');
      console.log(e);
      console.log('----');

      return e;
    }
  } else {
    const path = `${RNFetchBlob.fs.dirs.DownloadDir}`;
    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'pdf',
    })
      .fetch(
        'POST',

        `${URL_BASE_DEV}${
          I18n.currentLanguage() == 'es' ? 'es' : 'en'
        }/${URL_PDF_DOWNLOAD_NEW}`,

        {
          body: dataJson,
          // 'Content-Type': 'multipart/form-data',
        },
      )
      .then(res => {
        RNFetchBlob.ios.openDocument(res.data);
      });
  }
};
