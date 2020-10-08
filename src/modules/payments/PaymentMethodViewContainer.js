import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import PaymentMethodView from './PaymentMethodView';
import { createPaymentMethod, updatePaymentMethod }  from '../../redux/payments/actions.js'

export default compose(
  connect(
    state => {
    return ({
      loggedInUser: state.users.loggedInUser,
    })},
    dispatch => ({
      createPaymentMethod: (data) => dispatch(createPaymentMethod(data))
    })
  ))(PaymentMethodView);
