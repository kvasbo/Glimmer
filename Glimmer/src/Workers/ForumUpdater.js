import {
  addEventBatch,
  addFavoritesPostBatch,
  addForumPostComments,
  addPostBatch,
  addStreamPostBatch,
  addUnreadPostBatch,
} from '../Redux/actions';

const ForumPost = require('../DataClasses/post').default;
const ForumEvent = require('../DataClasses/event').default;
const ForumPostComment = require('../DataClasses/postComment').default;


export default class ForumUpdater {
    lastpage_favs = 0;
    lastpage_stream = 0;
    lastpage_unread = 0;

    // Do the API lifting
    loadPosts(type, page = 1) {
      return new Promise((resolve, reject) => {
        let uri = null;

        if (type === 'favorites') uri = '/streams/starred?page=';
        else if (type === 'unread') uri = '/streams/unread?page=';
        else if (type === 'stream') uri = '/streams/posts?page=';
        else reject('No stream selected');

        uri += page;

        api.makeApiGetCall(uri).then((data) => {
          resolve(data);
        }).catch((error) => {
          reject(error);
        });
      });
    }

    parseAPIForumPost(f) {
      try {
        return new ForumPost(
          f.id, f.title, f.body, f.comment_count, f.created_at,
          f.follower_count, f.following, f.kudos, f.tags, f.updated_at, f.view_count,
          f.creator.name, f.creator.id, f.creator.image_url, f.forum.id, f.forum.title, f.body_textile, f.unread_comment_count,
        );
      } catch (err) {
        console.log('Error parsing forum post', err);
        return null;
      }
    }

    parseAPIEvent(f) {
      try {
        return new ForumEvent(
          f.id, f.title, f.body, f.private, f.time, f.canceled, f.venue.city, f.venue, f.comment_count, f.created_at,
          f.follower_count, f.following, f.tags, f.updated_at,
          f.creator.name, f.creator.id, f.creator.image_url, f.body_textile, f.unread_comment_count,
        );
      } catch (err) {
        console.log('Error parsing event', err);
        return null;
      }
    }

    loadPost(id) {
      return new Promise((resolve, reject) => {
        const uri = `/posts/${id}`;

        api.makeApiGetCall(uri).then((data) => {
          const tmpPosts = [];

          try {
            const p = this.parseAPIForumPost(data.data);

            tmpPosts.push(p);

            store.dispatch(addPostBatch(tmpPosts));

            resolve(p);
          } catch (error) {
            // Could not parse, oh well.
          }
        }).catch((err) => {
          reject(err);
        });
      });
    }

    async followPost(postId) {
      const uri = `/posts/${postId}/follow`;
      const result = await api.makeApiPostCall(uri);
      return result.message;
    }

    async unfollowPost(postId) {
      const uri = `/posts/${postId}/unfollow`;
      const result = await api.makeApiPostCall(uri);
      return result.message;
    }

    async followEvent(postId) {
      const uri = `/events/${postId}/follow`;
      const result = await api.makeApiPostCall(uri);
      return result.message;
    }

    async unfollowEvent(postId) {
      const uri = `/events/${postId}/unfollow`;
      const result = await api.makeApiPostCall(uri);
      return result.message;
    }

    loadFirstFavorites(depth = 5) {
      return this.addFavorites(1, depth, true);
    }

    addPagesToFavorites(numberOfPages) {
      this.addFavorites(this.lastpage_favs + 1, numberOfPages);
    }

    addFavorites(from = 1, depth = 5, flush = false) {
      return new Promise((resolve, reject) => {
        const proms = [];

        // Get promises for all
        for (let i = from; i < depth + from; i++) {
          const p = this.loadPosts('favorites', i);
          proms.push(p);
        }

        // Resolve all the promises! This is nice. And needs some error handling I guess.
        Promise.all(proms).then((values) => {
          let fetchedPosts = [];

          for (var key in values) {
            fetchedPosts = fetchedPosts.concat(values[key].data);
          }

          const tmpPosts = [];
          const tmpEvents = [];
          const tmpAll = [];

          for (key in fetchedPosts) {
            try {
              if (typeof fetchedPosts[key].bulletin !== 'undefined') {
                const p = this.parseAPIForumPost(fetchedPosts[key].bulletin);

                if (p !== null) {
                  tmpPosts.push(p);
                  tmpAll.push(p);
                }
              } else if (typeof fetchedPosts[key].event !== 'undefined') {
                const tmpE = this.parseAPIEvent(fetchedPosts[key].event);
                if (tmpE !== null) {
                  tmpEvents.push(tmpE);
                  tmpAll.push(tmpE);
                }
              }
            } catch (error) {
              // Could not parse, oh well.
            }
          }

          store.dispatch(addFavoritesPostBatch(tmpAll, flush));

          if (tmpPosts.length > 0) store.dispatch(addPostBatch(tmpPosts));
          if (tmpEvents.length > 0) store.dispatch(addEventBatch(tmpEvents));

          this.lastpage_favs = from + depth - 1;

          resolve();
        }).catch(err => reject(err));
      });
    }

    loadFirstUnread() {
      return this.addUnread(1, 1, true);
    }

