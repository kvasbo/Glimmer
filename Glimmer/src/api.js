/**
 * Created by kvasbo on 31.05.2017.
 */
import React from "react";
const config = require("../config.js");

export default class glimmerAPI {

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

        var url = config.base_url + kall + "?" + data;

        return new Promise((resolve, reject) => {
            this.makeApiCall(url, "POST").then((data) => {
                resolve(data);
            }).catch((error) => {
                reject(error);
            })
        })

    }

    /**
     * Make Get call to the API.
     * @param kall
     * @returns {Promise}
     */
    makeApiGetCall(kall) {

        var url = config.base_url + kall;

        return new Promise((resolve, reject) => {
            this.makeApiCall(url, "GET").then((data) => {
                resolve(data);
            }).catch((error) => {
                reject(error);
            })
        })
    }

    /**
     * Perform an actual API call
     * @param url
     * @param type
     * @returns {Promise}
     */
    makeApiCall(url, type) {

        return new Promise((resolve, reject) => {

            auth.getToken().then((token) => {

                fetch(url, {method: type, headers: {"Authorization": "Bearer " + token}}).then((response) => {

                    //All is fine
                    if (response.ok === true) {
                        response.json().then((data) => {
                            resolve(data);
                        }).catch((error) => {
                            console.log("JSON error", error);
                            helpers.log("JSON error", error.toString());
                            reject(error);
                        })

                    }
                    else if (response.status === 403) {

                        console.log("API Rejected, token not accepted");
                        helpers.log("API Rejected, token not accepted", url);
                        reject(Error("Token not accepted"));
                    }
                    else {
                        console.log("API unhandled", response);
                        helpers.log("API unhandled error", url)
                        reject(Error("API Unhandled error"));
                    }

                }).catch((error) => {
                    console.log("Fetch error", error);
                    helpers.log("Fetch error", error.toString());
                    reject(error);
                })

            }).catch((error) => {
                console.log("Getkey error", error);
                helpers.log("Getkey error", error.toString());
                reject(error);
            })

        });
    }
}