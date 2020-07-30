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
      academies: state.academies.academies
    })},
    dispatch => ({
      getAcademies: (params) => dispatch(list(params))
    }),
  ))(AcademyListView);
