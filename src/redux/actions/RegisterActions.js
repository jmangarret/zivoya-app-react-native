import axios from "axios";

import {
  URL_BASE_DEV,
  URL_REGISTER,
  URL_VALIDATE_CODE,
  URL_RESEND_CODE,
  URL_EDIT_DATA_ACCOUNT,
  URL_CHANGE_PASSWORD,
  URL_SOCIAL_SIGN_UP,
  URL_RESET_CODE,
  URL_RESET_CHECKCODE,
  URL_FORGOT_PASSWORD
} from "@env";

import {
  REGISTER_USER,
  VALIDATE_USER,
  EDIT_DATA_ACCOUNT,
  CHANGE_PASSWORD
} from "./types";

import I18n from "../../utils/i18n";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { setUserData, setEmail, login } from "./LoginActions";

import { Platform } from "react-native";

import pkg from "../../../package.json";

/**
 * Registrar nuevo usuario
 * @param {*} object
 */
export const registerUser = object => async dispatch => {
  const dataObject = {
    first_name: object.nameInput.value,
    last_name: object.lastNameInput.value,
    email: object.emailInput.value,
    phone: object.phoneInput.value,
    password: object.passwordInput.value,
    lang: object.lang
  };

  let globalResponse = null;

  await axios({
    method: "post",
    url: `${URL_BASE_DEV}${
      I18n.currentLanguage() === "es" ? "es" : "en"
    }/${URL_REGISTER}`,
    data: dataObject,
    headers: {
      "Zivoya-Device": Platform.OS,
      "Zivoya-Version": pkg.version
    }
  })
    .then(({ data }) => {
      if (data.status === 200 && data.code === 0) {
        dispatch({
          type: REGISTER_USER,
          payload: {
            id_account: data.id_account,
            email: dataObject.email
          }
        });
      }

      globalResponse = data;
    })
    .catch(response => {
      globalResponse = response;
    });

  return globalResponse;
};

/**
 * Validar usuario mediante codigo de activacion
 * @param {*} object
 */
export const validateUser = object => async dispatch => {
  const bodyFormData = new FormData();

  const dataObject = {
    email: object.email,
    id_account: object.id_account,
    code: object.code
  };

  Object.keys(dataObject).forEach(k => {
    bodyFormData.append(k, dataObject[k]);
  });

  let globalResponse = null;

  await axios({
    method: "post",
    url: `${URL_BASE_DEV}${
      I18n.currentLanguage() === "es" ? "es" : "en"
    }/${URL_VALIDATE_CODE}`,
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" }
  })
    .then(data => {
      if (data.status == 200) {
        dispatch({
          type: VALIDATE_USER,
          payload: true
        });
      }

      globalResponse = data.data;
    })
    .catch(response => {
      globalResponse = response;
    });

  return globalResponse;
};

/**
 * Volver a enviar codigo de activacion a correo electronico
 * @param {*} object
 */
export const reSendCode = object => async dispatch => {
  const bodyFormData = new FormData();

  const dataObject = {
    email: object
  };

  Object.keys(dataObject).forEach(k => {
    bodyFormData.append(k, dataObject[k]);
  });

  let globalResponse = null;

  await axios({
    method: "post",
    url: `${URL_BASE_DEV}${
      I18n.currentLanguage() == "es" ? "es" : "en"
    }/${URL_RESEND_CODE}`,
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" }
  })
    .then(data => {
      globalResponse = data.data;
    })
    .catch(response => {
      globalResponse = response;
    });

  return globalResponse;
};

/**
 * Editar datos de un usuario
 * @param {*} object
 */
export const editDataAccount = object => async dispatch => {
  const bodyFormData = new FormData();

  const dataObject = {
    id_account: object.id_account,
    email: object.email || "",
    phone: object.phone || "",
    first_name: object.first_name || "",
    last_name: object.last_name || "",
    lang: object.lang || ""
  };

  let objNewData = {};

  Object.keys(dataObject).forEach(k => {
    bodyFormData.append(k, dataObject[k]);

    if (dataObject[k] != "") {
      objNewData[k] = dataObject[k];
    }
  });

  let globalResponse = null;

  await axios({
    method: "post",
    url: `${URL_BASE_DEV}${
      I18n.currentLanguage() == "es" ? "es" : "en"
    }/${URL_EDIT_DATA_ACCOUNT}`,
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" }
  })
    .then(data => {
      globalResponse = data.data;

      globalResponse.data = objNewData;
    })
    .catch(response => {
      globalResponse = response;
    });

  Object.keys(objNewData).forEach(async k => {
    await AsyncStorage.setItem(k, objNewData[k]);
  });

  return globalResponse;
};

