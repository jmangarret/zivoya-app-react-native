import {
  LOGIN_USER,
  GET_ID_ACCOUNT,
  SET_EMAIL,
  SET_CODE,
  CLOSE_SESSION,
} from '../actions/types';

const INITIAL_STATE = {
  user: {
    password: '',
    code: '',
    first_name: '',
    last_name: '',
    phone: '',
    first_setup_pwd: false,
  },
  id_account: '',
  email: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        user: {
          password: action.payload.password || state.user.password,
          code: action.payload.code,
          first_name: action.payload.first_name || state.user.first_name,
          last_name: action.payload.last_name || state.user.last_name,
          phone: action.payload.phone || state.user.phone,
          first_setup_pwd: !!action.payload.first_setup_pwd,
        },
        email: action.payload.email || state.email,
        id_account: action.payload.id_account || state.id_account,
      };
    case CLOSE_SESSION:
      return {
        ...state,
        user: {
          password: '',
          code: '',
          first_name: '',
          last_name: '',
          phone: '',
          first_setup_pwd: false,
        },
        email: '',
        id_account: '',
      };
    case GET_ID_ACCOUNT:
      return {
        ...state,
        id_account: action.payload,
      };
    case SET_EMAIL:
      return {
        ...state,
        email: action.payload,
      };
    case SET_CODE:
      return {
        ...state,
        user: {
          ...state.user,
          code: action.payload,
        },
      };
    default:
      return state;
  }
};
