import {APPCONTROL_USER_LOGIN} from "./constants";

const initialState = {
    loggedIn: false
}

function AppStatus(state = initialState, action) {

    switch (action.type) {

        case APPCONTROL_USER_LOGIN:

            var s = Object.assign(state);

            s.loggedIn = action.status;

            console.log("Set login status", s);

            return s;

        default:
            return state
    }

}

export default AppStatus