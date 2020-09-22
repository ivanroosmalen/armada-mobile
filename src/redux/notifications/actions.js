import NotificationService from '../../http/notification-service.js';
import { store } from '../store.js';

const service = new NotificationService('notifications');
const NOTIFICATIONS = 'NOTIFICATIONS';
const NOTIFICATION = 'NOTIFICATION';

export function list(params, options) {
  return async function(dispatch) {
    const state = store.getState();
    let response = await service.list(params, options);
    dispatch({type: NOTIFICATIONS, data: response.data.entity});
  }
}

export function get(id, params, options) {
  return async function(dispatch) {
    let response = await service.get(id, params, options);
    let entity = response && response.data && response.data.entity || {};
    dispatch({type: NOTIFICATION, data: entity});
  }
}

export function create(entity, options) {
  return async function(dispatch) {
    let response = await service.create(entity, options);
    return response.data.entity;
  }
}

export function update(id, entity, options) {
  return async function(dispatch) {
    let response = await service.update(id, entity, options);
    dispatch({type: NOTIFICATION, data: response.data.entity});
  }
}

export function remove(id, options) {
  return async function(dispatch) {
    await service.remove(id, options);
  }
}