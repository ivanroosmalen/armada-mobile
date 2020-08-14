import { combineReducers } from 'redux';

let classState = { classes: [], class: null, queryParams: {} };

const classReducer = (state = classState, action) => {
     switch (action.type) {
        case 'CLASSES':
           state = { ...state, classes: action.data };
           break;
        case 'CLASS':
           state = { ...state, class: action.data };
           break;
         case 'QUERY_PARAMS':
           state = { ...state, queryParams: action.data };
           break;
        default:
          break
    }

    return state;
};

export default classReducer;