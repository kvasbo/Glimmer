/**
 * Created by kvasbo on 31.05.2017.
 */
import React, {Component} from 'react';
import {
    Linking,AsyncStorage
} from 'react-native';

const shittyQs = require("shitty-qs");

const config = require("../config.js");

export default class glimmerAuth {

    token = null;

    underskogOauth(app_key, callback) {
        Linking.openURL([
            "https://underskog.no/oauth/authorize",
            "?response_type=token",
            "&client_id=" + app_key,
            "&redirect_uri=glimmer://foo"
        ].join(""));

        Linking.addEventListener("url", handleUrl.bind(this))

        function handleUrl (event) {
            var [, query_string] = event.url.match(/\#(.*)/);
            var query = shittyQs(query_string);
            callback(null, query.access_token, this);
            Linking.removeEventListener("url", handleUrl);
        }
    }

    async handleAuthResponse(x, token, thiis){

        //thiis.setState({token:token});
        console.log(x,token);

        try {
            await AsyncStorage.setItem('@Glimmer:token', token);
        } catch (error) {
            console.log(error);
        }

        thiis.makeApiGetCall("/streams/posts", function(data){console.log(data)});
    }

    /** Test if we are connected **/
    testAuth(callBack)
    {
        this.makeApiGetCall("/users/current", function(data, status){

            //TODO fikse om man ikke er logga inn
            console.log("Tester om bruker er innlogga", data, status);
            callBack(data);

        })
    }

    makeApiGetCall(kall, callback)
    {
        var baseURL = "https://underskog.no/api/v1";
        var url = baseURL + kall;

        var token = config.dev_token;

        fetch(
                url,
                {
                    method: "GET",
                    headers: {
                    "Authorization": "Bearer "+token
                    }
                }
        ).then((response) => response.json())
            .then((responseJson) => {
                callback(responseJson);
            })
            .catch((error) => {
                console.error(error);
            });
    }

}