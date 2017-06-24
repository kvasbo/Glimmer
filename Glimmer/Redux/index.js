import {combineReducers} from "redux";
import ForumFavorite from "./ForumFavorite";
import ForumList from "./ForumList";
import Krets from "./Krets";

const glimmerReducers = combineReducers({

    ForumFavorite,
    ForumList,
    Krets

})

export default glimmerReducers