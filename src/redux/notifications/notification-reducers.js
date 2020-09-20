import { combineReducers } from 'redux';

let notificationsState = { notifications: [], notification: {} };

const notificationsReducer = (state = notificationsState, action) => {
     switch (action.type) {
        case 'NOTIFICATIONS':
           state = { ...state, notifications: action.data };
            break;
        case 'NOTIFICATION':
            state = { ...state, notification: action.data };
            break;
        default:
          break
    }

    return state;
};

export default notificationsReducer;