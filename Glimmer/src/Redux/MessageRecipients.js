import {MESSAGE_RECIPIENTS_ADD_PERSON, MESSAGE_RECIPIENTS_CLEAR, MESSAGE_RECIPIENTS_REMOVE_PERSON} from "./constants";

const initialState = {
    recipients: []
}

function MessageRecipients(state = initialState, action) {

    switch (action.type) {
        case MESSAGE_RECIPIENTS_CLEAR:

            return initialState

        case MESSAGE_RECIPIENTS_ADD_PERSON:

            var addId = action.id;

            var newState = Object.assign({}, state);

            if(newState.recipients.indexOf(addId) === -1)
            {
                newState.recipients.push(addId);
            }

            return newState;

        case MESSAGE_RECIPIENTS_REMOVE_PERSON:

            var removeId = action.id;

            return {
                ...state,
                recipients: [...state.recipients.filter(item => removeId !== item)]
            }

        default:
            return state
    }

}

export default MessageRecipients