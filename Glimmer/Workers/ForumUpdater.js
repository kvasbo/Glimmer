import {
    AsyncStorage
} from 'react-native';

export default class ForumUpdater {

    nextPage = null;

    constructor() {

    }

    getFromCache() {
        AsyncStorage.getItem('@Cache:latestStream', (err, result) => {
            if (!err && result !== null) {
                var resultP = JSON.parse(result);
                console.log(resultP);
                //this.setState({posts: resultP.data, paging: resultP.paging})
                return resultP.data;
            }
            else {
                console.log("no forum cache found");
            }
        });
    }

    getPosts(callback) {
        var uri = "/streams/posts";

        auth.makeApiGetCall("/streams/posts", (data) => {

            console.log("data:", data);

            try {
                AsyncStorage.setItem('@Cache:latestStream', JSON.stringify(data));
            } catch (error) {
                console.log("error saving data to cache.")
            }

            callback({success: true, name: "forside", data: data.data});

            // this.setState({posts:data.data,  paging: data.paging});
        })
    }

    update(callback) {
        this.getPosts(callback);
    }

}