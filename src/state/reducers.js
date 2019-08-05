import { combineReducers } from 'redux';
import userReducer from './users/user-reducers.js';

// Combine all the reducers
const rootReducer = combineReducers({
    userReducer
    // ,[ANOTHER REDUCER], [ANOTHER REDUCER] ....
})

export default rootReducer;