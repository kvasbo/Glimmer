import {
    AsyncStorage
} from 'react-native';
import {addForumFavorite} from "../Redux/actions"

export default class ForumUpdater {

    forums = {};
    tmpForums = {};

    streamPosts = {loaded: false, posts: [], lastPage: 0};
    favPosts = {loaded: false, posts: [], lastPage: 0};

    constructor() {

    }

    //Do the API lifting
    loadPosts(favorites = false, page = 1) {
        var uri = "/streams/posts?page=";
        if (favorites) uri = "/streams/starred?page=";

        uri += page;

        return new Promise((resolve, reject) => {

            auth.makeApiGetCall(uri).then((data) => {

                resolve(data);

            });

        });
    }

    addFavorites(from = 1, depth = 5) {

        var proms = [];

        //Get promises for all
        for (var i = 1; i < depth + 1; i++) {
            var p = this.loadPosts(true, i); //.then((data)=>{
            proms.push(p);
        }

        //Resolve all the promises! This is nice. And needs some error handling I guess.
        Promise.all(proms).then(values => {

            var fetchedPosts = [];

            for (key in values) {
                fetchedPosts = fetchedPosts.concat(values[key].data);
            }

            for(key in fetchedPosts)
            {
                global.store.dispatch(addForumFavorite(fetchedPosts[key].bulletin));
            }


            var tmpArr = this.favPosts.posts.concat(fetchedPosts);

            /*For the record, how to sort
            tmpArr.sort(
                function (x, y) {
                    xd = new Date(x.bulletin.updated_at);
                    yd = new Date(y.bulletin.updated_at);
                    return yd - xd;
                }
            );
            */

        });

    }

    loadFirstFavorites(depth = 5)
    {
        return this.addFavorites(1, depth);
    }

    addPagesToFavorites(numberOfPages)
    {

    }

    getStream() {
        return this.streamPosts.posts;
    }

    getFavorites() {
        return this.favPosts.posts;
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

            fetchedPosts = this.arrayUnique(fetchedPosts);

            fetchedPosts.sort(
                function (x, y) {
                    xd = new Date(x.created_at);
                    yd = new Date(y.created_at);
                    return yd - xd;
                }
            );

            this.streamPosts.posts = fetchedPosts;
            this.streamPosts.lastPage = depth;

            try {
                AsyncStorage.setItem('@Cache:frontPageFirstStart', JSON.stringify(this.streamPosts));
            } catch (error) {
                console.log("Error saving front page to cache.")
            }

            if (__DEV__) {
                console.log("Stream loaded", this.streamPosts);
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

                    this.forums = resultP.forums;

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

            this.tmpForums[forumBatch[forum].id] = forumBatch[forum];

        }

    }

    _storeForumList() {
        console.log("Storing forums to list");

        //Replace the old list.
        this.forums = this.tmpForums;
        this.tmpForums = {};

        var data = {time: new Date(), forums: this.forums};

        try {
            AsyncStorage.setItem('@Cache:forumList', JSON.stringify(data));
        } catch (error) {
            console.log("error saving forum list to cache.")
        }

    }

    _getForumsPagesRecursive(page) {
        var uri = "/forums?page=" + page;

        auth.makeApiGetCall(uri).then((data) => {

            this._addForumsToList(data.data);

            if (data.data.length == 0) {
                this._storeForumList();
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

    //Helpers
    arrayUnique(array) {
        var a = array.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j])
                    a.splice(j--, 1);
            }
        }

        return a;
    }

}