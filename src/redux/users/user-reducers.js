import { combineReducers } from 'redux';

let userState = { users: [], user: null };

const userReducer = (state = userState, action) => {
     switch (action.type) {
        case 'USERS':
           let users = state.users || {};
           users[action.key || 'default'] = action.data;
           state = { ...state, users: Object.assign({}, users) };
           break;
        case 'USER':
           let user = state.user || {};
           user[action.key || 'default'] = action.data;
           state = { ...state, user: Object.assign({}, user) };
           break;
        case 'JWT':
           state = { ...state, jwt: action.data };
           break;
        case 'LOGGED_IN_USER':
           state = { ...state, loggedInUser: action.data };
           break;
        default:
          break
    }

    return state;
};

export default userReducer;