// @flow
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import AcademyView from './AcademyView';
import { get, updateProfileImage, cancelMembership } from '../../redux/academies/actions.js';
import { create, remove, getByAcademyId } from '../../redux/academyRequests/actions.js';
import { list } from '../../redux/classes/actions.js';
import { list as getAcademyMembers, remove as removeAcademyMember } from '../../redux/academyMembers/actions.js';

export default compose(
  connect(
    state => {
    return ({
      loggedInUser: state.users.loggedInUser,
      academy: state.academies.academy,
      classes: state.classes.classes,
      academyRequest: state.academyRequests.academyRequest,
      academyMembers: state.academyMembers.academyMembers
    })},
    dispatch => ({
      getAcademy: (id, options, fromCache) => dispatch(get(id, options, fromCache)),
      getAcademyMembers: (key, params, options, fromCache) => dispatch(getAcademyMembers(key, params, options, fromCache)),
      removeAcademyMember: (id, options) => dispatch(removeAcademyMember(id, options)),
      updateProfileImage: (id, data) => dispatch(updateProfileImage(id, data)),
      list: (key, params) => {dispatch(list(key, params))},
      createAcademyRequest: (data) => dispatch(create(data)),
      removeAcademyRequest: (id) => dispatch(remove(id)),
      getByAcademyId: (id, params) => dispatch(getByAcademyId(id, params)),
      cancelMembership: (id) => dispatch(cancelMembership(id))
    }),
  ))(AcademyView);
