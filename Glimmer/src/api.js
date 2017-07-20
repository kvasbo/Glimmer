/**
 * Created by kvasbo on 31.05.2017.
 */
import React from "react";
var FormData = require('form-data');
const config = require("../config.js");

export default class glimmerAPI {

    /**
     * Payload is an object. Yes it is. key:value becomes &key=value; urlencoded.
     * @param call
     * @param payload
     * @param callback
     */
    makeApiPostCall(kall, payload = null, body = null) {

        var data = "";

        for (let element in payload) {
            var tempStr = encodeURIComponent(element) + "=" + encodeURIComponent(payload[element]) + "&"
            data += tempStr;
        }

        var theContent = JSON.stringify(body);

        var url = config.base_url + kall + "?" + data;

        return new Promise((resolve, reject) => {
            this.makeApiCall(url, "POST", theContent).then((data) => {
                resolve(data);
            }).catch((error) => {
                reject(error);
            })
        })

    }

    /**
     * Payload is an object. Yes it is. key:value becomes &key=value; urlencoded.
     * @param call
     * @param payload
     * @param callback
     */
    makeApiPutCall(kall, payload = null, body = null) {

        var data = "";

        for (let element in payload) {
            var tempStr = encodeURIComponent(element) + "=" + encodeURIComponent(payload[element]) + "&"
            data += tempStr;
        }

        var theContent = JSON.stringify(body);

        var url = config.base_url + kall;

        if(payload !== null) url += "?" + data;

        return new Promise((resolve, reject) => {
            this.makeApiCall(url, "PUT", theContent).then((data) => {
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
    makeApiCall(url, type, body = null) {

        return new Promise((resolve, reject) => {

            const start = new Date();

            auth.getToken().then((token) => {

                fetch(url, {
                    method: type,
                    body: body,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'User-Agent': 'glimmer',
                        "Authorization": "Bearer " + token
                    }
                }).then((response) => {

                    //All is fine
                    if (response.ok === true) {

                        //JSON
                        if(response.headers.get("content-type").indexOf("application/json") !== -1)
                        {
                            response.json().then((data) => {

                                if (__DEV__) {
                                    const end = new Date();
                                    console.log("API OK", type, url, end - start);
                                }
                                resolve(data);

                            }).catch((error) => {
                                console.log("JSON error", error);

                                resolve("API OK, but could not parse JSON.");
                            })
                        }
                        else if(response.headers.get("content-type").indexOf("image") !== -1)
                        {
                            let url = response.url;
                            resolve(url);
                        }
                        else
                        {
                            resolve("API OK, but could not parse JSON.");
                        }



                    }
                    else if (response.status === 403) {

                        response.json().then((data) => {
                            console.log("API Rejected, token not accepted", data);

                            reject(Error("API Rejected, token, " + data.error.body));
                        })

                        reject(Error("Token not accepted"));
                    }
                    else if (response.status === 400) {

                        response.json().then((data) => {
                            console.log("API Rejected, validation error", data.error.body);
                            reject(Error("API Rejected, validation, " + data.error.body));
                        })

                    }
                    else if (response.status === 500) {

                        response.text().then((data) => {
                            console.log("Internal server error", data);
                            reject("Internal server error");
                        })

                    }
                    else {

                        response.text().then((data) => {
                            console.log("Unhandled server error", data, url, type);
                            reject("Unhandled server error");
                        })
                    }

                }).catch((error) => {
                    console.log("Fetch error", error);

                    reject(error);
                })

            }).catch((error) => {
                console.log("Getkey error", error);
                reject(error);
            })

        });
    }
}