    addUnread(from = 1, depth = 5, flush = false) {
      return new Promise((resolve, reject) => {
        const proms = [];

        // Get promises for all
        for (let i = from; i < depth + from; i++) {
          const p = this.loadPosts('unread', i);
          proms.push(p);
        }

        // Resolve all the promises! This is nice. And needs some error handling I guess.
        Promise.all(proms).then((values) => {
          let fetchedPosts = [];

          for (var key in values) {
            fetchedPosts = fetchedPosts.concat(values[key].data);
          }

          const tmpPosts = [];
          const tmpEvents = [];
          const tmpAll = [];

          for (key in fetchedPosts) {
            try {
              if (typeof fetchedPosts[key].bulletin !== 'undefined') {
                const p = this.parseAPIForumPost(fetchedPosts[key].bulletin);
                if (p !== null) {
                  tmpPosts.push(p);
                  tmpAll.push(p);
                }
              } else if (typeof fetchedPosts[key].event !== 'undefined') {
                const tmpE = this.parseAPIEvent(fetchedPosts[key].event);
                if (tmpE !== null) {
                  tmpEvents.push(tmpE);
                  tmpAll.push(tmpE);
                }
              }
            } catch (error) {
              // Could not parse, oh well.
            }
          }

          store.dispatch(addUnreadPostBatch(tmpAll, flush));

          if (tmpPosts.length > 0) store.dispatch(addPostBatch(tmpPosts));
          if (tmpEvents.length > 0) store.dispatch(addEventBatch(tmpEvents));

          this.lastpage_unread = from + depth - 1;

          resolve();
        }).catch(err => reject(err));
      });
    }

    loadFirstStream(depth = 5) {
      return this.addStream(1, depth, true);
    }

    addPagesToStream(numberOfPages) {
      this.addStream(this.lastpage_stream + 1, numberOfPages);
    }

    addStream(from = 1, depth = 5, flush = false) {
      return new Promise((resolve, reject) => {
        const proms = [];

        // Get promises for all
        for (let i = from; i < depth + from; i++) {
          const p = this.loadPosts('stream', i);
          proms.push(p);
        }

        // Resolve all the promises! This is nice. And needs some error handling I guess.
        Promise.all(proms).then((values) => {
          let fetchedPosts = [];

          for (const key in values) {
            fetchedPosts = fetchedPosts.concat(values[key].data);
          }

          fetchedPosts = global.helpers.arrayUnique(fetchedPosts);

          const tmpPosts = [];

          for (const key in fetchedPosts) {
            try {
              const p = this.parseAPIForumPost(fetchedPosts[key]);

              tmpPosts.push(p);
            } catch (error) {
              // Could not parse, oh well.
            }
          }

          store.dispatch(addStreamPostBatch(tmpPosts, flush));
          store.dispatch(addPostBatch(tmpPosts));

          this.lastpage_stream = from + depth - 1;

          resolve();
        }).catch((err) => {
          reject(err);
        });
      });
    }

    loadCommentsForPost(postId, page = 1, event = false) {
      return new Promise((resolve, reject) => {
        if (event) {
          var uri = `/events/${postId}/comments?page=${page}`;
        } else {
          var uri = `/posts/${postId}/comments?page=${page}`;
        }

        api.makeApiGetCall(uri).then((data) => {
          const comments = [];
          for (const key in data.data) {
            try {
              const d = data.data[key];
              const tmpC = new ForumPostComment(d.id, postId, d.body, d.created_at, d.kudos, d.updated_at, d.creator.name, d.creator.id, d.creator.image_url, d.body_textile);
              comments.push(tmpC);
            } catch (err) {

            }
          }

          store.dispatch(addForumPostComments(postId, page, comments));

          resolve(comments);
        }).catch((err) => {
          reject(err);
        });
      });
    }

    /**
     * Post a new comment in a thread
     * @param comment
     * @param thread
     * @returns {Promise}
     */
    postCommentInThread(comment, thread) {
      console.log('Posting comment in thread', thread, comment);

      return new Promise((resolve, reject) => {
        const postBody = { comment: { body: comment } };
        const url = `/posts/${thread}/comments`;

        api.makeApiPostCall(url, {}, postBody).then((data) => {
          console.log('Post success', data);
          resolve(data);
        }).catch((err) => {
          console.log('Post error', err);
          reject(err);
        });
      });
    }

    /**
     * Post a new comment in a thread
     * @param comment
     * @param thread
     * @returns {Promise}
     */
    postNewThread(forum, title, body, tags = []) {
      console.log('Posting new post to forum', forum, title, body);

      return new Promise((resolve, reject) => {
        const postBody = {
          post: {
            body, title, tags, forum_id: forum,
          },
        };
        const url = '/posts';

        api.makeApiPostCall(url, {}, postBody).then((data) => {
          console.log('Post success', data);
          resolve(data);
        }).catch((err) => {
          console.log('Post error', err);
          reject(err);
        });
      });
    }

    markThreadAsRead(postId, event = false) {
      if (event) {
        var uri = `/events/${postId}/mark_read`;
      } else {
        var uri = `/posts/${postId}/mark_read`;
      }

      return new Promise((resolve, reject) => {
        api.makeApiPostCall(uri).then(() => {
          resolve();
        }).catch((err) => {
          reject(err);
        });
      });
    }

    markEventAsRead(eventId) {
      const uri = `/events/${eventId}/mark_read`;

      return new Promise((resolve, reject) => {
        api.makeApiPostCall(uri).then(() => {
          resolve();
        }).catch((err) => {
          reject(err);
        });
      });
    }

    editPostComment(commentId, body) {
      return new Promise((resolve, reject) => {
        const theBody = { comment: { body } };

        const uri = `/comments/${commentId}`;

        api.makeApiPutCall(uri, {}, theBody).then((data) => {
          resolve(data);
        }).catch(err => reject(err));
      });
    }

    giveKudosToPost(postId) {
      return new Promise((resolve, reject) => {
        const uri = `/posts/${postId}/kudos`;

        api.makeApiPostCall(uri).then((data) => {
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
    }

    giveKudosToComment(commentId) {
      return new Promise((resolve, reject) => {
        const uri = `/comments/${commentId}/kudos`;

        api.makeApiPostCall(uri).then((data) => {
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
    }
}
