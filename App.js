import React, { Component } from 'react';
import FlightSearch from './src/components/FlightSearch';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { applyMiddleware, createStore, legacy_createStore } from 'redux';
import {thunk} from 'redux-thunk';

export default class App extends Component {
  store = createStore(applyMiddleware(thunk));

  render() {
    return (
      <Provider store={store}>
        <FlightSearch />
      </Provider>
    );
  }
}
