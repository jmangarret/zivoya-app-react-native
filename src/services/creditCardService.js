/* eslint-disable camelcase */
import {
  URL_LOCAL,
  URL_LOGIN,
  DATA_FLY,
  TOKEN,
  USER_NAME,
  USER_PASSWORD,
  URL_LIST_CREDIT_CARD,
  URL_ADD_CREDIT_CARD,
  URL_REMOVE_CREDIT_CARD,
  URL_EDIT_CREDIT_CARD,
  URL_BASE_DEV
} from "@env";
import axios from "axios";
import "../components/encrypt/jsencrypt.min.js";
import I18n from "../utils/i18n";
import pkg from "../../package.json";
import { Platform } from "react-native";
import { getPublicKey } from "./publicKeyService";

export const saveCreditCard = async data => {
  const crypt = new JSEncrypt({ default_key_size: 4096 });

  const key = await getPublicKey(data.id_account);

  if (key !== null) {
    crypt.setPublicKey(key);
  } else {
    return null;
  }

  const aux = data.cCNumber;
  const ccNumnber = aux.replace(/\s/g, "");
  const cCMonth = data.date.substring(0, 2);
  const cCYear = data.date.substring(3, 5);

  const creditCardData = {
    id_account: data.id_account,
    cc_number: crypt.encrypt(ccNumnber),
    cc_name: crypt.encrypt(data.cCName),
    cc_month: crypt.encrypt(cCMonth),
    cc_year: crypt.encrypt(cCYear),
    cc_cvv: crypt.encrypt(data.CVV),
    cc_address: data.cCAddress,
    cc_city: data.cCCity,
    cc_zip: data.cCZip,
    cc_country: data.cCCountry,
    cc_state: data.cCState
  };

  let responseAddingCard;

  await axios({
    method: "post",
    url: `${URL_BASE_DEV}${
      I18n.currentLanguage() == "es" ? "es" : "en"
    }/${URL_ADD_CREDIT_CARD}`,
    data: creditCardData,
    headers: {
      "Zivoya-Device": Platform.OS,
      "Zivoya-Version": pkg.version
    }
  })
    .then(response => {
      responseAddingCard = response;
    })
    .catch(response => {
      responseAddingCard = response;
    });
  return responseAddingCard;
};

export const listCreditCards = async id_account => {
  const data_account = {
    id_account
  };

  let creditCardList;

  await axios({
    method: "post",
    url: `${URL_BASE_DEV}${       I18n.currentLanguage() == "es" ? "es" : "en"     }/${URL_LIST_CREDIT_CARD}`,
    data: data_account,
    headers: {
      "Zivoya-Device": Platform.OS,
      "Zivoya-Version": pkg.version
    }
  })
    .then(response => {
      creditCardList = response.data;
    })
    .catch(response => {
      creditCardList = response.data;
    });

  return creditCardList;
};

export const removeCreditCard = (
  creditCardData,
  id_account
) => async dispatch => {
  const data = {
    id_account,
    cc_name: creditCardData.cc_name,
    cc_number: creditCardData.cc_number
  };

  let creditCardRemove;
  await axios({
    method: "post",
    url: `${URL_BASE_DEV}${
      I18n.currentLanguage() == "es" ? "es" : "en"
    }/${URL_REMOVE_CREDIT_CARD}`,
    data: data,
    headers: {
      "Zivoya-Device": Platform.OS,
      "Zivoya-Version": pkg.version
    }
  })
    .then(response => {
      console.log(response);
      creditCardRemove = response.data;
    })
    .catch(response => {
      creditCardRemove = response.data;
    });

  return creditCardRemove;
};

export const editCreditCard = (
  ccv_edit,
  cc_date,
  creditCardData,
  id_account
) => async dispatch => {
  // Encript

  const crypt = new JSEncrypt({ default_key_size: 4096 });

  const key = await getPublicKey(id_account);

  if (key !== null) {
    crypt.setPublicKey(key);
  } else {
    return null;
  }

  // End encript
  const cCMonth = cc_date.substring(0, 2);
  const cCYear = cc_date.substring(3, 5);

  const data = {
    id_account,
    cc_number: creditCardData.cc_number,
    cc_name: creditCardData.cc_name,
    cc_cvv: crypt.encrypt(ccv_edit),
    cc_month: crypt.encrypt(cCMonth),
    cc_year: crypt.encrypt(cCYear)
  };

  let creditCardEdited;
  await axios({
    method: "post",
    url: `${URL_BASE_DEV}${
      I18n.currentLanguage() == "es" ? "es" : "en"
    }/${URL_EDIT_CREDIT_CARD}`,
    data: data,
    headers: {
      "Zivoya-Device": Platform.OS,
      "Zivoya-Version": pkg.version
    }
  })
    .then(response => {
      console.log(response);
      creditCardEdited = response.data;
    })
    .catch(response => {
      creditCardEdited = response.data;
    });
  return creditCardEdited;
};
