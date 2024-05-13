import {DataType, Actiontype, Actions} from './types';

export const reducer = (state: DataType, action: Actiontype) => {
    switch(action.type) {
        case Actions.SET_TENENT:
            return{...state, tenent: action.payload.tenent};
        case Actions.SET_SHIPPING_ADDRESS:
            return{...state, shippingAddress: action.payload.shippingAddress};
        case Actions.SET_SHIPPING_PRICE:
            return{...state, shippingPrice: action.payload.shippingPrice};
        default: return state;
    }

}