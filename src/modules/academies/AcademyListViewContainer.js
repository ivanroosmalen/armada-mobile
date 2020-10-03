// @flow
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import AcademyListView from './AcademyListView';
import { list } from '../../redux/academies/actions.js'

export default compose(
  connect(
    state => {
    return ({
      loggedInUser: state.users.loggedInUser,
      academies: state.academies.academies,
      academyListUpdate: state.academies.academyListUpdate
    })},
    dispatch => ({
      getAcademies: (key, params) => dispatch(list(key, params))
    }),
  ))(AcademyListView);
