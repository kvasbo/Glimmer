import {addFavoritesPostBatch, addStreamPostBatch, addForumPostComments} from "../Redux/actions";
const ForumPost = require("../DataClasses/post").default;
const ForumPostComment = require("../DataClasses/postComment").default;
const config = require("../config.js");

export default class ForumUpdater {

    lastpage_favs = 0;
    lastpage_stream = 0;

    constructor() {

    }

    //Do the API lifting
    loadPosts(favorites = false, page = 1) {
        var uri = "/streams/posts?page=";
        if (favorites) uri = "/streams/starred?page=";

        uri += page;

        return new Promise((resolve, reject) => {

            api.makeApiGetCall(uri).then((data) => {

                resolve(data);

            }).catch((error) => {
                reject(error);
            });

        });
    }

    loadFirstFavorites(depth = 5) {
        return this.addFavorites(1, depth);
    }

    addPagesToFavorites(numberOfPages) {
        if (__DEV__) {
            console.log("Add pages to favorites", numberOfPages);
        }

        this.addFavorites(this.lastpage_favs + 1, numberOfPages);
    }

    addFavorites(from = 1, depth = 5) {

        return new Promise((resolve, reject) => {

            var proms = [];

            //Get promises for all
            for (var i = from; i < depth + from; i++) {
                var p = this.loadPosts(true, i);
                proms.push(p);
            }

            //Resolve all the promises! This is nice. And needs some error handling I guess.
            Promise.all(proms).then(values => {

                var fetchedPosts = [];

                for (key in values) {
                    fetchedPosts = fetchedPosts.concat(values[key].data);
                }

                var tmpPosts = [];

                for (key in fetchedPosts) {

                    var f = fetchedPosts[key].bulletin;

                    try {

                        var p = new ForumPost(f.id, f.title, f.body, f.comment_count, f.created_at,
                            f.follower_count, f.following, f.kudos, f.tags, f.updated_at, f.view_count,
                            f.creator.name, f.creator.id, f.creator.image_url, f.forum.id, f.forum.title);

                        tmpPosts.push(p);
                    }
                    catch (error) {
                        //Could not parse, oh well.
                    }
                }

                global.store.dispatch(addFavoritesPostBatch(tmpPosts));

                this.lastpage_favs = from + depth - 1;

                resolve();

            });

        });

    }

    loadFirstStream(depth = 5) {
        return this.addStream(1, depth);
    }

    addPagesToStream(numberOfPages) {

        if (__DEV__) {
            console.log("Add pages to stream", numberOfPages);
        }

        this.addStream(this.lastpage_stream + 1, numberOfPages);
    }

    addStream(from = 1, depth = 5) {

        return new Promise((resolve, reject) => {

            var proms = [];

            //Get promises for all
            for (var i = from; i < depth + from; i++) {
                var p = this.loadPosts(false, i);
                proms.push(p);
            }

            //Resolve all the promises! This is nice. And needs some error handling I guess.
            Promise.all(proms).then(values => {

                var fetchedPosts = [];

                for (key in values) {

                    fetchedPosts = fetchedPosts.concat(values[key].data);
                }

                fetchedPosts = global.helpers.arrayUnique(fetchedPosts);

                var tmpPosts = [];

                for (key in fetchedPosts) {

                    var f = fetchedPosts[key];

                    try {

                        var p = new ForumPost(f.id, f.title, f.body, f.comment_count, f.created_at,
                            f.follower_count, f.following, f.kudos, f.tags, f.updated_at, f.view_count,
                            f.creator.name, f.creator.id, f.creator.image_url, f.forum.id, f.forum.title);

                        tmpPosts.push(p);
                    }
                    catch (error) {
                        //Could not parse, oh well.
                    }

                }

                store.dispatch(addStreamPostBatch(tmpPosts));

                this.lastpage_stream = from + depth - 1;

                resolve()

            }).catch((err) => {
                reject(err);
            });

        });

    }

    loadCommentsForPost(postId, page = 1) {
        return new Promise((resolve, reject) => {

            var uri = "/posts/" + postId + "/comments?page=" + page;

            api.makeApiGetCall(uri).then((data) => {

                var comments = [];
                for (key in data.data) {

                    try {
                        let d = data.data[key];
                        let tmpC = new ForumPostComment(d.id, postId, d.body, d.created_at, d.kudos, d.updated_at, d.creator.name, d.creator.id, d.creator.image_url);
                        comments.push(tmpC);
                    }
                    catch (err) {
                        console.log(err);
                    }
                }

                store.dispatch(addForumPostComments(postId, page, comments));

                resolve(data.data);

            }).catch((err) => {
                reject(err)
            });

        })
    }

    /**
     * Post a new comment in a thread
     * @param comment
     * @param thread
     * @returns {Promise}
     */
    postCommentInThread(comment, thread) {

        console.log("Posting comment in thread", thread, comment);

        return new Promise((resolve, reject) => {
            var postBody = {"comment": {"body": comment}};
            var url = "/posts/" + thread + "/comments";

            api.makeApiPostCall(url, {}, postBody).then((data) => {
                console.log("Post success", data);
                resolve(data);
            }).catch((err) => {
                console.log("Post error", err);
                reject(err);
            });

        })

    }

    /**
     * Post a new comment in a thread
     * @param comment
     * @param thread
     * @returns {Promise}
     */
    postNewThread(forum, title, body, tags = []) {

        console.log("Posting new post to forum", forum, title, body);

        return new Promise((resolve, reject) => {

            const postBody = {"post": {"body": body, "title": title, "tags": tags, "forum_id": forum}};
            const url = "/posts";

            api.makeApiPostCall(url, {}, postBody).then((data) => {
                console.log("Post success", data);
                resolve(data);
            }).catch((err) => {
                console.log("Post error", err);
                reject(err);
            });

        })

    }

    giveKudosToPost(postId) {

        return new Promise((resolve, reject) => {

            const uri = "/posts/" + postId + "/kudos";

            api.makeApiPostCall(uri).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            })

        })

    }

    giveKudosToComment(commentId) {

        return new Promise((resolve, reject) => {

            const uri = "/comments/" + commentId + "/kudos";

            api.makeApiPostCall(uri).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            })

        })

    }

}