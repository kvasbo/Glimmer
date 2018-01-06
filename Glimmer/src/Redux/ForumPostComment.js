import { cloneDeep, filter } from 'lodash';
import { FORUMPOST_COMMENTS_ADD } from '../constants';

const initialState = [];

function ForumPostComment(state = initialState, action) {
  switch (action.type) {
    case FORUMPOST_COMMENTS_ADD: {
      // Create a copy
      let newCommentsState = cloneDeep(state);

      // Remove existing posts for that page!
      newCommentsState = filter(newCommentsState, (c) => {
        if (c.postId === action.postId && c.page === action.page) return false;
        return true;
      });

      const outState = newCommentsState.concat(action.comments);
      // Return
      return outState;
    }
    default: {
      return state;
    }
  }
}

export default ForumPostComment;
