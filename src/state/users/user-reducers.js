import { combineReducers } from 'redux';

let userState = { users: [], user: null };

const userReducer = (state = userState, action) => {
     switch (action.type) {
        case 'USERS':
           state = { ...state, users: action.data };
           break;
        case 'USER':
           state = { ...state, user: action.data };
           break;
        default:
          break
    }

    return state;
};

export default userReducer;