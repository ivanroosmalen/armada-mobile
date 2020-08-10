import ScheduleItemService from '../../http/scheduleItem-service.js';

const service = new ScheduleItemService('scheduleItems');
const SCHEDULE_ITEMS = 'SCHEDULE_ITEMS';
const SCHEDULE_ITEM = 'SCHEDULE_ITEM';

export function list(params, options) {
  return async function(dispatch) {
    let response = await service.list(params, options);
    dispatch({type: SCHEDULE_ITEMS, data: response.data.entity});
  }
}

export function get(id, params, options) {
  return async function(dispatch) {
    let response = await service.get(id, params, options);
    dispatch({type: SCHEDULE_ITEM, data: response.data.entity});
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
    dispatch({type: SCHEDULE_ITEM, data: response.data.entity});
  }
}

export function remove(id, options) {
  return async function(dispatch) {
    await service.remove(id, options);
  }
}
