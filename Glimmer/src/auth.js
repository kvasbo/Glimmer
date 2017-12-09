/**
 * Created by kvasbo on 31.05.2017.
 */

import {Linking} from "react-native";
import * as Keychain from "react-native-keychain";
import {setLoginStatus, setActiveUserId, setToken} from "./Redux/actions";


const shittyQs = require("shitty-qs");

const config = require("../config.js");

const server = 'http://underskog.no';
const username = 'underskogbruker';

global.log = [];

export default class glimmerAuth {

    token = null;

    /** Test if we are connected **/
    checkAuth() {

        return new Promise((resolve, reject) => {

            api.makeApiGetCall("/users/current").then((data) => {

                store.dispatch(setActiveUserId(data.data.id));
                store.dispatch(setLoginStatus(true));

                this.getToken().then((token) => {
                    store.dispatch(setToken(token));
                    this.token = token;
                })

                resolve("Logged in");

            }).catch((error) => {

                if (__DEV__) {
                    console.log("Error, doing auth", error);
                }
                store.dispatch(setLoginStatus(false));
                resolve("Key not valid, logging in");
            })

        })
    }

    logOut = async () => {
        await Keychain.resetInternetCredentials(server);
        store.dispatch(setLoginStatus(false));
    }


    doUnderskogOauth() {

        return new Promise((resolve, reject) => {

            const app_key = config.app_key;
            const state = Math.random() + '';

            //const callBack = this.storeToken;

            const oauthUrl = ["https://underskog.no/oauth/authorize", "?response_type=token", "&client_id=" + app_key, "&redirect_uri=glimmer://foo", "&state=" + state,].join("");

            console.log("Oauth URL", oauthUrl);

            Linking.addEventListener("url", handleUrl);

            function handleUrl(event) {
                const [, query_string] = event.url.match(/#(.*)/);
                const query = shittyQs(query_string);

                helpers.log("Mottatt handleurl event")

                //Check that it's the same call as we made.
                if (state === query.state) {

                    if (__DEV__) {
                        console.log("Storetoken", query);
                    }

                    var password = query.access_token;

                    Keychain
                    .setInternetCredentials(server, username, password)
                    .then(() => {

                        api.makeApiGetCall("/users/current").then((data) => {

                            store.dispatch(setActiveUserId(data.data.id));
                            store.dispatch(setLoginStatus(true));
                            store.dispatch(setToken(password));
                            this.token = password;

                            resolve();

                        }).catch((error) => {

                            store.dispatch(setLoginStatus(false));
                            reject("All new key not valid. That sucks a lot.");
                        })

                    });

                }

                Linking.removeEventListener("url", handleUrl);
            }

            global.SafariView.show({ url: oauthUrl });

            //Linking.openURL(oauthUrl);

        });

    }

    getToken() {

        return new Promise((resolve, reject) => {

            Keychain
            .getInternetCredentials(server)
            .then((credentials) => {
                if (credentials) {
                    resolve(credentials.password);
                }
                else {
                    reject("No token found");
                }

            }).catch((err) => {
                reject("Unknown error retreiving token");
            });

        })

    }

}