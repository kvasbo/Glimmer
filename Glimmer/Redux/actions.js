import {ADD_POST_FAVORITES, FORUMLIST_REPLACE, KRETS_ADD_PERSON, ADD_POST_STREAM, FORUMLIST_ADD_FORUM} from "./constants";

export function replaceForumList(forums) {
    return {
        type: FORUMLIST_REPLACE,
        forums
    }
}

export function addForumToList(forum)
{
    return {
        type: FORUMLIST_ADD_FORUM,
        forum
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
export function addStreamPost(post) {
    return {
        type: ADD_POST_STREAM,
        post
    }
}