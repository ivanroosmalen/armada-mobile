import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { list, getUserAcademies } from '../../redux/academies/actions.js'
import { list as getAcademyRequests, approve } from '../../redux/academyRequests/actions.js'
import { getTotalAttendanceMetrics } from '../../redux/classes/actions.js'
import OwnerDashboardScreen from './OwnerDashboardView';

export default compose(
connect(
    state => {
    return ({
      loggedInUser: state.users.loggedInUser,
      academies: state.academies.academies,
      userAcademies: state.academies.userAcademies,
      academyRequests: state.academyRequests.academyRequests,
      totalAttendanceMetrics: state.classes.totalAttendanceMetrics,
    })},
    dispatch => ({
      getAcademies: (params) => dispatch(list(params)),
      getUserAcademies: (id, params) => dispatch(getUserAcademies(id, params)),
      getAcademyRequests: (params) => dispatch(getAcademyRequests(params)),
      approveAcademyRequest: (id, data) => dispatch(approve(id, data)),
      getTotalAttendanceMetrics: (params) => dispatch(getTotalAttendanceMetrics(params))
    })
  ))(OwnerDashboardScreen);
