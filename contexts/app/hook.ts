import { useContext } from "react";
import { AppContext } from "."
import { Tenent } from "../../types/Tenent";
import { Actions } from "./types";
import { Address } from "../../types/Address";


export const useAppContext = () => {

    const { state, dispatch} = useContext(AppContext);

    return {
        ...state,
        setTenent: (tenent: Tenent) => {
            dispatch({
                type: Actions.SET_TENENT,
                payload: { tenent }
            });
        },
        setShippingAddress: (shippingAddress: Address) => {
            dispatch({
                type: Actions.SET_SHIPPING_ADDRESS,
                payload: { shippingAddress }
            });
        },
        setShippingPrice: (shippingPrice: number) => {
            dispatch({
                type: Actions.SET_SHIPPING_PRICE,
                payload: { shippingPrice }
            });
        }
    }

}