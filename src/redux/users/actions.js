import UserService from '../../http/user-service.js';
import { store } from '../store.js';
const userService = new UserService('users');
const USERS = 'USERS';
const USER = 'USER';
const JWT = 'JWT';
const LOGGED_IN_USER = 'LOGGED_IN_USER';

export function list(params, options) {
  return async function(dispatch) {
    let response = await userService.list(params, options);
    dispatch({type: USERS, data: response.data.entity});
  }
}

export function get(id, params, options) {
  return async function(dispatch) {
    let response = await userService.get(id, params, options);
    dispatch({type: USER, data: response.data.entity});
  }
}

export function create(entity, options) {
  return async function (dispatch) {
    let response = await userService.create(entity, options);
    await get(response.data.entity._id);
  }
}

export function update(id, entity, options) {
  return async function(dispatch) {
    let response = await userService.update(id, entity, options);
    dispatch({type: USER, data: response.data.entity});
  }
}

export function remove(id, options) {
  return async function(dispatch) {
    await userService.remove(id, options);
  }
}

export function login(entity) {
  return async function(dispatch) {
    let response = await userService.login(entity);
    dispatch({type: JWT, data: response && response.data && response.data.entity && response.data.entity.jwt});
    dispatch({type: LOGGED_IN_USER, data: response && response.data && response.data.entity && response.data.entity.user});
    return response;
  }
}

export function logout(entity) {
  return async function(dispatch) {
    const state = store.getState();

    if(state.users.jwt) {
        userService.logout();
    }

    dispatch({type: JWT, data: null});
    dispatch({type: LOGGED_IN_USER, data: null});
  }
}

export function register(entity) {
  return async function(dispatch) {
    return userService.register(entity);
  }
}

export function updateProfileImage(id, data, options = {}) {
  return async function(dispatch) {
    return userService.updateProfileImage(id, data, options);
  }
}

export function updateThumbnailImage(id, data, options = {}) {
  return async function(dispatch) {
    return userService.updateThumbnailImage(id, data, options);
  }
}

export function updatePassword(id, entity, options = {}) {
  return async function(dispatch) {
    return userService.updatePassword(id, entity, options);
  }
}

export function forgotPassword(entity, options = {}) {
  return async function(dispatch) {
    return userService.forgotPassword(entity, options);
  }
}

