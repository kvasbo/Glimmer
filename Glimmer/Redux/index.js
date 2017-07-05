import {combineReducers} from "redux";
import ForumFavorite from "./ForumFavorite";
import Krets from "./Krets";
import ForumStream from "./ForumStream";
import MessageRecipients from "./MessageRecipients";
import AppStatus from "./AppStatus";
import ForumPostComment from "./ForumPostComment";
import User from "./User";
import Conversation from "./Conversation";

const glimmerReducers = combineReducers({

    ForumFavorite,
    ForumStream,
    Krets,
    MessageRecipients,
    AppStatus,
    ForumPostComment,
    User,
    Conversation

})

export default glimmerReducers