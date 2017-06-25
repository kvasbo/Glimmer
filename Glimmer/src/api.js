/**
 * Created by kvasbo on 31.05.2017.
 */
import React from "react";
const config = require("../config.js");
//const token = config.dev_token;

export default class glimmerAPI {

    token = "";
    token = config.dev_token;

    baseURL = "https://underskog.no/api/v1";

    //loggedInUserName = "kvasbo"; //TODO TODOTDO
    loggedInUserId = 6619; //TODO TODOTDO

    makeRawApiCall(url, type = "GET") {

        if (__DEV__) {
            console.log("API Call", type, url);
        }

        return new Promise((resolve, reject) => {

            fetch(
                url,
                {
                    method: type,
                    headers: {
                        "Authorization": "Bearer " + this.token
                    }
                }
            ).then((response) => {

                if (response.ok === true) {
                    if(__DEV__)
                    {
                        console.log("API OK", response);
                    }
                    return response.json();
                }
                else if (response.status === 403) {
                    console.log("API Rejected, no token");
                    reject(Error("No token"));
                }
                else {
                    console.log("API unhandled", response);
                    reject(Error("API Unhandled error"));
                }
            }).then((responseJson) => {
                resolve(responseJson);
            }).catch((error) => {
                if (__DEV__) {
                    console.log("API error", error);
                }
                reject(Error(error));
            });

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

        return this.makeRawApiCall(url, "POST");

    }

    makeApiGetCall(kall) {

        var url = this.baseURL + kall;

        return this.makeRawApiCall(url, "GET");

    }
}