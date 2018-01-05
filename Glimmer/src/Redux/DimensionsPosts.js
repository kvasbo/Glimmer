/**
 * Keep track of rendered size of posts and events.
 */

import {
  DIMENSIONS_SET_POST,
} from '../constants';

function DimensionsPosts(state = {}, action) {
  switch (action.type) {
    case DIMENSIONS_SET_POST:
      const newState = Object.assign({}, state);
      newState[action.id] = action.dimensions;
      return newState;
    default:
      return state;
  }
}

export default DimensionsPosts;
