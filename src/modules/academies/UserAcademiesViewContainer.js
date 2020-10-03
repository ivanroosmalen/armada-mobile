// @flow
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import UserAcademiesView from './UserAcademiesView';
import { getUserAcademies } from '../../redux/academies/actions.js'

export default compose(
  connect(
    state => {
    return ({
      loggedInUser: state.users.loggedInUser,
      userAcademies: state.academies.userAcademies,
      academyListUpdate: state.academies.academyListUpdate
    })},
    dispatch => ({
      getUserAcademies: (id, params) => dispatch(getUserAcademies(id, params))
    }),
  ))(UserAcademiesView);
