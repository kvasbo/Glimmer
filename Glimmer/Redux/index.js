import {combineReducers} from "redux";
import ForumFavorite from "./ForumFavorite";
import ForumList from "./ForumList";
import Krets from "./Krets";
import ForumStream from "./ForumStream"

const glimmerReducers = combineReducers({

    ForumFavorite,
    ForumStream,
    ForumList,
    Krets

})

export default glimmerReducers