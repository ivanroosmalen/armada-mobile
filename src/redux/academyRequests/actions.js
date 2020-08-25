import AcademyRequestService from '../../http/academyRequest-service.js';

const service = new AcademyRequestService('academyRequests');
const ACADEMY_REQUESTS = 'ACADEMY_REQUESTS';
const ACADEMY_REQUEST = 'ACADEMY_REQUEST';

export function list(params, options) {
  return async function(dispatch) {
    let response = await service.list(params, options);
    dispatch({type: ACADEMY_REQUESTS, data: response.data.entity});
  }
}

export function get(id, params, options) {
  return async function(dispatch) {
    let response = await service.get(id, params, options);
    dispatch({type: ACADEMY_REQUEST, data: response.data.entity});
  }
}

export function getByAcademyId(id, params, options) {
  return async function(dispatch) {
    let response = await service.getByAcademyId(id, params, options);
    dispatch({type: ACADEMY_REQUEST, data: response.data.entity});
  }
}

export function create(entity, options) {
  return async function(dispatch) {
    let response = await service.create(entity, options);
    dispatch(list())
    dispatch(getByAcademyId(entity.academy._id, {complete: false}))
    return response.data.entity;
  }
}

export function update(id, entity, options) {
  return async function(dispatch) {
    let response = await service.update(id, entity, options);
    dispatch(list())
  }
}

export function approve(id, data, options) {
  return async function(dispatch) {
    let response = await service.approve(id, data, options);
    dispatch(list({ complete: false }))
  }
}

export function remove(id, options) {
  return async function(dispatch) {
    await service.remove(id, options);
    dispatch({type: ACADEMY_REQUEST, data: null});
    dispatch(list())
  }
}
