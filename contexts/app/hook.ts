import { useContext } from "react";
import { AppContext } from "."
import { Tenent } from "../../types/Tenent";
import { Actions } from "./types";


export const useAppContext = () => {

    const { state, dispatch} = useContext(AppContext);

    return {
        ...state,
        setTenent: (tenent: Tenent) => {
            dispatch({
                type: Actions.SET_TENENT,
                payload: { tenent }
            });
        }
    }

}