/**
 * Cambiar contraseña de usuario
 * @param {*} object
 */
export const changePassword = object => async dispatch => {
  const bodyFormData = new FormData();

  const dataObject = {
    id_account: object.id_account,
    email: object.email || null,
    old_password: object.old_password || null,
    new_password: object.new_password || null
  };

  Object.keys(dataObject).forEach(k => {
    bodyFormData.append(k, dataObject[k]);
  });

  let globalResponse = null;

  await axios({
    method: "post",
    url: `${URL_BASE_DEV}${
      I18n.currentLanguage() == "es" ? "es" : "en"
    }/${URL_CHANGE_PASSWORD}`,
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" }
  })
    .then(data => {
      globalResponse = data.data;
    })
    .catch(response => {
      globalResponse = response;
    });

  return globalResponse;
};

export const signupSocials = (
  name,
  lastName,
  email,
  password,
  token,
  id_social
) => async dispatch => {
  const dataObject = {
    first_name: name,
    last_name: lastName,
    email: email,
    phone: "",
    password: password,
    lang: I18n.currentLanguage() === "es" ? "es" : "en",
    token,
    id_social
  };

  let globalResponse = null;

  await axios({
    method: "post",
    url: `${URL_BASE_DEV}${
      I18n.currentLanguage() == "es" ? "es" : "en"
    }/${URL_SOCIAL_SIGN_UP}`,
    data: dataObject,
    headers: {
      "Zivoya-Device": Platform.OS,
      "Zivoya-Version": pkg.version
    }
  }).then(({ data }) => {
      if (data.status === 200 && (data.code === 0 || data.code === 22019)) {
        dispatch({
          type: REGISTER_USER,
          payload: {
            id_account: data.id_account,
            email: dataObject.email
          }
        });

        dispatch(setEmail(dataObject.email));

        dispatch(setUserData(data));
      }
      globalResponse = data;
    })
    .catch(response => {
      globalResponse = response;
    });

  return globalResponse;
};

export const recoverPassword = email => async dispatch => {
  const bodyFormData = new FormData();

  const dataObject = {
    email: email
  };

  Object.keys(dataObject).forEach(k => {
    bodyFormData.append(k, dataObject[k]);
  });

  let globalResponse = null;

  await axios({
    method: "post",
    url: `${URL_BASE_DEV}${
      I18n.currentLanguage() == "es" ? "es" : "en"
    }/${URL_FORGOT_PASSWORD}`,

    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" }
  })
    .then(({ data }) => {
      console.log(data);
      globalResponse = data;
    })
    .catch(response => {
      globalResponse = response;
    });

  return globalResponse;
};

export const resetCheckCode = (code, email) => async dispatch => {
  const bodyFormData = new FormData();

  const dataObject = {
    code: code,
    email: email
  };

  Object.keys(dataObject).forEach(k => {
    bodyFormData.append(k, dataObject[k]);
  });

  let globalResponse = null;

  await axios({
    method: "post",
    url: `${URL_BASE_DEV}${
      I18n.currentLanguage() === "es" ? "es" : "en"
    }/${URL_RESET_CHECKCODE}`,

    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" }
  })
    .then(({ data }) => {
      console.log(data);
      globalResponse = data;
    })
    .catch(response => {
      globalResponse = response;
    });

  return globalResponse;
};

export const resetPassword = (
  password,
  id_account,
  code,
  email
) => async dispatch => {
  const bodyFormData = new FormData();

  const dataObject = {
    id_account: id_account,
    email: email,
    new_password: password,
    code: code
  };

  Object.keys(dataObject).forEach(k => {
    bodyFormData.append(k, dataObject[k]);
  });

  let globalResponse = null;

  await axios({
    method: "post",
    url: `${URL_BASE_DEV}${
      I18n.currentLanguage() == "es" ? "es" : "en"
    }/${URL_RESET_CODE}`,

    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" }
  })
    .then(({ data }) => {
      console.log(data);
      globalResponse = data;
    })
    .catch(response => {
      globalResponse = response;
    });

  return globalResponse;
};
