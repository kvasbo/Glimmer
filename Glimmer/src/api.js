/**
 * Created by kvasbo on 31.05.2017.
 */
import React from "react";
import {AsyncStorage, Linking} from "react-native";

const shittyQs = require("shitty-qs");

const config = require("../config.js");
const token = config.dev_token;

export default class glimmerAPI {

    baseURL = "https://underskog.no/api/v1";

    token = config.dev_token;

    loggedInUserName = "kvasbo"; //TODO TODOTDO
    loggedInUserId = 6619; //TODO TODOTDO

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