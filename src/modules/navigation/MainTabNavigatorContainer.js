import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { getUserAcademies } from '../../redux/academies/actions.js'
import MainTabNavigator from './MainTabNavigator';

export default compose(
connect(
    state => {
    return ({
      loggedInUser: state.users.loggedInUser,
      userAcademies: state.academies.userAcademies,
    })},
    dispatch => ({
      getUserAcademies: (id, params) => dispatch(getUserAcademies(id, params)),
    })
  ))(MainTabNavigator);
