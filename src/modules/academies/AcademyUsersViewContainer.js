// @flow
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import AcademyUsersView from './AcademyUsersView';
import { get as getAcademy } from '../../redux/academies/actions.js';
import { registerByAcademy } from '../../redux/users/actions.js';
import { list as getAcademyMembers, update as updateAcademyMembers, remove as removeAcademyMembers } from '../../redux/academyMembers/actions.js';

export default compose(
  connect(
    state => {
    return ({
      loggedInUser: state.users.loggedInUser,
      academy: state.academies.academy,
      academyMembers: state.academyMembers.academyMembers
    })},
    dispatch => ({
      getAcademy: (id, options, fromCache) => dispatch(getAcademy(id, options, fromCache)),
      getAcademyMembers: (key, params, options, fromCache) => dispatch(getAcademyMembers(key, params, options, fromCache)),
      updateAcademyMembers: (id, entity, options) => dispatch(updateAcademyMembers(id, entity, options)),
      removeAcademyMembers: (id) => dispatch(removeAcademyMembers(id)),
      registerByAcademy: (entity) => dispatch(registerByAcademy(entity))
    }),
  ))(AcademyUsersView);
