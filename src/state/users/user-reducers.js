import { combineReducers } from 'redux';

let userState = { users: [] };

const userReducer = (state = userState, action) => {
     switch (action.type) {
        case 'USERS':
           state = { ...state, users: action.data };
           break;
        default:
          break
    }

    return state;
};

export default userReducer;