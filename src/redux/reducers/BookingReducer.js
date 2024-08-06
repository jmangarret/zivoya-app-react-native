import { GET_FlIGHTS_ID, GET_SSL_TXN_ID, GET_BOOKING_DATA, LIST_CREDITCARDS, SAVE_CC_DATA } from '../actions/types';

const INITIAL_STATE = {
  flightsId: {},
  creditCardList: [],
  cc_data: {}
};

export default (state = INITIAL_STATE, action) => {
  
  switch (action.type) {
    case GET_FlIGHTS_ID:
      return {
        ...state,
        flightsId: action.payload
      };
    case GET_SSL_TXN_ID:
      return {
        ...state,
        sslTxnId: action.payload
      }
    case GET_BOOKING_DATA:
      return { 
        ...state,
        bookingData: action.payload
      }
      case LIST_CREDITCARDS:
        return { 
          ...state,
          creditCardList: action.payload
        }
      case SAVE_CC_DATA: 
        return {
          ...state,
          cc_data: action.payload
        }
    default:
      return state;
  }
};