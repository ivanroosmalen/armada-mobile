import ClassService from '../../http/class-service.js';
import store from '../store';

const service = new ClassService('classes');
const CLASSES = 'CLASSES';
const CLASS = 'CLASS';
const QUERY_PARAMS = 'QUERY_PARAMS';

export function list(params, options) {
  return async function(dispatch) {
    let response = await service.list(params, options);
    dispatch({type: QUERY_PARAMS, data: params});
    dispatch({type: CLASSES, data: response.data.entity});
  }
}

export function get(id, params, options) {
  return async function(dispatch) {
    let response = await service.get(id, params, options);
    dispatch({type: CLASS, data: response.data.entity});
  }
}

export function clear() {
  return async function(dispatch) {
    dispatch({type: CLASS, data: null});
  }
}

export function create(entity, options) {
  return async function(dispatch, getState) {
    let response = await service.create(entity, options);
    dispatch(get(response.data.entity._id))
    dispatch(list(getState().classes.queryParams))
    return response.data.entity;
  }
}

export function attend(data) {
  return async function(dispatch, getState) {
    let response = await service.attend(data);
    dispatch(get(response.data.entity._id));
    dispatch(list(getState().classes.queryParams));
    return response.data.entity;
  }
}

export function unattend(data) {
  return async function(dispatch, getState) {
    let response = await service.unattend(data);
    dispatch(get(response.data.entity._id));
    dispatch(list(getState().classes.queryParams));
    return response.data.entity;
  }
}

export function update(id, entity, options) {
  return async function(dispatch, getState) {
    let response = await service.update(id, entity, options);
    dispatch(get(response.data.entity._id))
    dispatch(list(getState().classes.queryParams))
    return response.data.entity;
  }
}

export function remove(id, options) {
  return async function(dispatch, getState) {
    await service.remove(id, options);
    dispatch(list(getState().classes.queryParams))
  }
}
