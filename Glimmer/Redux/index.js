import {combineReducers} from "redux";
import ForumFavorite from "./ForumFavorite";
import ForumList from "./ForumList";
import Krets from "./Krets";
import ForumStream from "./ForumStream"
import MessageRecipients from "./MessageRecipients";

const glimmerReducers = combineReducers({

    ForumFavorite,
    ForumStream,
    ForumList,
    Krets,
    MessageRecipients

})

export default glimmerReducers