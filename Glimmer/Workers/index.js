/**
 * Created by kvasbo on 31.05.2017.
 */
import React, {Component} from 'react';
import {
    Linking, AsyncStorage
} from 'react-native';
import ForumUpdater from "./ForumUpdater";

const shittyQs = require("shitty-qs");

const config = require("../config.js");


export default class Workers {

    constructor()
    {
        this.forumUpdater = new ForumUpdater();
    }

}