/**
 * Created by kvasbo on 31.05.2017.
 */
import React, {Component} from 'react';
import {
    Linking, AsyncStorage
} from 'react-native';
import ForumUpdater from "./ForumUpdater";
import KretsUpdater from "./KretsUpdater";

const shittyQs = require("shitty-qs");

const config = require("../config.js");

export default class Workers {

    constructor() {
        this.forumUpdater = new ForumUpdater();
        this.kretsUpdater = new KretsUpdater();
    }

    initData() {

        var first = [this.forumUpdater.loadFirstFavorites(1), this.forumUpdater.loadStream(1)];

        Promise.all(first).then(()=>{
            this.kretsUpdater.initKrets(false);
            this.forumUpdater.initForums(false);
        })

        //setInterval(this.refreshForumData(), config.interval_forumrefresh * 1000);

    }

    refreshForumData() {
        if(__DEV__)
        {
            console.log("Refreshing forum data");
        }
        this.forumUpdater.loadFirstFavorites(1);
        this.forumUpdater.loadStream(1);
    }

}