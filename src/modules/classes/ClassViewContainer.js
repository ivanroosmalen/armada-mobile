import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import ClassView from './ClassView';
import { get as getAcademy }  from '../../redux/academies/actions.js'
import { get, update, create, attend, unattend } from '../../redux/classes/actions.js'

export default compose(
  connect(
    state => {
    return ({
      loggedInUser: state.users.loggedInUser,
      academy: state.academies.academy,
      class: state.classes.class
    })},
    dispatch => ({
      getAcademy: (id) => dispatch(getAcademy(id)),
      getClass: (id) => dispatch(get(id)),
      attend: (data) => dispatch(attend(data)),
      unattend: (data) => dispatch(unattend(data)),
    })
  ))(ClassView);
