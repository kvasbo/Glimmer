import {MESSAGE_CONVERSATION_ADD} from "./constants";

function Conversation(state = {}, action) {
    switch (action.type) {

        case MESSAGE_CONVERSATION_ADD:

            //Create a copy of the state
            let newState = Object.assign({}, state);
            let id = action.conversation.user_id;

            newState[id] = action.conversation;

            return newState;

        default:
            return state
    }

}

export default Conversation