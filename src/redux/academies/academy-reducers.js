import { combineReducers } from 'redux';

let academiesState = { academies: {}, academy: {}, academyListUpdate: false, userAcademies: {} };

const academiesReducer = (state = academiesState, action) => {
     switch (action.type) {
        case 'ACADEMIES':
           let academies = state.academies || {};
           academies[action.key || 'default'] = action.data;
           state = { ...state, academies: Object.assign({}, academies) };
            break;
        case 'ACADEMY':
           let academy = state.academy || {};
           academy[action.key || 'default'] = action.data;
           state = { ...state, academy: Object.assign({}, academy) };
           break;
         case 'ACADEMY_LIST_UPDATE':
           state = { ...state, academyListUpdate: !state.academyListUpdate };
           break;
        case 'USER_ACADEMIES':
            let userAcademies = state.userAcademies || {};
            userAcademies[action.key || 'default'] = action.data;
            state = { ...state, userAcademies: Object.assign({}, userAcademies) };
            break;
        default:
          break
    }

    return state;
};

export default academiesReducer;