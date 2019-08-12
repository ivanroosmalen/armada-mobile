/**
 * @format
 */

//import {AppRegistry} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { registerScreens } from './src/screens.js';
//import App from './App';
//import {name as appName} from './app.json';

registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: 'Initializing'
      }
    }
  });
});

//AppRegistry.registerComponent(appName, () => App);

