import {ADD_POST_FAVORITES, FORUMLIST_REPLACE} from "./constants";

export function addForumFavorite(post) {
    return {
        type: ADD_POST_FAVORITES,
        post
    }
}

export function replaceForumList(forumList) {
    return {
        type: FORUMLIST_REPLACE,
        forumList
    }
}