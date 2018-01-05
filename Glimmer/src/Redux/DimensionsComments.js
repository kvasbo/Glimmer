/**
 * Keep track of rendered size of comments
 */

import {
  DIMENSIONS_SET_COMMENT,
} from '../constants';

function DimensionsComments(state = {}, action) {
  switch (action.type) {
    case DIMENSIONS_SET_COMMENT:
      let newState = Object.assign({}, state);
      newState[action.id] = action.dimensions;
      return newState;
    default:
      return state;
  }
}

export default DimensionsComments;
