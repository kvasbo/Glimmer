import { FORUMPOST_COMMENTS_ADD, FORUMPOST_COMMENTS_SET_ACTIVE_PAGE } from '../constants';

const initialState = {};

const initialPostState = { page: {}, activePage: 1 };

function ForumPostComment(state = initialState, action) {
  switch (action.type) {
    case FORUMPOST_COMMENTS_ADD: {
      // Create a copy
      const newCommentsState = Object.assign({}, state);

      // Ensure that we have the post id defined as an object
      if (typeof newCommentsState[action.postId] === 'undefined') {
        newCommentsState[action.postId] = initialPostState;
      }

      newCommentsState[action.postId].page[action.page] = {
        updated: new Date(),
        loading: false,
        comments: action.comments,
      };

      // Return
      return newCommentsState;
    }

    case FORUMPOST_COMMENTS_SET_ACTIVE_PAGE: {
      // Create a copy
      const newActiveState = Object.assign({}, state);

      // Ensure that we have the post id defined as an object
      if (typeof newActiveState[action.postId] === 'undefined') {
        newActiveState[action.postId] = initialPostState;
      }

      newActiveState[action.postId].page[action.page] = {
        updated: new Date(),
        loading: true,
        comments: [],
      };

      newActiveState[action.postId].activePage = action.activePage;

      // Start API Fetching the data
      global.arbeidsMaur.forumUpdater.loadCommentsForPost(action.postId, action.activePage);

      return newActiveState;
    }
    default: {
      return state;
    }
  }
}

export default ForumPostComment;
