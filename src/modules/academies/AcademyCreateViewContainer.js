// @flow
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import AcademyCreateView from './AcademyEditView';
import { get, create } from '../../redux/academies/actions.js'
import { list } from '../../redux/martialArts/actions.js'

export default compose(
  connect(
    state => {
    return ({
      loggedInUser: state.users.loggedInUser,
      martialArts: state.martialArts.martialArts
    })},
    dispatch => ({
      getMartialArts: () => dispatch(list()),
      createAcademy: (id, entity) => dispatch(create(id, entity))
    }),
  ))(AcademyCreateView);
