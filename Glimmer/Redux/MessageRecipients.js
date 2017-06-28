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

            return {
                ...state,
                recipients: [...state.recipients, id]
            }

        case MESSAGE_RECIPIENTS_REMOVE_PERSON:

            var id = action.id;

            return {
                ...state,
                recipients: [...state.recipients.filter(item => action.payload !== item)]
            }

        default:
            return state
    }

}

export default MessageRecipients