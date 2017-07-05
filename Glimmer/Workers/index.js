/**
 * Created by kvasbo on 31.05.2017.
 */
import React from "react";

import ForumUpdater from "./ForumUpdater";
import ForumListUpdater from "./ForumListUpdater";
import KretsUpdater from "./KretsUpdater";
import UserUpdater from "./UserUpdater";
import MessageUpdater from "./MessageUpdater";

const config = require("../config.js");

export default class Workers {

    constructor() {
        this.forumUpdater = new ForumUpdater();
        this.forumListUpdater = new ForumListUpdater();
        this.kretsUpdater = new KretsUpdater();
        this.userUpdater = new UserUpdater();
        this.messageUpdater = new MessageUpdater();
    }

    initData() {

        var first = [this.forumUpdater.loadFirstFavorites(1), this.forumUpdater.loadFirstStream(1), this.messageUpdater.updateMessageThreads(1)];

        Promise.all(first).then(() => {

            this.kretsUpdater.initKrets(false);

            this.forumListUpdater.reloadForums(false);

        })

        //setInterval(this.refreshForumData(), config.interval_forumrefresh * 1000);

    }

    refreshForumData() {
        if (__DEV__) {
            console.log("Refreshing forum data");
        }
        this.forumUpdater.loadFirstFavorites(1);
        this.forumUpdater.loadFirstStream(1);
    }

}