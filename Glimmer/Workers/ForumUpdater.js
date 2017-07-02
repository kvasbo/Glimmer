import {AsyncStorage} from "react-native";
import {addFavoritesPost, addStreamPost, replaceForumList} from "../Redux/actions";

const config = require("../config.js");

export default class ForumUpdater {

    lastpage_favs = 0;
    lastpage_stream = 0;
    //database = null;

    constructor() {
        //this.database = firebaseApp.database;
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

    addFavorites(from = 1, depth = 5) {

        return new Promise((resolve, reject) => {

            var proms = [];

            //Get promises for all
            for (var i = from; i < depth + from; i++) {
                var p = this.loadPosts(true, i); //.then((data)=>{
                proms.push(p);
            }

            //Resolve all the promises! This is nice. And needs some error handling I guess.
            Promise.all(proms).then(values => {

                var fetchedPosts = [];

                for (key in values) {
                    fetchedPosts = fetchedPosts.concat(values[key].data);
                }

                for (key in fetchedPosts) {
                    global.store.dispatch(addFavoritesPost(fetchedPosts[key].bulletin));
                }

                lastpage_favs = from + depth - 1;

                resolve();

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

        this.addFavorites(lastpage_favs + 1, numberOfPages);
    }

    loadStream(depth = 5) {

        return new Promise((resolve, reject) => {

            var proms = [];

            //Get promises for all
            for (var i = 1; i < depth + 1; i++) {
                var p = this.loadPosts(false, i); //.then((data)=>{
                proms.push(p);
            }

            //Resolve all the promises! This is nice. And needs some error handling I guess.
            Promise.all(proms).then(values => {

                var fetchedPosts = [];

                for (key in values) {
                    fetchedPosts = fetchedPosts.concat(values[key].data);
                }

                fetchedPosts = global.helpers.arrayUnique(fetchedPosts);

                for (key in fetchedPosts) {
                    store.dispatch(addStreamPost(fetchedPosts[key]));
                }

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

                // console.log("Comment data", data)

                for (key in data.data) {
                    //console.log(data.data[key]);
                    //global.store.dispatch(addForumPostComment(postId, data.data[key]));
                }

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