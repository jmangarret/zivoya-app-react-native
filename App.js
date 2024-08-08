import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { applyMiddleware, createStore } from 'redux';
import { thunk } from 'redux-thunk';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import FlightSearch from './src/components/FlightSearch';

const Stack = createNativeStackNavigator();
export default class App extends Component {
  store = createStore(applyMiddleware(thunk));

  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={FlightSearch}  options={{ title: 'Zivoya' }}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}