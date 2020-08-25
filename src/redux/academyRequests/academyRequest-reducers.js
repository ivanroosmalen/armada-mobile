import { combineReducers } from 'redux';

let academyRequestsState = { academyRequests: [], academyRequest: {}};

const academyRequestsReducer = (state = academyRequestsState, action) => {
     switch (action.type) {
        case 'ACADEMY_REQUESTS':
           state = { ...state, academyRequests: action.data };
            break;
        case 'ACADEMY_REQUEST':
            state = { ...state, academyRequest: action.data };
            break;
        default:
          break
    }

    return state;
};

export default academyRequestsReducer;