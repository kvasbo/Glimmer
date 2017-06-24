import {KRETS_ADD_PERSON} from "./constants";

const initialState = {
   
}

function Krets(state = initialState, action) {

    switch (action.type) {
        case KRETS_ADD_PERSON:

            let id = action.person.id;

            return Object.assign({}, state, {
                [id]: Object.assign({}, state[id], {
                    person: action.person
                })
            });

        default:
            return state
    }

}

export default Krets