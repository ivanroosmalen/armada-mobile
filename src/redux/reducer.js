import { combineReducers } from 'redux';

// ## Generator Reducer Imports
import gallery from '../modules/gallery/GalleryState';
import app from '../modules/AppState';
import calendar from '../modules/calendar/CalendarState';
import charts from '../modules/charts/ChartsState';
import chat from '../modules/chat/ChatState';
import posts from '../modules/blog/PostsState'
import users from './users/user-reducers';
import academies from './academies/academy-reducers';
import martialArts from './martialArts/martialArt-reducers';

export default combineReducers({
  // ## Generator Reducers
  gallery,
  app,
  calendar,
  charts,
  chat,
  posts,
  users,
  martialArts,
  academies
});
