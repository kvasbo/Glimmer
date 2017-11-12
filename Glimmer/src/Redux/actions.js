import {
    ADD_POST_FAVORITES_BATCH,
    ADD_POST_STREAM_BATCH,
    APPCONTROL_SET_ACTIVE_POSTING_FORUM,
    APPCONTROL_SET_CURRENT_USER,
    APPCONTROL_USER_LOGIN,
    APPCONTROL_SET_CURRENT_TOKEN,
    FORUMLIST_ADD_FORUM,
    FORUMLIST_REPLACE,
    FORUMPOST_COMMENTS_ADD,
    FORUMPOST_COMMENTS_SET_ACTIVE_PAGE,
    KRETS_ADD_PERSON_BATCH,
    MESSAGE_CONVERSATON_ADD_BATCH,
    MESSAGE_RECIPIENTS_ADD_PERSON,
    MESSAGE_RECIPIENTS_CLEAR,
    MESSAGE_RECIPIENTS_REMOVE_PERSON,
    MESSAGE_MESSAGES_ADD_BATCH,
    USERS_ADD_USER_BATCH,
    APPCONTROL_SET_ACTIVE_POSTING_FILTER,
    ADD_POST_UNREAD_BATCH,
    ADD_POST_BATCH,
    ADD_EVENT_BATCH,
    KUDOS_ADD_BATCH,
} from "../constants";

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

export function addKretsPersonBatch(ids) {
    return {
        type: KRETS_ADD_PERSON_BATCH,
        ids
    }
}

export function addKudosBatch(kudos) {
    return {
        type: KUDOS_ADD_BATCH,
        kudos
    }
}

export function addFavoritesPostBatch(posts, replace = false) {
    return {
        type: ADD_POST_FAVORITES_BATCH,
        posts,
        replace
    }
}

export function addPostBatch(posts) {
    return {
        type: ADD_POST_BATCH,
        posts
    }
}

export function addEventBatch(events) {
    return {
        type: ADD_EVENT_BATCH,
        events
    }
}

export function addStreamPostBatch(posts, replace = false) {
    return {
        type: ADD_POST_STREAM_BATCH,
        posts,
        replace
    }
}

export function addUnreadPostBatch(posts, replace = false) {
    return {
        type: ADD_POST_UNREAD_BATCH,
        posts,
        replace
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

export function addMessageBatch(userId, messages) {
    return {
        type: MESSAGE_MESSAGES_ADD_BATCH,
        userId,
        messages
    }
}

export function setLoginStatus(status) {
    return {
        type: APPCONTROL_USER_LOGIN,
        status
    }
}

export function setToken(token) {
    return {
        type: APPCONTROL_SET_CURRENT_TOKEN,
        token
    }
}

export function addForumPostComments(postId, page, comments) {
    return {
        type: FORUMPOST_COMMENTS_ADD,
        postId,
        page,
        comments
    }
}

export function setForumPostCommentActivePage(postId, activePage) {
    return {
        type: FORUMPOST_COMMENTS_SET_ACTIVE_PAGE,
        postId,
        activePage
    }
}

export function addUserBatch(users) {
    return {
        type: USERS_ADD_USER_BATCH,
        users
    }
}

export function addConversationBatch(conversations) {
    return {
        type: MESSAGE_CONVERSATON_ADD_BATCH,
        conversations
    }
}

export function setActivePostingForum(forumId) {
    return {
        type: APPCONTROL_SET_ACTIVE_POSTING_FORUM,
        forumId
    }
}
export function setActivePostingFilter(filter) {
    return {
        type: APPCONTROL_SET_ACTIVE_POSTING_FILTER,
        filter
    }
}

export function setActiveUserId(userId) {
    return {
        type: APPCONTROL_SET_CURRENT_USER,
        userId
    }
}
