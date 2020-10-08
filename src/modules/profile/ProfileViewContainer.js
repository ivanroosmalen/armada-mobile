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
      getUser: (id, options, fromCache) => dispatch(get(id, options, fromCache)),
      updateProfileImage: (id, data) => dispatch(updateProfileImage(id, data))
    }),
  ))(ProfileView);
