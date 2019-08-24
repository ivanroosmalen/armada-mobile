import { combineReducers } from 'redux';

let academiesState = { academies: [], academy: {} };

const martialArtsReducer = (state = academiesState, action) => {
     switch (action.type) {
        case 'ACADEMIES':
           state = { ...state, academies: action.data };
            break;
        case 'ACADEMY':
            state = { ...state, academy: action.data };
            break;
        default:
          break
    }

    return state;
};

export default martialArtsReducer;