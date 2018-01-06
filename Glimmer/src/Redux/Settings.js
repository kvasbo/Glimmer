import {
  SETTINGS_REFRESH,
} from '../constants';

const initialState = {
};

function Settings(state = initialState, action) {
  switch (action.type) {
    case SETTINGS_REFRESH:
      return action.settings;

    default:
      return state;
  }
}

export default Settings;
