import UserService from '../../http/user-service.js';

const userService = new UserService('users');
const USERS = 'USERS';
const USER = 'USER';

export function list(params, options) {
  return async function(dispatch) {
    let users = await userService.list(params, options);
    dispatch({type: USERS, data: response.data.entity});
  }
}

export function get(id, options) {
  return async function(dispatch) {
    let reponse = userService.get(id, options);
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
    get(response.data.entity.id);
  }
}

export function remove(id, options) {
  return async function(dispatch) {
    await userService.remove(id, options);
  }
}

export function login(token) {
  return async function(dispatch) {
    await accountService.login(entity);
  }
}

export function sendToken(email) {
  return async function(dispatch) {
    await accountService.sendToken(id, options);
  }
}
