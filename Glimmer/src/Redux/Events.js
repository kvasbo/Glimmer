import {ADD_EVENT_BATCH} from "../constants";

function Events(state = {}, action) {
    switch (action.type) {

        case ADD_EVENT_BATCH:

            var newState = Object.assign({}, state);

            for (let i = 0; i < action.events.length; i++) {
                newState[action.events[i].id] = action.events[i];
            }

            return newState;

        default:
            return state
    }

}

export default Events