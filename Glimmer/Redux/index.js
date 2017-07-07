import {combineReducers} from "redux";
import ForumFavorite from "./ForumFavorite";
import Krets from "./Krets";
import ForumStream from "./ForumStream";
import MessageRecipients from "./MessageRecipients";
import AppStatus from "./AppStatus";
import ForumPostComment from "./ForumPostComment";
import User from "./User";
import Conversation from "./Conversation";
import Message from "./Message";

const glimmerReducers = combineReducers({

    ForumFavorite,
    ForumStream,
    Krets,
    MessageRecipients,
    AppStatus,
    ForumPostComment,
    User,
    Conversation,
    Message

})

export default glimmerReducers