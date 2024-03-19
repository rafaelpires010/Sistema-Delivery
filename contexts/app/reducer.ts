import {DataType, Actiontype, Actions} from './types';

export const reducer = (state: DataType, action: Actiontype) => {
    switch(action.type) {
        case Actions.SET_TENENT:
            return{...state, tenent: action.payload.tenent}
        break;

        default: return state;
    }

}