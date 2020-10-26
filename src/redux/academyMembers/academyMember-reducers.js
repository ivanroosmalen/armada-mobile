import { combineReducers } from 'redux';

let academyMembersState = { academyMembers: {}, academyMember: {}};

const academyMembersReducer = (state = academyMembersState, action) => {
     switch (action.type) {
        case 'ACADEMY_MEMBERS':
           let academyMembers = state.academyMembers || {};
           academyMembers[action.key || 'default'] = action.data;
           state = { ...state, academyMembers: Object.assign({}, academyMembers) };
           break;
        case 'ACADEMY_MEMBER':
           let academyMember = state.academyMember || {};
           academyMember[action.key || 'default'] = action.data;
           state = { ...state, academyMember: Object.assign({}, academyMember) };
           break;
        default:
           break
    }

    return state;
};

export default academyMembersReducer;