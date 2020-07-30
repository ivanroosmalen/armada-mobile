// @flow
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import AcademyEditView from './AcademyEditView';
import { get, update } from '../../redux/academies/actions.js'
import { list } from '../../redux/martialArts/actions.js'

export default compose(
  connect(
    state => {
    return ({
      loggedInUser: state.users.loggedInUser,
      academy: state.academies.academy,
      martialArts: state.martialArts.martialArts
    })},
    dispatch => ({
      getAcademy: (id) => dispatch(get(id)),
      getMartialArts: () => dispatch(list()),
      updateAcademy: (id, entity) => dispatch(update(id, entity))
    }),
  ))(AcademyEditView);
