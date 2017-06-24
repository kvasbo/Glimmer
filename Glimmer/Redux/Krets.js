import {KRETS_ADD_PERSON} from "./constants";

const initialState = {
    persons: []
}

function Krets(state = initialState, action) {
    switch (action.type) {
        case KRETS_ADD_PERSON:
            return Object.assign({}, state, {
                persons: [
                    ...state.persons,
                    {
                        data: action.person.data
                    }
                ]
            })
        default:
            return state
    }

}

export default Krets