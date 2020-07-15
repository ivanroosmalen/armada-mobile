import { combineReducers } from 'redux';

let martialArtsState = { martialArts: [] };

const martialArtsReducer = (state = martialArtsState, action) => {
     switch (action.type) {
        case 'MARTIAL_ARTS':
           state = { ...state, martialArts: action.data };
           break;
        case 'MARTIAL_ART':
           state = { ...state, martialArt: action.data };
           break;
        default:
          break
    }

    return state;
};

export default martialArtsReducer;