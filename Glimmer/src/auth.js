/**
 * Created by kvasbo on 31.05.2017.
 */
import React from "react";
import {AsyncStorage, Linking} from "react-native";

const shittyQs = require("shitty-qs");

const config = require("../config.js");

export default class glimmerAuth {

    doUnderskogOauth() {
        var app_key = config.app_key;

        return new Promise((resolve, reject) => {

            Linking.openURL([
                "https://underskog.no/oauth/authorize",
                "?response_type=token",
                "&client_id=" + app_key,
                "&redirect_uri=glimmer://foo"
            ].join(""));

            Linking.addEventListener("url", handleUrl.bind(this))

            function handleUrl(event) {
                var [, query_string] = event.url.match(/\#(.*)/);
                var query = shittyQs(query_string);
                resolve(null, query.access_token);
                Linking.removeEventListener("url", handleUrl);
            }
        })
    }

    underskogOauth(app_key, callback) {
        Linking.openURL([
            "https://underskog.no/oauth/authorize",
            "?response_type=token",
            "&client_id=" + app_key,
            "&redirect_uri=glimmer://foo"
        ].join(""));

        Linking.addEventListener("url", handleUrl.bind(this))

        function handleUrl(event) {
            var [, query_string] = event.url.match(/\#(.*)/);
            var query = shittyQs(query_string);
            callback(null, query.access_token, this);
            Linking.removeEventListener("url", handleUrl);
        }
    }

    async handleAuthResponse(x, token, thiis) {

        //thiis.setState({token:token});
        console.log(x, token);

        try {
            await AsyncStorage.setItem('@Glimmer:token', token);
        } catch (error) {
            console.log(error);
        }

        thiis.makeApiGetCall("/streams/posts", function (data) {
            console.log(data)
        });
    }

    /** Test if we are connected **/
    checkAuth() {

        return new Promise((resolve, reject) => {

            api.makeApiGetCall("/users/current").then((data) => {
                resolve(data);
            }).catch((error) => {
                this.doUnderskogOauth();
            })

        })
    }


}