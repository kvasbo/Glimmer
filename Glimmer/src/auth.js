/**
 * Created by kvasbo on 31.05.2017.
 */
import React from "react";
import {AsyncStorage, Linking} from "react-native";

const shittyQs = require("shitty-qs");

const config = require("../config.js");

export default class glimmerAuth {

    baseURL = "https://underskog.no/api/v1";

    token = config.dev_token;

    loggedInUserName = "kvasbo"; //TODO TODOTDO
    loggedInUserId = 6619; //TODO TODOTDO

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
    testAuth(callBack) {
        this.makeApiGetCall("/users/current", function (data, status) {

            //TODO fikse om man ikke er logga inn
            console.log("Tester om bruker er innlogga", data, status);
            global.loggedInUserName = data.name;
            callBack(data);

        })
    }

    /**
     * Payload is an object. Yes it is. key:value becomes &key=value; urlencoded.
     * @param call
     * @param payload
     * @param callback
     */
    makeApiPostCall(kall, payload) {

        var data = "";
        for (element in payload) {
            var tempStr = encodeURIComponent(element) + "=" + encodeURIComponent(payload[element]) + "&"
            data += tempStr;
        }

        var url = this.baseURL + kall + "?" + data;

        if (__DEV__) {
            console.log("API POST", url);
        }

        return new Promise((resolve, reject) => {

            fetch(
                url,
                {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + this.token
                    }
                }
            ).then((response) => response.json())
                .then((responseJson) => {
                    resolve(responseJson);
                })
                .catch((error) => {
                    console.log(error);
                    reject(Error(error));
                });

        })
    }

    makeApiGetCall(kall) {
        var url = this.baseURL + kall;

        if (__DEV__) {
            console.log("API GET", url);
        }

        return new Promise((resolve, reject) => {
            fetch(
                url,
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + this.token
                    }
                }
            ).then((response) => response.json())
                .then((responseJson) => {
                    resolve(responseJson);
                })
                .catch((error) => {
                    console.log(error);
                    reject(Error(error));
                });
        })
    }
}