import { connect } from 'react-redux';
import { compose } from 'recompose';

import UserScheduleScreen from './UserScheduleView';
import { list, attend, unattend } from '../../redux/classes/actions.js'
import { getUserAcademies } from '../../redux/academies/actions.js'

export default compose(
  connect(
    state => ({
      loggedInUser: state.users.loggedInUser,
      classes: state.classes.classes,
      classListUpdate: state.classes.classListUpdate,
      userAcademies: state.academies.userAcademies
    }),
    dispatch => ({
      list: ( key, params ) => dispatch(list(key, params)),
      attend: (data) => dispatch(attend(data)),
      unattend: (data) => dispatch(unattend(data)),
      getUserAcademies: (id, params) => dispatch(getUserAcademies(id, params))
    })
  )
)(UserScheduleScreen);
