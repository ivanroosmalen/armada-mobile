import { combineReducers } from 'redux';

// ## Generator Reducer Imports
import app from '../modules/AppState';
import users from './users/user-reducers';
import academies from './academies/academy-reducers';
import academyRequests from './academyRequests/academyRequest-reducers';
import martialArts from './martialArts/martialArt-reducers';
import scheduleItems from './scheduleItems/scheduleItem-reducers';
import classes from './classes/class-reducers';

export default combineReducers({
  // ## Generator Reducers
  app,
  users,
  martialArts,
  academies,
  academyRequests,
  scheduleItems,
  classes
});
