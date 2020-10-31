import ClassService from '../../http/class-service.js';

const service = new ClassService('classes');
const CLASSES = 'CLASSES';
const CLASS = 'CLASS';
const CLASS_LIST_UPDATE = 'CLASS_LIST_UPDATE';
const USER_ATTENDANCE_METRICS = 'USER_ATTENDANCE_METRICS';
const TOTAL_ATTENDANCE_METRICS = 'TOTAL_ATTENDANCE_METRICS';

export function list(key = 'default', params, options, fromCache = false) {
  return async function(dispatch, getState) {
    if(fromCache) {
        let state = getState()
        if(state.classes.classes && state.classes.classes[key]) {
            return;
        }
    }

    let response = await service.list(params, options);
    dispatch({type: CLASSES, data: response.data.entity, key});
  }
}

export function get(id, options, fromCache) {
  return async function(dispatch, getState) {
    if(fromCache) {
        let state = getState()
        if(state.classes.class && state.classes.class[id]) {
            return;
        }
    }

    let response = await service.get(id, {}, options);
    dispatch({type: CLASS, data: response.data.entity, key: id});
  }
}

export function clear(id) {
  return async function(dispatch) {
    dispatch({type: CLASS, data: null, key: id});
  }
}

export function create(entity, options) {
  return async function(dispatch, getState) {
    let response = await service.create(entity, options);
    dispatch(get(response.data.entity._id))
    dispatch({type: CLASS_LIST_UPDATE});
    return response.data.entity;
  }
}

export function attend(data) {
  return async function(dispatch, getState) {
    let response = await service.attend(data);
    if(response.status === 200) {
        dispatch(get(response.data.entity._id));
        dispatch({type: CLASS_LIST_UPDATE});
    }

    return response.data.entity;
  }
}

export function unattend(data) {
  return async function(dispatch, getState) {
    let response = await service.unattend(data);
    dispatch(get(response.data.entity._id));
    dispatch({type: CLASS_LIST_UPDATE});
    return response.data.entity;
  }
}

export function batchUpdateAttendance(entity) {
  return async function(dispatch, getState) {
    let response = await service.batchUpdateAttendance(entity);
    if(response.status === 200) {
        dispatch(get(response.data.entity._id));
        dispatch({type: CLASS_LIST_UPDATE});
    }
    return response.data.entity;
  }
}

export function update(id, entity, options) {
  return async function(dispatch, getState) {
    let response = await service.update(id, entity, options);
    dispatch(get(response.data.entity._id))
    dispatch({type: CLASS_LIST_UPDATE});
    return response.data.entity;
  }
}

export function remove(id, options) {
  return async function(dispatch, getState) {
    await service.remove(id, options);
    dispatch({type: CLASS_LIST_UPDATE});
  }
}

export function getUserAttendanceMetrics(params, fromCache = false) {
  return async function(dispatch, getState) {
    if(fromCache) {
        let state = getState()
        if(state.classes.userAttendanceMetrics && Object.keys(state.classes.userAttendanceMetrics).length) {
            return state.classes.userAttendanceMetrics;
        }
    }
    let response = await service.getUserAttendanceMetrics(params);
    let entity = response && response.data && response.data.entity || {};
    dispatch({type: USER_ATTENDANCE_METRICS, data: entity});
    return entity;
  }
}

export function getTotalAttendanceMetrics(params, fromCache = false) {
  return async function(dispatch, getState) {
    if(fromCache) {
        let state = getState()
        if(state.classes.totalAttendanceMetrics && Object.keys(state.classes.totalAttendanceMetrics).length) {
            return state.classes.totalAttendanceMetrics;
        }
    }

    let response = await service.getTotalAttendanceMetrics(params);
    let entity = response && response.data && response.data.entity || {};
    dispatch({type: TOTAL_ATTENDANCE_METRICS, data: entity});
    return entity;
  }
}