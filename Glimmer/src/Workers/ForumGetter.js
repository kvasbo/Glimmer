export default class ForumGetter {

    getPost(id)
    {
        return new Promise((resolve, reject) => {

            let posts = store.getState().ForumPosts;

            if(typeof posts[id] !== "undefined")
            {
                resolve(posts[id]);
            }
            else
            {
                arbeidsMaur.forumUpdater.getPost(id).then((data) => {
                    resolve(data);
                }).catch((err) => reject(err));
            }

        })

    }


}
