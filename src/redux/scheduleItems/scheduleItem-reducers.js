import { combineReducers } from 'redux';

let scheduleItemState = { scheduleItems: [], scheduleItem: null };

const scheduleItemReducer = (state = scheduleItemState, action) => {
     switch (action.type) {
        case 'SCHEDULE_ITEMS':
           state = { ...state, scheduleItems: action.data };
           break;
        case 'SCHEDULE_ITEM':
           state = { ...state, scheduleItem: action.data };
           break;
        default:
          break
    }

    return state;
};

export default scheduleItemReducer;