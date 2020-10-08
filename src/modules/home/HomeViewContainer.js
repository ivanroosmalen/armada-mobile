import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { list, getUserAcademies } from '../../redux/academies/actions.js'
import { list as getAcademyRequests, approve } from '../../redux/academyRequests/actions.js'
import { list as getNotifications } from '../../redux/notifications/actions.js'
import { getUserAttendanceMetrics, list as getClasses, attend, unattend } from '../../redux/classes/actions.js'
import HomeScreen from './HomeView';

export default compose(
connect(
    state => {
    return ({
      loggedInUser: state.users.loggedInUser,
      academies: state.academies.academies,
      userAcademies: state.academies.userAcademies,
      notifications: state.notifications.notifications,
      userAttendanceMetrics: state.classes.userAttendanceMetrics,
      classes: state.classes.classes,
      classListUpdate: state.classes.classListUpdate,
      academyListUpdate: state.academies.academyListUpdate
    })},
    dispatch => ({
      getAcademies: (key, params, options, fromCache) => dispatch(list(key, params, options, fromCache)),
      getUserAcademies: (id, params, fromCache) => dispatch(getUserAcademies(id, params, fromCache)),
      getNotifications: (params) => dispatch(getNotifications(params)),
      getUserAttendanceMetrics: (params, fromCache) => dispatch(getUserAttendanceMetrics(params, fromCache)),
      getClasses: (key, params, options, fromCache) => dispatch(getClasses(key, params, options, fromCache)),
      attend: (data) => dispatch(attend(data)),
      unattend: (data) => dispatch(unattend(data)),
    })
  ))(HomeScreen);
