// @flow
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import ProfileView from './ProfileView';
import { get, updateProfileImage } from '../../redux/users/actions.js'

export default compose(
  connect(
    state => {
    return ({
      loggedInUser: state.users.loggedInUser,
      user: state.users.user
    })},
    dispatch => ({
      getUser: (id) => dispatch(get(id)),
      updateUser: (id, entity) => dispatch(update(id, entity)),
      updateProfileImage: (id, data) => dispatch(updateProfileImage(id, data))
    }),
  ))(ProfileView);
