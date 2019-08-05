import axios from 'axios';
import BaseService from '../../http/base-service.js';

const academyService = new BaseService('academies');
const ACADEMIES = 'ACADEMIES';

export function list() {
  return function(dispatch) {

    let academies = await academyService.list();
    dispatch({type: ACADEMIES, data: academies});
  }
}

export function get(id) {
  return function(dispatch) {
    let academy = await academyService.get(id);
    dispatch({type: ACADEMY, data: academy});
  }
}

export function create(params) {
  return function(dispatch) {
    let response = await academyService.create(params);
    get(response.id);
  }
}