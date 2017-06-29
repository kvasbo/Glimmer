/**
 * Created by kvasbo on 31.05.2017.
 */
import React from "react";
import {Linking} from "react-native";
import * as Keychain from "react-native-keychain";
import {setLoginStatus} from "../Redux/actions";

const shittyQs = require("shitty-qs");

const config = require("../config.js");

const server = 'http://underskog.no';
const username = 'underskogbruker';

global.log = [];

export default class glimmerAuth {

    currentUser = null;

    init() {

        return new Promise((resolve, reject) => {
            //Check token
            this.getToken().then((data) => {

                console.log("Auth.init: Got a token!", data);

                store.dispatch(setLoginStatus(true));

                resolve();

            }).catch((error) => {

                store.dispatch(setLoginStatus(false));

                console.log("Auth.init: No token found");
                reject("No token found")

            })
        })

    }

    doUnderskogOauth() {

        return new Promise((resolve, reject) => {

            const app_key = config.app_key;
            const state = Math.random() + '';

            //const callBack = this.storeToken;

            const oauthUrl = ["https://underskog.no/oauth/authorize", "?response_type=token", "&client_id=" + app_key, "&redirect_uri=glimmer://foo", "&state=" + state,].join("");

            console.log("Oauth URL", oauthUrl);

            helpers.log("Oauth URL", oauthUrl);

            Linking.addEventListener("url", handleUrl);

            function handleUrl(event) {
                const [, query_string] = event.url.match(/\#(.*)/);
                const query = shittyQs(query_string);

                helpers.log("Mottatt handleurl event")

                //Check that it's the same call as we made.
                if (state === query.state) {

                    if (__DEV__) {
                        console.log("Storetoken", query);
                    }

                    let password = query.access_token;

                    /*
                     AsyncStorage.setItem('token', password).then(()=>{
                     resolve(password);
                     });
                     */

                    Keychain
                    .setInternetCredentials(server, username, password)
                    .then(() => {
                        console.log("Token stored");

                        global.store.dispatch(setLoginStatus(true));

                        resolve(password);
                    });

                }

                Linking.removeEventListener("url", handleUrl);
            }

            Linking.openURL(oauthUrl);

        });

    }

    getToken() {

        return new Promise((resolve, reject) => {

            Keychain
            .getInternetCredentials(server)
            .then((credentials) => {
                if (credentials) {
                    if (__DEV__) {
                        console.log("Credentials found", credentials.server, credentials.username, credentials.password.substring(0, 5));
                    }
                    resolve(credentials.password);
                }
                else {
                    console.log("Credentials not found");
                    reject("No token found");
                }

            }).catch((err) => {
                reject("Unknown error retreiving token");
            });

        })

    }

    /** Test if we are connected **/
    checkAuth() {

        return new Promise((resolve, reject) => {

            api.makeApiGetCall("/users/current").then((data) => {
                this.currentUser = data.data;

                if (__DEV__) {
                    console.log("Current User", this.currentUser);
                }
                store.dispatch(setLoginStatus(true));
                resolve(data);
            }).catch((error) => {
                if (__DEV__) {
                    console.log("Error, doing auth", error);
                }
                store.dispatch(setLoginStatus(false));
                reject("Key not valid");
            })

        })
    }

}