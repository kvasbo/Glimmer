import {
    ADD_POST_FAVORITES,
    ADD_POST_STREAM,
    APPCONTROL_USER_LOGIN,
    FORUMLIST_ADD_FORUM,
    FORUMLIST_REPLACE,
    KRETS_ADD_PERSON,
    MESSAGE_RECIPIENTS_ADD_PERSON,
    MESSAGE_RECIPIENTS_CLEAR,
    MESSAGE_RECIPIENTS_REMOVE_PERSON
} from "./constants";

export function replaceForumList(forums) {
    return {
        type: FORUMLIST_REPLACE,
        forums
    }
}

export function addForumToList(forum) {
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

export function addNewMessageRecipient(id) {
    return {
        type: MESSAGE_RECIPIENTS_ADD_PERSON,
        id
    }
}
export function removeNewMessageRecipient(id) {
    return {
        type: MESSAGE_RECIPIENTS_REMOVE_PERSON,
        id
    }
}

export function clearNewMessageRecipient() {
    return {
        type: MESSAGE_RECIPIENTS_CLEAR
    }
}

export function setLoginStatus(status) {
    return {
        type: APPCONTROL_USER_LOGIN,
        status
    }
}