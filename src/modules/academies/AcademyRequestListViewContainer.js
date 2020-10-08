// @flow
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import AcademyRequestListView from './AcademyRequestListView';
import { list, approve } from '../../redux/academyRequests/actions.js'

export default compose(
  connect(
    state => {
    return ({
      loggedInUser: state.users.loggedInUser,
      academyRequests: state.academyRequests.academyRequests
    })},
    dispatch => ({
      getAcademyRequests: (params, fromCache) => dispatch(list(params, fromCache)),
      approveAcademyRequest: (id, data) => dispatch(approve(id, data))
    }),
  ))(AcademyRequestListView);
