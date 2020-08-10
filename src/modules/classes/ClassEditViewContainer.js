// @flow
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import ClassEditView from './ClassEditView';
import { get as getAcademy }  from '../../redux/academies/actions.js'
import { get, clear, update, create } from '../../redux/classes/actions.js'

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
      updateClass: (id, entity) => dispatch(update(id, entity)),
      createClass: (entity) => dispatch(create(entity)),
      getClass: (id) => dispatch(get(id)),
      clearClass: () => dispatch(clear())
    }),
  ))(ClassEditView);
