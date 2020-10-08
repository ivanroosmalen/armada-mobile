import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import SubscriptionView from './SubscriptionView';
import { getProductsAndPricing, createSubscription, updateSubscription, cancelSubscription, listPaymentMethods, createPaymentMethod, getUserAcademyPayment }  from '../../redux/payments/actions.js'
import { getUserAcademies, get as getAcademy } from '../../redux/academies/actions.js'

export default compose(
  connect(
    state => {
    return ({
      loggedInUser: state.users.loggedInUser,
      userAcademies: state.academies.userAcademies,
      academy: state.academies.academy,
      productsPricing: state.payments.productsPricing,
      paymentMethods: state.payments.paymentMethods,
      userAcademyPayment: state.payments.userAcademyPayment
    })},
    dispatch => ({
      getUserAcademies: (id, options, fromCache) => dispatch(getUserAcademies(id, options, fromCache)),
      getAcademy: (id, options, fromCache) => dispatch(getAcademy(id, options, fromCache)),
      getProductsAndPricing: () => dispatch(getProductsAndPricing()),
      cancelSubscription: (data) => dispatch(cancelSubscription(data)),
      createSubscription: (data) => dispatch(createSubscription(data)),
      updateSubscription: (data) => dispatch(updateSubscription(data)),
      listPaymentMethods: () => dispatch(listPaymentMethods()),
      createPaymentMethod: (data) => dispatch(createPaymentMethod(data)),
      getUserAcademyPayment: (id) => dispatch(getUserAcademyPayment(id)),
    })
  ))(SubscriptionView);
