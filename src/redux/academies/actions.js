import AcademyService from '../../http/academy-service.js';
import { store } from '../store.js';

const service = new AcademyService('academies');
const ACADEMIES = 'ACADEMIES';
const ACADEMY = 'ACADEMY';
const ACADEMY_LIST_UPDATE = 'ACADEMY_LIST_UPDATE';
const USER_ACADEMIES = 'USER_ACADEMIES';

export function list(key = 'default', params, options) {
  return async function(dispatch) {
    let response = await service.list(params, options);
    dispatch({type: ACADEMIES, data: response.data.entity, key});
  }
}

export function get(id, params, options) {
  return async function(dispatch) {
    let response = await service.get(id, params, options);
    dispatch({type: ACADEMY, data: response.data.entity, key: id});
  }
}

export function create(entity, options) {
  return async function(dispatch) {
    let response = await service.create(entity, options);
    dispatch(get(response.data.entity._id))
    dispatch({type: ACADEMY_LIST_UPDATE});
    return response.data.entity;
  }
}

export function update(id, entity, options) {
  return async function(dispatch) {
    let response = await service.update(id, entity, options);
    dispatch({type: ACADEMY, data: response.data.entity});
    await dispatch(get(id));
    dispatch({type: ACADEMY_LIST_UPDATE});
  }
}

export function remove(id, options) {
  return async function(dispatch) {
    await service.remove(id, options);
    dispatch({type: ACADEMY_LIST_UPDATE});
  }
}

export function updateProfileImage(id, data, options = {}) {
  return async function(dispatch) {
    let result = service.updateProfileImage(id, data, options);
    dispatch({type: ACADEMY_LIST_UPDATE});
    await dispatch(get(id));
    return result;
  }
}

export function getUserAcademies(id, params, options) {
  return async function(dispatch) {
    let response = await service.getUserAcademies(id, params, options);
    dispatch({type: USER_ACADEMIES, data: response.data.entity, key: id});
  }
}

export function cancelMembership(id, options) {
  return async function(dispatch) {
    let response = await service.cancelMembership(id, options);
    await dispatch(get(id));
    dispatch({type: ACADEMY_LIST_UPDATE});
  }
}