import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import ClassView from './ClassView';
import { get as getAcademy }  from '../../redux/academies/actions.js'
import { get, update, create, remove, attend, unattend } from '../../redux/classes/actions.js'

export default compose(
  connect(
    state => {
    return ({
      loggedInUser: state.users.loggedInUser,
      academy: state.academies.academy,
      class: state.classes.class
    })},
    dispatch => ({
      getAcademy: (id, options, fromCache) => dispatch(getAcademy(id, options, fromCache)),
      getClass: (id, options, fromCache) => dispatch(get(id, options, fromCache)),
      attend: (data) => dispatch(attend(data)),
      unattend: (data) => dispatch(unattend(data)),
      removeClass: (id) => dispatch(remove(id)),
      updateClass: (id, entity) => dispatch(update(id, entity)),
    })
  ))(ClassView);
