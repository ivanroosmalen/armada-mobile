import AcademyService from '../../http/academy-service.js';

const service = new AcademyService('academies');
const ACADEMIES = 'ACADEMIES';
const ACADEMY = 'ACADEMY';
const USER_ACADEMIES = 'USER_ACADEMIES';

export function list(params, options) {
  return async function(dispatch) {
    let response = await service.list(params, options);
    dispatch({type: ACADEMIES, data: response.data.entity});
  }
}

export function get(id, params, options) {
  return async function(dispatch) {
    let response = await service.get(id, params, options);
    dispatch({type: ACADEMY, data: response.data.entity});
  }
}

export function create(entity, options) {
  return async function(dispatch) {
    let response = await service.create(entity, options);
    dispatch(list())
    return response.data.entity;
  }
}

export function update(id, entity, options) {
  return async function(dispatch) {
    let response = await service.update(id, entity, options);
    dispatch({type: ACADEMY, data: response.data.entity});
  }
}

export function remove(id, options) {
  return async function(dispatch) {
    await service.remove(id, options);
  }
}

export function updateProfileImage(id, data, options = {}) {
  return async function(dispatch) {
    return service.updateProfileImage(id, data, options);
  }
}

export function getUserAcademies(id, params, options) {
  return async function(dispatch) {
    let response = await service.getUserAcademies(id, params, options);
    dispatch({type: USER_ACADEMIES, data: response.data.entity});
  }
}

export function cancelMembership(id, options) {
  return async function(dispatch) {
    let response = await service.cancelMembership(id, options);
    dispatch(get(id));
    dispatch(list());
  }
}