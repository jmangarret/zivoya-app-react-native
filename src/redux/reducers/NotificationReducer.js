import { SET_NOTIFICATION, REMOVE_NOTIFICATION } from '../actions/types';

const INITIAL_STATE = {
  message: '',
  show: false
};

export default (state = INITIAL_STATE, action) => {

  switch (action.type) {
    case SET_NOTIFICATION:
      return {
        message: action.payload,
        show: true
      };
    case REMOVE_NOTIFICATION:
      console.log("REMOVE_NOTIFICATION")
      return {
        show: false,
        message: '',
      };
    default:
      return state;
  }
};
