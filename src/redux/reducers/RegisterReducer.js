import { REGISTER_USER, VALIDATE_USER } from '../actions/types';

const INITIAL_STATE = {
  id_account: '',
  email: '',
  actived: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REGISTER_USER:
      return {
        ...state,
        id_account: action.payload.id_account,
        email: action.payload.email
      };
    case VALIDATE_USER:
      return {
        ...state,
        actived: action.payload
      };    
    default:
      return state;
  }
};