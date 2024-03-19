import { Dispatch, ReactNode } from "react";
import { Tenent } from "../../types/Tenent"

export type DataType = {
    tenent: Tenent | null;
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
    
    SET_TENENT
}