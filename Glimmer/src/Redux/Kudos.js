import _ from 'lodash';
import {KUDOS_ADD_BATCH} from "../constants";

function Kudos(state = {}, action) {

  switch (action.type) {

    case KUDOS_ADD_BATCH:
      var newState = _.clone(state);
      action.kudos.forEach((k) => {
        newState[k.uniqueId] = k;
      })
      return newState;
    default:
        return state
  }

}

export default Kudos
