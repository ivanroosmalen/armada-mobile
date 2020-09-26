import { combineReducers } from 'redux';

let classState = { classes: [], class: null, queryParams: {}, userAttendanceMetrics: {}, totalAttendanceMetrics: {} };

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
         case 'USER_ATTENDANCE_METRICS':
           state = { ...state, userAttendanceMetrics: action.data };
           break;
         case 'TOTAL_ATTENDANCE_METRICS':
           state = { ...state, totalAttendanceMetrics: action.data };
           break;
        default:
          break
    }

    return state;
};

export default classReducer;