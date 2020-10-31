import AcademyMemberService from '../../http/academyMember-service.js';

const service = new AcademyMemberService('academyMembers');
const ACADEMY_MEMBERS = 'ACADEMY_MEMBERS';
const ACADEMY_MEMBER = 'ACADEMY_MEMBER';

export function list(key = 'default', params, options, fromCache = false) {
  return async function(dispatch, getState) {
    if(fromCache) {
        let state = getState()
        if(state.academyMembers.academyMembers && state.academyMembers.academyMembers[key] && state.academyMembers.academyMembers[key].length) {
            return;
        }
    }

    let response = await service.list(params, options);
    dispatch({type: ACADEMY_MEMBERS, data: response.data.entity, key});
  }
}

export function get(id, options, fromCache = false) {
  return async function(dispatch) {
    if(fromCache) {
        let state = getState()
        if(state.academyMembers.academyMember && state.academyMembers.academyMember[id]) {
            return;
        }
    }

    let response = await service.get(id, {}, options);
    dispatch({type: ACADEMY_MEMBER, data: response.data.entity, key: id});
  }
}

export function create(entity, options) {
  return async function(dispatch) {
    let response = await service.create(entity, options);
    dispatch({type: ACADEMY_MEMBER, data: response.data.entity, key: response.data.entity._id});
    return response.data.entity;
  }
}

export function linkUser(id, entity, options) {
  return async function(dispatch) {
    let response = await service.linkUser(id, entity, options);
    dispatch({type: ACADEMY_MEMBER, data: response.data.entity, key: id});
    return response;
  }
}

export function update(id, entity, options) {
  return async function(dispatch) {
    let response = await service.update(id, entity, options);
    dispatch({type: ACADEMY_MEMBER, data: response.data.entity, key: id});
    return response.data.entity;
  }
}

export function remove(id, options) {
  return async function(dispatch) {
    await service.remove(id, options);
    dispatch({type: ACADEMY_MEMBER, data: null, key: id});
  }
}
