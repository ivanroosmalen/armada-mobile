import axios from 'axios';
import BaseService from '../../http/base-service.js';

const service = new BaseService('academies');
const ACADEMIES = 'ACADEMIES';
const ACADEMY = 'ACADEMY';

export function list() {
  return async function(dispatch) {
    let academies = await service.list();
    dispatch({type: ACADEMIES, data: academies});
  }
}

export function get(id) {
  return async function(dispatch) {
    let academy = await service.get(id);
    dispatch({type: ACADEMY, data: academy});
  }
}

export function create(params) {
  return async function(dispatch) {
    let response = await service.create(params);
    get(response.id);
  }
}

export function update(params) {
  return async function(dispatch) {
    let response = await service.update(params);
    get(response.id);
  }
}

export function remove(params) {
  return async function(dispatch) {
    await service.remove(params);
  }
}