import {
  SAVE_PASSENGER,
  GET_PASSENGERS,
  GUEST_USER,
  SEARCH_BY_PNR,
} from '../actions/types';

const INITIAL_STATE = {
  passengerData: [],
  passengerList: [],
  reservations: [],
  guestFlag: false,
};

export default (state = INITIAL_STATE, action) => {
  console.log(action.type);
  switch (action.type) {
    case SAVE_PASSENGER:
      return {
        ...state,
        passengerData: action.payload,
      };
    case GET_PASSENGERS:
      return {
        ...state,
        passengerList: action.payload,
      };
    case GUEST_USER:
      return {
        ...state,
        guestFlag: action.payload,
      };
    case SEARCH_BY_PNR:
      return {
        ...state,
        reservations: action.payload,
      };
    default:
      return state;
  }
};
