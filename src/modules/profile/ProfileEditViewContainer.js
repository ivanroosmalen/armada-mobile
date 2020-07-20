// @flow
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import ProfileEditView from './ProfileEditView';
import { get, update } from '../../redux/users/actions.js'
import { list } from '../../redux/martialArts/actions.js'

export default compose(
  connect(
    state => {
    return ({
      loggedInUser: state.users.loggedInUser,
      user: state.users.user,
      martialArts: state.martialArts.martialArts
    })},
    dispatch => ({
      getUser: (id) => dispatch(get(id)),
      getMartialArts: () => dispatch(list()),
      updateUser: (id, entity) => dispatch(update(id, entity))
    }),
  ))(ProfileEditView);
