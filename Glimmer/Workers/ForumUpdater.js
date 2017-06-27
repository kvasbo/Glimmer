import {
    AsyncStorage
} from 'react-native';
import {addFavoritesPost, addStreamPost, addForumToList} from "../Redux/actions"

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

            }).catch((error)=>{
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

        this.addFavorites(this.favPosts.lastPage + 1, numberOfPages);
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

            for(key in fetchedPosts)
            {
                store.dispatch(addStreamPost(fetchedPosts[key]));
            }

        });

    }

    initForums(force) {

        return new Promise((resolve, reject) => {

            AsyncStorage.getItem('@Cache:forumList', (err, result) => {
                if (!err && result !== null) {

                    var resultP = JSON.parse(result);

                    console.log("forums read from cache", resultP);

                    var now = new Date();

                    if (force || now - resultP.time < (1000 * 60 * 60 * 24 * 7)) {
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


    _addForumsToList(forumBatch) {

        for (forum in forumBatch) {

            store.dispatch(addForumToList(forumBatch[forum]));

        }

    }

    _getForumsPagesRecursive(page) {

        var uri = "/forums?page=" + page;

        api.makeApiGetCall(uri).then((data) => {

            this._addForumsToList(data.data);

            if (data.data.length == 0) {

            }
            else {
                this._getForumsPagesRecursive(page + 1);
            }
        })
    }

    getForumArray() {
        var out = [];

        for (key in this.forums) {
            out.push(this.forums[key]);
        }

        out.sort(
            function (x, y) {
                return x.title.localeCompare(y.title);
            }
        );

        if (__DEV__) {
            // console.log("getForumArray", out);
        }

        return out;
    }


}