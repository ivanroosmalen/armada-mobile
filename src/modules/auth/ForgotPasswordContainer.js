// @flow
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import ForgotPasswordView from './ForgotPasswordView';
import { forgotPassword } from '../../redux/users/actions.js'

export default compose(
  connect(
    state => {
    return ({
    })},
    dispatch => ({
      forgotPassword: (id, entity) => dispatch(forgotPassword(id, entity))
    }),
  ))(ForgotPasswordView);
