const Forum = require('../DataClasses/forum.js').default;

export default class ForumListUpdater {
    database = null;

    tmpForums = [];

    constructor() {
      this.database = firebaseApp.database;
    }

    /**
     * Add a set of API returns to the temp forum list in anticipation of the atomic rewrite of the entire thing.
     * @param forumBatch
     * @private
     */
    _addAPIForumsToList(forumBatch) {
      for (const forum in forumBatch) {
        this.tmpForums.push(forumBatch[forum]);
      }
    }

    reloadForums(force) {
      if (force) {
        this._getForumsPagesRecursive(1);
      }
    }

    /**
     * Persist forum list to cache and replace the Redux store version with the new list.
     * @private
     */
    _persistForums() {
      console.log('Persisting forums', this.tmpForums);

      const updateId = Math.random();

      for (const key in this.tmpForums) {
        const f = this.tmpForums[key];
        const tmpForum = new Forum(f.id, f.title, f.body, updateId);
        firebaseApp.database().ref(`forums/list/${f.id}`).set(tmpForum);
      }

      firebaseApp.database().ref('forums/meta').set({ lastFullUpdate: new Date().toISOString(), id: updateId });

      this.tmpForums = [];
    }

    _getForumsPagesRecursive(page, maxPages = 999) {
      const uri = `/forums?page=${page}`;

      api.makeApiGetCall(uri).then((data) => {
        this._addAPIForumsToList(data.data);

        if (data.data.length == 0 || page >= maxPages) {
          this._persistForums();
        } else {
          this._getForumsPagesRecursive(page + 1);
        }
      });
    }

    getForumInfo(id) {
      return new Promise((resolve, reject) => {
        const uri = `/forums/${id}`;

        api.makeApiGetCall(uri).then((data) => {
          resolve(data.data);
        }).catch(err => reject(err));
      });
    }
}
