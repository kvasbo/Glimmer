import {combineReducers} from "redux";
import ForumFavorite from "./ForumFavorite";
import ForumList from "./ForumList";
import Krets from "./Krets";
import ForumStream from "./ForumStream";
import MessageRecipients from "./MessageRecipients";
import AppStatus from "./AppStatus";

const glimmerReducers = combineReducers({

    ForumFavorite,
    ForumStream,
    ForumList,
    Krets,
    MessageRecipients,
    AppStatus

})

export default glimmerReducers