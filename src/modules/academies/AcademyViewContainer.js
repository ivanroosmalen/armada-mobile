// @flow
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import AcademyView from './AcademyView';
import { get, updateProfileImage } from '../../redux/academies/actions.js'
import { list } from '../../redux/classes/actions.js'

export default compose(
  connect(
    state => {
    return ({
      loggedInUser: state.users.loggedInUser,
      academy: state.academies.academy,
      classes: state.classes.classes
    })},
    dispatch => ({
      getAcademy: (id) => dispatch(get(id)),
      updateProfileImage: (id, data) => dispatch(updateProfileImage(id, data)),
      list: (params) => dispatch(list(params)),
    }),
  ))(AcademyView);
