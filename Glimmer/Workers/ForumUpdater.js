import {
    AsyncStorage
} from 'react-native';

export default class ForumUpdater {

    forums = {};
    tmpForums = {};

    constructor() {

    }

    getFrontpageFromCache() {

        return new Promise((resolve,reject) => {

            AsyncStorage.getItem('@Cache:latestStream', (err, result) => {
                if (!err && result !== null) {
                    var resultParsed = JSON.parse(result);
                    resolve(resultParsed.data);
                }
                else {
                    resolve([]);
                }
            });

        })
    }

    getFrontPagePosts() {

        var uri = "/streams/posts";

        return new Promise((resolve, reject) => {

            auth.makeApiGetCall("/streams/posts").then((data) => {

                //console.log("data:", data);

                try {
                    AsyncStorage.setItem('@Cache:latestStream', JSON.stringify(data));
                } catch (error) {
                    console.log("error saving data to cache.")
                }

                out = {success: true, name: "forside", data: data.data}

                resolve(out);

            })

        })
    }


    getFavoritePostsRecursive(depth)
    {

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

        function addForum(forum) {
            return {
                type: ADD_FORUM,
                forum
            }
        }

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
            function(x, y)
            {
                return x.title.localeCompare(y.title);
            }
        );

        if (__DEV__) {
            // console.log("getForumArray", out);
        }

        return out;
    }

    update(callback) {
        this.getPosts(callback);
    }

}