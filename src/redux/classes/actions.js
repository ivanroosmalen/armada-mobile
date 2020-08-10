import ClassService from '../../http/class-service.js';

const service = new ClassService('classes');
const CLASSES = 'CLASSES';
const CLASS = 'CLASS';

export function list(params, options) {
  return async function(dispatch) {
    let response = await service.list(params, options);
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
  return async function(dispatch) {
    let response = await service.create(entity, options);
    dispatch(list())
    return response.data.entity;
  }
}

export function attend(data) {
  return async function(dispatch) {
    let response = await service.attend(data);
    dispatch(get(response.data.entity._id))
    return response.data.entity;
  }
}

export function unattend(data) {
  return async function(dispatch) {
    let response = await service.unattend(data);
    dispatch(get(response.data.entity._id))
    return response.data.entity;
  }
}

export function update(id, entity, options) {
  return async function(dispatch) {
    let response = await service.update(id, entity, options);
    dispatch({type: CLASS, data: response.data.entity});
  }
}

export function remove(id, options) {
  return async function(dispatch) {
    await service.remove(id, options);
  }
}
