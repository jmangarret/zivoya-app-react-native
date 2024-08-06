import { SET_NOTIFICATION, REMOVE_NOTIFICATION} from './types';


export const setNotification = message => async (dispatch) => {
  dispatch({
    type: SET_NOTIFICATION,
    payload: message
  });
};

export const removeNotification = message => async (dispatch) => {
    dispatch({
      type: REMOVE_NOTIFICATION,
      payload: message
    });
  };
  