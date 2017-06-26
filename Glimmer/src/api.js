/**
 * Created by kvasbo on 31.05.2017.
 */
import React from "react";
const config = require("../config.js");
//const token = config.dev_token;

export default class glimmerAPI {

    baseURL = "https://underskog.no/api/v1";

    makeRawApiCall(url, type = "GET") {

        if (__DEV__) {
            var start = new Date();
            //var startTime = start.getSeconds() +  ":" + start.getMilliseconds();
            //console.log("API Call", type, url);
        }

        return new Promise((resolve, reject) => {

            auth.getToken().then((data) => {
                this.makeRawApiCallWithToken(url, type, data).then((data) => {
                    var end = new Date();
                    console.log("API time", url, end-start);
                    resolve(data);
                }).catch((err) => {
                    if (__DEV__) {
                        console.log("makeRawApiCall error", err);
                    }
                    reject(err);
                });
            });
        });

    }

    makeRawApiCallWithToken(url, type, token) {

        if (__DEV__) {
           // var start = new Date();
           // var startTime = start.getSeconds() +  ":" + start.getMilliseconds();
           // console.log("Raw API Call", startTime, type, url, token);
        }

        return new Promise((resolve, reject) => {

            fetch(
                url,
                {
                    method: type,
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }
            ).then((response) => {

                if (response.ok === true) {
                    if (__DEV__) {
                        //console.log("API OK", response);
                    }
                    return response.json();
                }
                else if (response.status === 403) {

                    console.log("API Rejected, token not accepted");
                    reject(Error("Token not accepted"));
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