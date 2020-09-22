import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { list, getUserAcademies } from '../../redux/academies/actions.js'
import { list as getAcademyRequests, approve } from '../../redux/academyRequests/actions.js'
import { list as getNotifications } from '../../redux/notifications/actions.js'
import { getUserAttendanceMetrics } from '../../redux/classes/actions.js'
import HomeScreen from './HomeView';

export default compose(
connect(
    state => {
    return ({
      loggedInUser: state.users.loggedInUser,
      academies: state.academies.academies,
      userAcademies: state.academies.userAcademies,
      academyRequests: state.academyRequests.academyRequests,
      notifications: state.notifications.notifications,
      userAttendanceMetrics: state.classes.userAttendanceMetrics,
    })},
    dispatch => ({
      getAcademies: (params) => dispatch(list(params)),
      getUserAcademies: (id, params) => dispatch(getUserAcademies(id, params)),
      getAcademyRequests: (params) => dispatch(getAcademyRequests(params)),
      approveAcademyRequest: (id, data) => dispatch(approve(id, data)),
      getNotifications: (params) => dispatch(getNotifications(params)),
      getUserAttendanceMetrics: (params) => dispatch(getUserAttendanceMetrics(params))
    })
  ))(HomeScreen);
