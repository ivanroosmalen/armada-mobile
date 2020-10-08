import PaymentService from '../../http/payment-service.js';
import { store } from '../store.js';

const service = new PaymentService('payments');
const PAYMENT_METHODS = 'PAYMENT_METHODS';
const PRODUCTS_PRICING = 'PRODUCTS_PRICING';
const USER_ACADEMY_PAYMENT = 'USER_ACADEMY_PAYMENT';

export function listPaymentMethods(options) {
  return async function(dispatch) {
    let response = await service.listPaymentMethods(options);
    dispatch({type: PAYMENT_METHODS, data: response.data.entities});
  }
}

export function createPaymentMethod(data, options) {
  return async function(dispatch) {
    let response = await service.createPaymentMethod(data, options);
    dispatch(listPaymentMethods());
    return response.data.entity;
  }
}

export function updatePaymentMethod(data, options) {
  return async function(dispatch) {
    let response = await service.updatePaymentMethod(data, options);
    dispatch(listPaymentMethods());
    return response.data.entity;
  }
}

export function createSubscription(data, options) {
  return async function(dispatch) {
    let response = await service.createSubscription(data, options);
    return response.data.entity;
  }
}

export function updateSubscription(data, options) {
  return async function(dispatch) {
    let response = await service.updateSubscription(data, options);
    return response.data.entity;
  }
}

export function cancelSubscription(data, options) {
  return async function(dispatch) {
    let response = await service.cancelSubscription(data, options);
    return response.data.entity;
  }
}

export function getProductsAndPricing(options) {
  return async function(dispatch) {
    let response = await service.getProductsAndPricing(options);
    dispatch({type: PRODUCTS_PRICING, data: response.data.entities});
    return response.data.entities;
  }
}

export function getUserAcademyPayment(id, options) {
  return async function(dispatch) {
    let response = await service.getUserAcademyPayment(id, options);
    dispatch({type: USER_ACADEMY_PAYMENT, data: response.data.entity, key: id});
    return response.data.entity;
  }
}
