import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import ClassView from './ClassView';
import { get as getAcademy }  from '../../redux/academies/actions.js'
import { get, update, create, remove, attend, unattend } from '../../redux/classes/actions.js'
import { list as getAcademyMembers } from '../../redux/academyMembers/actions.js';

export default compose(
  connect(
    state => {
    return ({
      loggedInUser: state.users.loggedInUser,
      academy: state.academies.academy,
      class: state.classes.class,
      academyMembers: state.academyMembers.academyMembers
    })},
    dispatch => ({
      getAcademy: (id, options, fromCache) => dispatch(getAcademy(id, options, fromCache)),
      getAcademyMembers: (key, params, options) => dispatch(getAcademyMembers(key, params, options)),
      getClass: (id, options, fromCache) => dispatch(get(id, options, fromCache)),
      attend: (data) => dispatch(attend(data)),
      unattend: (data) => dispatch(unattend(data)),
      removeClass: (id) => dispatch(remove(id)),
      updateClass: (id, entity) => dispatch(update(id, entity)),
    })
  ))(ClassView);
