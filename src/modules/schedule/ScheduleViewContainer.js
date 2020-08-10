import { connect } from 'react-redux';
import { compose } from 'recompose';

import ScheduleScreen from './ScheduleView';
import { list } from '../../redux/classes/actions.js'

export default compose(
  connect(
    state => ({
      classes: state.classes.classes,
    }),
    dispatch => ({
      list: params => dispatch(list(params)),
    })
  )
)(ScheduleScreen);
