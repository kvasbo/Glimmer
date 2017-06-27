import {ADD_POST_FAVORITES, FORUMLIST_REPLACE, KRETS_ADD_PERSON, ADD_POST_STREAM} from "./constants";

export function replaceForumList(forumList) {
    return {
        type: FORUMLIST_REPLACE,
        forumList
    }
}

export function addKretsPerson(person) {
    return {
        type: KRETS_ADD_PERSON,
        person
    }
}

export function addFavoritesPost(post) {
    return {
        type: ADD_POST_FAVORITES,
        post
    }
}