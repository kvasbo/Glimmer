import {
    ADD_POST_FAVORITES,
    ADD_POST_STREAM,
    ADD_POST_FAVORITES_BATCH,
    ADD_POST_STREAM_BATCH,
    APPCONTROL_USER_LOGIN,
    FORUMLIST_ADD_FORUM,
    FORUMLIST_REPLACE,
    KRETS_ADD_PERSON,
    MESSAGE_RECIPIENTS_ADD_PERSON,
    MESSAGE_RECIPIENTS_CLEAR,
    MESSAGE_RECIPIENTS_REMOVE_PERSON,
    FORUMPOST_COMMENT_ADD,
    USERS_ADD_USER,
    MESSAGE_CONVERSATION_ADD,
    MESSAGE_CONVERSATON_ADD_BATCH
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

/**
 * Just an ID
 * @param id
 * @returns {{type, id: *}}
 */
export function addKretsPerson(id) {
    return {
        type: KRETS_ADD_PERSON,
        id
    }
}

export function addFavoritesPostBatch(posts) {
    return {
        type: ADD_POST_FAVORITES_BATCH,
        posts
    }
}


export function addStreamPostBatch(posts) {
    return {
        type: ADD_POST_STREAM_BATCH,
        posts
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

export function clearMessageRecipients() {
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

export function addForumPostComment(postId, comment) {
    return {
        type: FORUMPOST_COMMENT_ADD,
        postId,
        comment
    }
}

export function addUser(user) {
    return {
        type: USERS_ADD_USER,
        user
    }
}

export function addConversation(conversation) {
    return {
        type: MESSAGE_CONVERSATION_ADD,
        conversation
    }
}

export function addConversationBatch(conversations) {
    return {
        type: MESSAGE_CONVERSATON_ADD_BATCH,
        conversations
    }
}