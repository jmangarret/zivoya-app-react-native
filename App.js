import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { applyMiddleware, createStore } from 'redux';
import { thunk } from 'redux-thunk';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import FlightSearch from './src/components/FlightSearch';
import Header from './src/components/commons/Header';

const Stack = createStackNavigator();
export default class App extends Component {
  store = createStore(applyMiddleware(thunk));

  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={FlightSearch}  
             options={({ route }) => ({
              headerTitle: (props) => <Header route={route} {...props} />,
            })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}