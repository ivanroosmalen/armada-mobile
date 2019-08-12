import React, { Component } from 'react';
import Initializing from './src/screens/home';
import {Provider} from 'react-redux';
import {store} from './src/state/store';

// Render the app container component with the provider around it
export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Initializing />
      </Provider>
    );
  }
}

