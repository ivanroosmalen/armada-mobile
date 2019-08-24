import React, { Component } from 'react';
import { Provider } from 'react-redux';

import store from './src/state/store'; //Import the store
import SignUp from './src/screens/users/sign-up' //Import the component file
import { View, Text, Button } from "react-native";
import { createAppContainer } from "react-navigation";
import AppNavigator from "./src/navigation"

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return (
                <Provider store={store}>
                    <AppContainer />
                </Provider>
            );
  }
}


