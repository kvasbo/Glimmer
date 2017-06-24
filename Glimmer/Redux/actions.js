import {ADD_POST_FAVORITES, FORUMLIST_REPLACE, KRETS_ADD_PERSON} from "./constants";

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

export function addKretsPerson(person) {
    return {
        type: KRETS_ADD_PERSON,
        person
    }
}