import { combineReducers } from 'redux';

let classState = { classes: {}, class: {}, classListUpdate: false, userAttendanceMetrics: {}, totalAttendanceMetrics: {} };

const classReducer = (state = classState, action) => {
     switch (action.type) {
        case 'CLASSES':
           let classes = state.classes || {};
           classes[action.key || 'default'] = action.data;
           state = { ...state, classes: Object.assign({}, classes) };
           break;
        case 'CLASS':
           let classObj = state.class || {};
           classObj[action.key || 'default'] = action.data;
           state = { ...state, class: Object.assign({}, classObj) };
           break;
         case 'CLASS_LIST_UPDATE':
           state = { ...state, classListUpdate: !state.classListUpdate };
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