// @flow
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import AcademyMetricsView from './AcademyMetricsView';
import { getUserAcademies } from '../../redux/academies/actions.js';
import { list as getAcademyMembers } from '../../redux/academyMembers/actions.js';
import { getTotalAttendanceMetrics, getUserAttendanceMetrics } from '../../redux/classes/actions.js'

export default compose(
  connect(
    state => {
    return ({
      loggedInUser: state.users.loggedInUser,
      userAcademies: state.academies.userAcademies,
      academyMembers: state.academyMembers.academyMembers,
      totalAttendanceMetrics: state.classes.totalAttendanceMetrics,
      userAttendanceMetrics: state.classes.userAttendanceMetrics
    })},
    dispatch => ({
      getUserAcademies: (id, params, fromCache) => dispatch(getUserAcademies(id, params, fromCache)),
      getAcademyMembers: (key, params, options, fromCache) => dispatch(getAcademyMembers(key, params, options, fromCache)),
      getTotalAttendanceMetrics: (params, fromCache) => dispatch(getTotalAttendanceMetrics(params, fromCache)),
      getUserAttendanceMetrics: (params, fromCache) => dispatch(getUserAttendanceMetrics(params, fromCache)),
    }),
  ))(AcademyMetricsView);
