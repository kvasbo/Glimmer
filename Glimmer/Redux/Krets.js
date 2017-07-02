import {KRETS_ADD_PERSON} from "./constants";

const initialState = [];

function Krets(state = initialState, action) {

    switch (action.type) {

        case KRETS_ADD_PERSON:

            var newState = [...state, action.id]

            return newState;

        default:
            return state
    }

}

export default Krets