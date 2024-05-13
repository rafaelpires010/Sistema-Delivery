import { Dispatch, ReactNode } from "react";
import { Tenent } from "../../types/Tenent"
import { Address } from "../../types/Address";

export type DataType = {
    tenent: Tenent | null;
    shippingAddress: Address | null;
    shippingPrice: number;
}

export type Actiontype = {
    type: Actions; 
    payload?: any; 
}

export type ContextType = {
    state: DataType;
    dispatch: Dispatch<Actiontype>;
}

export type ProviderType = {
    children: ReactNode
}

export enum Actions {
    
    SET_TENENT,
    SET_SHIPPING_ADDRESS,
    SET_SHIPPING_PRICE
}