import {KRETS_ADD_PERSON_BATCH} from "./constants";

const initialState = [];

function Krets(state = initialState, action) {

    switch (action.type) {

        case KRETS_ADD_PERSON_BATCH:

            var newState = [...state];

            for(var i=0;i<action.ids.length;i++)
            {
                if(newState.indexOf(action.ids[i]) === -1)
                {
                    newState.push(action.ids[i]);
                }
            }

            return newState;


        default:
            return state
    }

}

export default Krets