import BaseService from '../../http/base-service.js';

const baseService = new BaseService('martialArts');
const MARTIAL_ARTS = 'MARTIAL_ARTS';
const MARTIAL_ART = 'MARTIAL_ART';

export function list(params, options) {
  return async function(dispatch) {
    let response = await baseService.list(params, options);
    dispatch({type: MARTIAL_ARTS, data: response.data.entity});
    return response.data.entity;
  }
}

export function get(id, options) {
  return async function(dispatch) {
    let reponse = baseService.get(id, options);
    dispatch({type: MARTIAL_ART, data: response.data.entity});
    return response.data.entity;
  }
}
