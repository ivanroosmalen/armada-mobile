import { combineReducers } from 'redux';

let paymentsState = { paymentMethods: [], productsPricing: [], userAcademyPayment: {} };

const paymentsReducer = (state = paymentsState, action) => {
     switch (action.type) {
        case 'PAYMENT_METHODS':
           state = { ...state, paymentMethods: action.data };
            break;
        case 'PRODUCTS_PRICING':
           state = { ...state, productsPricing: action.data };
           break;
        case 'USER_ACADEMY_PAYMENT':
           let userAcademyPayment = state.userAcademyPayment || {};
           userAcademyPayment[action.key || 'default'] = action.data;
           state = { ...state, userAcademyPayment: Object.assign({}, userAcademyPayment) };
           break;
        default:
          break
    }

    return state;
};

export default paymentsReducer;