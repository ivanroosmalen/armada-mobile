// @flow
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import UpdatePasswordView from './UpdatePasswordView';
import { updatePassword } from '../../redux/users/actions.js'

export default compose(
  connect(
    state => {
    return ({
      loggedInUser: state.users.loggedInUser,
    })},
    dispatch => ({
      updatePassword: (id, entity) => dispatch(updatePassword(id, entity))
    }),
  ))(UpdatePasswordView);
