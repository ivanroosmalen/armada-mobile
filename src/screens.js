import { Navigation } from 'react-native-navigation';
import {Provider} from 'react-redux';
import {store} from './state/store';

import Home from './screens/home';
import Login from './screens/users/login';
import SignUp from './screens/users/sign-up';
import Initializing from './screens/initializing';

export function registerScreens() {
  Navigation.registerComponent('Home', () => (props) => (
                                               <Provider store={reduxStore}>
                                                 <Home {...props} />
                                               </Provider> ));
  Navigation.registerComponent('Login', () => (props) => (
                                                   <Provider store={reduxStore}>
                                                     <Login {...props} />
                                                   </Provider> ));
  Navigation.registerComponent('SignUp', () => (props) => (
                                                   <Provider store={reduxStore}>
                                                     <SignUp {...props} />
                                                   </Provider> ));
  Navigation.registerComponent('Initializing', () => (props) => (
                                                   <Provider store={reduxStore}>
                                                     <Initializing {...props} />
                                                   </Provider> ));
}