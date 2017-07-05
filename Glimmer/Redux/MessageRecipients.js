import {MESSAGE_RECIPIENTS_ADD_PERSON, MESSAGE_RECIPIENTS_CLEAR, MESSAGE_RECIPIENTS_REMOVE_PERSON} from "./constants";

const initialState = {
    recipients: []
}

function MessageRecipients(state = initialState, action) {

    switch (action.type) {
        case MESSAGE_RECIPIENTS_CLEAR:

            return initialState

        case MESSAGE_RECIPIENTS_ADD_PERSON:

            var id = action.id;

            var newState = Object.assign({}, state);

            if(newState.recipients.indexOf(id) === -1)
            {
                newState.recipients.push(id);
            }

            return newState;

        case MESSAGE_RECIPIENTS_REMOVE_PERSON:

            var id = action.id;

            return {
                ...state,
                recipients: [...state.recipients.filter(item => id !== item)]
            }

        default:
            return state
    }

}

export default MessageRecipients