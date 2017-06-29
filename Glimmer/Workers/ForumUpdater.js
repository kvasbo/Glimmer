import {AsyncStorage} from "react-native";
import {addFavoritesPost, addStreamPost, replaceForumList} from "../Redux/actions";
const config = require("../config.js");

export default class ForumUpdater {

    lastpage_favs = 0;
    lastpage_stream = 0;

    tmpForums = [];

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

                //var tmpArr = this.favPosts.posts.concat(fetchedPosts);

                /*For the record, how to sort
                 tmpArr.sort(
                 function (x, y) {
                 xd = new Date(x.bulletin.updated_at);
                 yd = new Date(y.bulletin.updated_at);
                 return yd - xd;
                 }
                 );
                 */

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

            fetchedPosts.sort(
                function (x, y) {
                    xd = new Date(x.created_at);
                    yd = new Date(y.created_at);
                    return yd - xd;
                }
            );

            for (key in fetchedPosts) {
                store.dispatch(addStreamPost(fetchedPosts[key]));
            }

        });

    }

    /**
     * Init forums from storage and trigger a reload if they are too old (or we force it).
     * @param force
     * @returns {Promise}
     */
    initForums(force) {

        return new Promise((resolve, reject) => {

            AsyncStorage.getItem('@Cache:forumList', (err, result) => {
                if (!err && result !== null) {

                    var resultP = JSON.parse(result);

                    //Full replace in store
                    if (typeof resultP.data.forums === "object") {
                        console.log("Replacing forum list in Redux store with cached data");
                        store.dispatch(replaceForumList(resultP.data.forums));
                        console.log("Restored store", store.getState());
                    }

                    var now = new Date();

                    if (force || now - resultP.time < (1000 * 60 * 60 * 24 * 14)) {
                        console.log("Forum cache too old, loading from API");
                        this._getForumsPagesRecursive(1);
                    }

                }
                else {
                    console.log("No forum cache found, loading from API");
                    this._getForumsPagesRecursive(1);
                }

                resolve(true);

            });
        })
    }

    /**
     * Add a set of API returns to the temp forum list in anticipation of the atomic rewrite of the entire thing.
     * @param forumBatch
     * @private
     */
    _addAPIForumsToList(forumBatch) {
        for (forum in forumBatch) {

            this.tmpForums.push(forumBatch[forum]);
        }
    }

    /**
     * Persist forum list to cache and replace the Redux store version with the new list.
     * @private
     */
    _persistForums() {
        console.log("Persisting forums");

        store.dispatch(replaceForumList(this.tmpForums));

        this.tmpForums = [];

        var data = {time: new Date(), data: store.getState().ForumList};

        AsyncStorage.setItem('@Cache:forumList', JSON.stringify(data)).then((error, result) => {

            console.log("Current redux list", store.getState().ForumList);

            AsyncStorage.getItem('@Cache:forumList', (err, result) => {
                console.log("Current store list", JSON.parse(result).data);
            })

        });
    }

    _getForumsPagesRecursive(page, maxPages = 999) {

        var uri = "/forums?page=" + page;

        api.makeApiGetCall(uri).then((data) => {

            this._addAPIForumsToList(data.data);

            if (data.data.length == 0 || page >= maxPages) {
                this._persistForums();
            }
            else {
                this._getForumsPagesRecursive(page + 1);
            }
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

}