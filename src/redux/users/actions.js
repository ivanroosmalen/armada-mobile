import UserService from '../../http/user-service.js';
import { store } from '../store.js';
import AsyncStorage from '@react-native-community/async-storage';
const userService = new UserService('users');
const USERS = 'USERS';
const USER = 'USER';
const JWT = 'JWT';
const LOGGED_IN_USER = 'LOGGED_IN_USER';
const TRANSLATIONS = 'TRANSLATIONS';
const LOGOUT = 'LOGOUT';

export function list(key = 'default', params, options, fromCache = false) {
  return async function(dispatch, getState) {
    if(fromCache) {
        let state = getState()
        if(state.academies.academies && state.academies.academies[key]) {
            return;
        }
    }

    let response = await userService.list(params, options);
    dispatch({type: USERS, data: response.data.entity, key});
  }
}

export function get(id, options, fromCache = false) {
  return async function(dispatch, getState) {
    if(fromCache) {
        let state = getState()
        if(state.academies.academy && state.academies.academy[id]) {
            return;
        }
    }

    let response = await userService.get(id, {}, options);
    dispatch({type: USER, data: response.data.entity, key: id});
    return response.data.entity;
  }
}

export function create(entity, options) {
  return async function (dispatch) {
    let response = await userService.create(entity, options);
    await dispatch(get(response.data.entity._id));
  }
}

export function update(id, entity, options) {
  return async function(dispatch) {
    let response = await userService.update(id, entity, options);
    dispatch({type: USER, data: response.data.entity});
    dispatch(setLoggedInUser(response.data.entity));
  }
}

export function remove(id, options) {
  return async function(dispatch) {
    await userService.remove(id, options);
  }
}

export function login(entity) {
  return async function(dispatch) {
    let response = await userService.login(entity);
    let jwt = response && response.data && response.data.entity && response.data.entity.jwt;
    let user = response && response.data && response.data.entity && response.data.entity.user;

    await dispatch(setJwt(jwt));
    await dispatch(setLoggedInUser(user));

    return response;
  }
}

export function logout(entity) {
  return async function(dispatch) {
    const state = store.getState();
    if(state.users.jwt) {
        userService.logout();
    }

    await dispatch(setJwt(null));
    await dispatch(setLoggedInUser(null));
    await dispatch({type: LOGOUT});
  }
}

  export function setLoggedInUser(user) {
   return async function(dispatch) {
     if(user && !user.thumbnailImg) {
        user.thumbnailImg = 'https://armada-user-images.s3.amazonaws.com/default/thumbnail.jpg';
     }

     dispatch({type: LOGGED_IN_USER, data: user});
     try {
       await AsyncStorage.setItem('loggedInUser', user ? JSON.stringify(user) : '');
     } catch (err) {
       console.error('Unable to set async storage');
     }
   }
 }

 export function setJwt(jwt) {
   return async function(dispatch) {
     dispatch({type: JWT, data: jwt});
     try {
       await AsyncStorage.setItem('jwt', jwt || '');
     } catch (err) {
       console.error('Unable to set async storage');
     }
   }
 }

export function register(entity) {
  return async function(dispatch) {
    return userService.register(entity);
  }
}

export function registerByAcademy(entity) {
  return async function(dispatch) {
    return userService.registerByAcademy(entity);
  }
}

export function updateProfileImage(id, data, options = {}) {
  return async function(dispatch) {
    return userService.updateProfileImage(id, data, options);
  }
}

export function updateThumbnailImage(id, data, options = {}) {
  return async function(dispatch) {
    return userService.updateThumbnailImage(id, data, options);
  }
}

export function updatePassword(id, entity, options = {}) {
  return async function(dispatch) {
    return userService.updatePassword(id, entity, options);
  }
}

export function forgotPassword(entity, options = {}) {
  return async function(dispatch) {
    return userService.forgotPassword(entity, options);
  }
}

