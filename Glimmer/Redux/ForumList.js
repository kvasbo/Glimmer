import {ADD_FORUM} from "./actions";

function Forums(state = [], forum) {
    switch (forum.type) {
        case ADD_TODO:
            return [
                ...state,
                {
                    forum: action.text,
                    completed: false
                }
            ]
        default:
            return state
    }
}