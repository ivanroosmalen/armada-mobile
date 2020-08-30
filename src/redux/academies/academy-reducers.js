import { combineReducers } from 'redux';

let academiesState = { academies: [], academy: {}, userAcademies: {}, queryParams: {} };

const academiesReducer = (state = academiesState, action) => {
     switch (action.type) {
        case 'ACADEMIES':
           state = { ...state, academies: action.data };
            break;
        case 'ACADEMY':
            state = { ...state, academy: action.data };
            break;
        case 'USER_ACADEMIES':
            state = { ...state, userAcademies: action.data };
            break;
        case 'QUERY_PARAMS':
            state = { ...state, queryParams: action.data };
            break;
        default:
          break
    }

    return state;
};

export default academiesReducer;