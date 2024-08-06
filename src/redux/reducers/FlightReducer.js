import {
  GET_FLY,
  SELECTED_FLY,
  CALCULATE_PRICES,
  FULL_FLIGHT_SELECTED,
  SAVE_PRICE_INFO,
  SET_FILTERS,
  GET_USER_FLIGHTS,
} from '../actions/types';

const INITIAL_STATE = {
  fly_data: [],
  flights_amount: 0,
  higher_price: 0,
  lower_price: 0,
  carriers: [],
  selected_fly: {},
  flight_price_data: {},
  full_fly_data: {},
  price_info: {},
  filters: {
    departure_time: 'all',
    return_time: 'all',
    stops: 'anyStops',
    carrier: 'all',
  },
  appliedFilters: 0,
  user_flights: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_USER_FLIGHTS:
      return {
        ...state,
        user_flights: action.payload.flights,
      };
    case GET_FLY:
      return {
        ...state,
        fly_data: action.payload.flights,
        flights_amount: action.payload.flights_amount,
        higher_price: action.payload.higher_price,
        lower_price: action.payload.lower_price,
        carriers: action.payload.carriers,
      };
    case SELECTED_FLY:
      return {
        ...state,
        selected_fly: action.payload,
      };
    case CALCULATE_PRICES:
      return {
        ...state,
        flight_price_data: action.payload,
      };
    case FULL_FLIGHT_SELECTED:
      return {
        ...state,
        full_fly_data: action.payload,
      };
    case SAVE_PRICE_INFO:
      return {
        ...state,
        price_info: action.payload,
      };
    case SET_FILTERS:
      let counter = 0;

      counter += action.payload.departureTimeFilter == 'all' ? 0 : 1;
      counter += action.payload.returnTimeFilter == 'all' ? 0 : 1;
      counter += action.payload.stopsFilter == 'anyStops' ? 0 : 1;
      counter += action.payload.carrierFilter == 'all' ? 0 : 1;

      return {
        ...state,
        filters: {
          departure_time: action.payload.departureTimeFilter,
          return_time: action.payload.returnTimeFilter,
          stops: action.payload.stopsFilter,
          carrier: action.payload.carrierFilter,
        },
        appliedFilters: counter,
      };
    default:
      return state;
  }
};
