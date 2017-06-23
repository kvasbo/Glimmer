import {ADD_POST_FAVORITES} from "./constants";

export function addForumFavorite(post) {
    return {
        type: ADD_POST_FAVORITES,
        post
    }
}