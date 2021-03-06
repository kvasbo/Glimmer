import { MESSAGE_CONVERSATON_ADD_BATCH } from '../constants';

function Conversation(state = {}, action) {
  switch (action.type) {
    // The same as above, but takes an array of conversations.
    case MESSAGE_CONVERSATON_ADD_BATCH:

      // Create a copy of the state
      var newState = Object.assign({}, state);

      for (let i = 0; i < action.conversations.length; i++) {
        const id = action.conversations[i].user_id;
        newState[id] = action.conversations[i];
      }

      return newState;

    default:
      return state;
  }
}

export default Conversation;
