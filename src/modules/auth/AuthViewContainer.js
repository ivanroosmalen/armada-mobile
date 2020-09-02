// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import { register, login } from '../../redux/users/actions';

import AuthView from './AuthView';

export default compose(
  connect(
    state => {
    return ({
    })},
    dispatch => ({
      register: (entity) => dispatch(register(entity)),
      login: (entity) => dispatch(login(entity))
    }),
  ))(AuthView);

