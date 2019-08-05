import axios from 'axios';
import BaseService from '../../http/base-service.js';

const userService = new BaseService('users');
const USERS = 'USERS';

export function list(params, options) {
  return function(dispatch) {
    let users = userService.list(params, options).then(response => {
        console.log(response.data.entity)
        dispatch({type: USERS, data: response.data.entity});
    });
  }
}

export function get(id, options) {
  return function(dispatch) {
    let user = userService.get(id, options).then(response => {
        dispatch({type: USER, data: response.data.entity});
    });
  }
}

export function create(entity, options) {
  return function(dispatch) {
    let response = userService.create(entity, options).then(response => {
        get(response.data.entity.id);
    })
  }
}

export function update(id, entity, options) {
  return function(dispatch) {
    let response = userService.update(id, entity, options).then(response => {
        get(response.data.entity.id);
    })
  }
}

export function remove(id, options) {
  return function(dispatch) {
    let response = userService.remove(id, options).then(response => {
        get(response.data.entity.id);
    })
  }
}