/**
 * Created by kvasbo on 31.05.2017.
 */
import React from "react";
import {Linking} from "react-native";
import * as Keychain from "react-native-keychain";

const shittyQs = require("shitty-qs");

const config = require("../config.js");

const server = 'http://underskog.no';
const username = 'underskogbruker';

export default class glimmerAuth {

    token = "";

    init() {

        return new Promise((resolve, reject) => {
            //Check token
            this.getToken().then((data) => {

                if (__DEV__) {
                    console.log("Got a token!", data);
                }

                this.token = data;
                resolve();


            }).catch((error) => {
                console.log("No token found");
            })
        })


    }

    doUnderskogOauth() {

        const app_key = config.app_key;
        const state = Math.random() + '';

        const callBack = this.storeToken;

        const oauthUrl = [
            "https://underskog.no/oauth/authorize",
            "?response_type=token",
            "&client_id=" + app_key,
            "&redirect_uri=glimmer://foo",
            "&state=" + state,
        ].join("");

        console.log("Oauth URL", oauthUrl);

        Linking.addEventListener("url", handleUrl);

        function handleUrl(event) {
            const [, query_string] = event.url.match(/\#(.*)/);
            const query = shittyQs(query_string);

            //Check that it's the same call as we made.
            if (state === query.state) {
                callBack(query)
            }

            Linking.removeEventListener("url", handleUrl);
        }

        Linking.openURL(oauthUrl);

    }

    getToken() {

        return new Promise((resolve, reject) => {

            Keychain
                .getInternetCredentials(server)
                .then(function (credentials) {
                    resolve(credentials.password);
                }).catch((err) => {
                reject("No password stored");
            });

        })

    }

    storeToken(query) {

        if (__DEV__) {
            console.log("Storetoken", query);
        }

        let password = query.access_token;

        Keychain
            .setInternetCredentials(server, username, password)
            .then(function () {
                console.log("Token stored");
            });
    }

    /** Test if we are connected **/
    checkAuth() {

        return new Promise((resolve, reject) => {

            api.makeApiGetCall("/users/current").then((data) => {
                console.log("CheckAuth Fine. Commencing startup");
                resolve(data);
            }).catch((error) => {
                console.log("Error, doing auth", error);
                this.doUnderskogOauth();
                reject("Key not valid");
            })

        })
    }


}