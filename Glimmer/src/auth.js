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

        if (__DEV__) {
            console.log("Auth.init: Start");
        }

        return new Promise((resolve, reject) => {
            //Check token
            this.getToken().then((data) => {

                if (__DEV__) {
                    console.log("Auth.init: Got a token!", data);
                }

                this.token = data;
                resolve();


            }).catch((error) => {
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

                    if (__DEV__) {
                        console.log("Storetoken", query);
                    }

                    let password = query.access_token;

                    Keychain
                        .setInternetCredentials(server, username, password)
                        .then(() => {
                            console.log("Token stored");
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
                    //console.log("GetToken", credentials.password);
                    resolve(credentials.password);
                }).catch((err) => {
                reject("No password stored");
            });

        })

    }

    /** Test if we are connected **/
    checkAuth() {

        return new Promise((resolve, reject) => {

            api.makeApiGetCall("/users/current").then((data) => {
                console.log("CheckAuth Fine. Commencing startup");
                resolve(data);
            }).catch((error) => {
                console.log("Error, doing auth", error);
                reject("Key not valid");
            })

        })
    }


}