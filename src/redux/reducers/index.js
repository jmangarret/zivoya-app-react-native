import { combineReducers } from 'redux';
import FlightReducer from './FlightReducer';
import LoginReducer from './LoginReducer';
import PassengerReducer from './PassengerReducer';
import BookingReducer from './BookingReducer';
import RegisterReducer from './RegisterReducer';
import SettingReducer from './SettingReducer';
import NotificationReducer from './NotificationReducer'

export default combineReducers({
  flight: FlightReducer,
  login: LoginReducer,
  passenger: PassengerReducer,
  booking: BookingReducer,
  register: RegisterReducer,
  settings: SettingReducer,
  notification: NotificationReducer
});
