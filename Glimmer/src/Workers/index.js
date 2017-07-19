/**
 * Created by kvasbo on 31.05.2017.
 */
import ForumUpdater from "./ForumUpdater";
import ForumListUpdater from "./ForumListUpdater";
import KretsUpdater from "./KretsUpdater";
import UserUpdater from "./UserUpdater";
import MessageUpdater from "./MessageUpdater";
import ImageGetter from "./ImageGetter";

export default class Workers {

    constructor() {
        this.forumUpdater = new ForumUpdater();
        this.forumListUpdater = new ForumListUpdater();
        this.kretsUpdater = new KretsUpdater();
        this.userUpdater = new UserUpdater();
        this.messageUpdater = new MessageUpdater();
        this.imageGetter = new ImageGetter();
    }

    initData() {

        var first = [this.forumUpdater.loadFirstFavorites(1), this.forumUpdater.loadFirstStream(1), this.messageUpdater.updateMessageThreads(1)];

        Promise.all(first).then(() => {

            this.kretsUpdater.initKrets();

            this.forumListUpdater.reloadForums(false);

        })

        //setInterval(this.refreshForumData(), config.interval_forumrefresh * 1000);

    }

    refreshForumData() {
        this.forumUpdater.loadFirstFavorites(1);
        this.forumUpdater.loadFirstStream(1);
    }

}