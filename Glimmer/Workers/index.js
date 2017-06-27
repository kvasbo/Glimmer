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

        this.kretsUpdater.initKrets(false);
        this.forumUpdater.initForums(true);
        this.forumUpdater.loadFirstFavorites(1);
        this.forumUpdater.loadStream(1);

        //setInterval(saveStore, 30000);
    }

}