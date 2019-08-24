import { combineReducers } from 'redux';
import userReducer from './users/user-reducers.js';
import martialArtReducer from './martialArts/martialArt-reducers.js';
import academyReducer from './academies/academy-reducers.js';


// Combine all the reducers
const rootReducer = combineReducers({
    userReducer,
    martialArtReducer,
    academyReducer
})

export default rootReducer;