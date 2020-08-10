import { combineReducers } from 'redux';

let classState = { classes: [], class: null };

const classReducer = (state = classState, action) => {
     switch (action.type) {
        case 'CLASSES':
           state = { ...state, classes: action.data };
           break;
        case 'CLASS':
           state = { ...state, class: action.data };
           break;
        default:
          break
    }

    return state;
};

export default classReducer;