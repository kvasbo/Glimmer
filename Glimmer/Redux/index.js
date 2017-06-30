import {combineReducers} from "redux";
import ForumFavorite from "./ForumFavorite";
import ForumList from "./ForumList";
import Krets from "./Krets";
import ForumStream from "./ForumStream";
import MessageRecipients from "./MessageRecipients";
import AppStatus from "./AppStatus";
import ForumPostComment from "./ForumPostComment"

const glimmerReducers = combineReducers({

    ForumFavorite,
    ForumStream,
    ForumList,
    Krets,
    MessageRecipients,
    AppStatus,
    ForumPostComment

})

export default glimmerReducers