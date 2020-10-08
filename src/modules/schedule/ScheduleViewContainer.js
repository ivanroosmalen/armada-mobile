import { connect } from 'react-redux';
import { compose } from 'recompose';

import ScheduleScreen from './ScheduleView';
import { list, attend, unattend } from '../../redux/classes/actions.js'
import { get } from '../../redux/academies/actions.js';

export default compose(
  connect(
    state => ({
      loggedInUser: state.users.loggedInUser,
      classes: state.classes.classes,
      classListUpdate: state.classes.classListUpdate,
      academy: state.academies.academy
    }),
    dispatch => ({
      list: ( key, params, options, fromCache ) => dispatch(list(key, params, options, fromCache)),
      attend: (data) => dispatch(attend(data)),
      unattend: (data) => dispatch(unattend(data)),
      getAcademy: (id, options, fromCache) => dispatch(get(id, options, fromCache))
    })
  )
)(ScheduleScreen);
