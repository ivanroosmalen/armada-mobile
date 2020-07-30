// @flow
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import AcademyView from './AcademyView';
import { get, updateProfileImage } from '../../redux/academies/actions.js'

export default compose(
  connect(
    state => {
    return ({
      loggedInUser: state.users.loggedInUser,
      academy: state.academies.academy
    })},
    dispatch => ({
      getAcademy: (id) => dispatch(get(id)),
      updateProfileImage: (id, data) => dispatch(updateProfileImage(id, data))
    }),
  ))(AcademyView);
