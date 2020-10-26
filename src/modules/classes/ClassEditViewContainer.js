// @flow
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import ClassEditView from './ClassEditView';
import { get as getAcademy }  from '../../redux/academies/actions.js'
import { get, clear, update, create } from '../../redux/classes/actions.js'
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
      getAcademy: (id) => dispatch(getAcademy(id)),
      getAcademyMembers: (key, params, options) => dispatch(getAcademyMembers(key, params, options)),
      updateClass: (id, entity) => dispatch(update(id, entity)),
      createClass: (entity) => dispatch(create(entity)),
      getClass: (id) => dispatch(get(id)),
      clearClass: () => dispatch(clear())
    }),
  ))(ClassEditView);
