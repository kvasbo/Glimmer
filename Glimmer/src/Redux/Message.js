import { MESSAGE_MESSAGES_ADD_BATCH } from '../constants';

function Message(state = {}, action) {
  switch (action.type) {
    case MESSAGE_MESSAGES_ADD_BATCH:

      // Create a copy of the state
      var newState = Object.assign({}, state);
      var id = action.userId;

      if (typeof newState[id] === 'undefined') newState[id] = {};

      for (let i = 0; i < action.messages.length; i++) {
        // Create new object entry.
        newState[id][action.messages[i].id] = action.messages[i];
      }
      return newState;

    default:
      return state;
  }
}

export default Message;
