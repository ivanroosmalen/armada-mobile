import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import ContactScreen from './ContactView';

export default compose(
connect(
    state => {
    return ({
    })},
    dispatch => ({
    })
  ))(ContactScreen);
