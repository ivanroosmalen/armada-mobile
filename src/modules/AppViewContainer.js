import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { Platform, UIManager, StatusBar } from 'react-native';
import { setLoggedInUser, setJwt, get } from '../redux/users/actions';
import { getUserAcademies } from '../redux/academies/actions.js';
import { list } from '../redux/academyRequests/actions.js';
import AppView from './AppView';
import AsyncStorage from '@react-native-community/async-storage';
import { store } from '../redux/store.js';

export default compose(
  lifecycle({
    async componentDidMount() {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        // eslint-disable-next-line no-unused-expressions
        UIManager.setLayoutAnimationEnabledExperimental &&
          UIManager.setLayoutAnimationEnabledExperimental(true);
      }

      let promises = await Promise.all([
        AsyncStorage.getItem('loggedInUser'),
        AsyncStorage.getItem('jwt')
      ])
      let loggedInUserString = promises[0];
      let jwt= promises[1];
      if(loggedInUserString && jwt) {
          let user = JSON.parse(loggedInUserString);
          user = await store.dispatch(get(user._id));
          store.dispatch(setJwt(jwt));
          store.dispatch(setLoggedInUser(user));
          store.dispatch(list({ complete: false }));
          store.dispatch(getUserAcademies(user._id));
      }
    },
    async componentDidUpdate(prevProps, prevState) {
      if(prevProps.loggedInUser !== this.props.loggedInUser && this.props.loggedInUser) {
        store.dispatch(list({ complete: false }));
        store.dispatch(getUserAcademies(prevProps.loggedInUser._id));
      }
    },
  }),
)(AppView);
