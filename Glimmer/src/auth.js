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
        var state = Math.random() + '';

        var oauthUrl = [
            "https://underskog.no/oauth/authorize",
            "?response_type=token",
            "&client_id=" + app_key,
            "&redirect_uri=glimmer://foo",
            "&state="+state,
        ].join("");

        console.log("Oauth URL", oauthUrl);

        Linking.addEventListener("url", handleUrl);

        function handleUrl(event) {
            var [, query_string] = event.url.match(/\#(.*)/);
            var query = shittyQs(query_string);
            console.log(query);
            //resolve(null, query.access_token);
            Linking.removeEventListener("url", handleUrl);
        }

        Linking.openURL(oauthUrl);

    }

    /*
    underskogOauth(app_key, callback) {

        var state = Math.random() + '';

        var oauthUrl = [
            "https://underskog.no/oauth/authorize",
            "?response_type=token",
            "&client_id=" + app_key,
            "&redirect_uri=glimmer://foo",
            "&state=${state}"
        ].join("");

        console.log("Oauth URL", oauthUrl);

        Linking.openURL(oauthUrl);

        Linking.addEventListener("url", handleUrl.bind(this))

        function handleUrl(event) {
            var [, query_string] = event.url.match(/\#(.*)/);
            var query = shittyQs(query_string);

            console.log(query);

            callback(null, query.access_token, this);
            Linking.removeEventListener("url", handleUrl);
        }
    }
    */

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
                console.log("CheckAuth Fine. Commencing startup");
                resolve(data);
            }).catch((error) => {
                console.log("Error, doing auth", error);
                this.doUnderskogOauth();
            })

        })
    }


}