/**
 * Created by kvasbo on 31.05.2017.
 */
import React from 'react';

const FormData = require('form-data');
const config = require('../config.js');

export default class glimmerAPI {
  /**
   * Payload is an object. Yes it is. key:value becomes &key=value; urlencoded.
   * @param call
   * @param payload
   * @param callback
   */
  async makeApiPostCall(kall, payload = null, body = null) {
    let data = '';
    for (const element in payload) {
      const tempStr = `${encodeURIComponent(element)}=${encodeURIComponent(payload[element])}&`;
      data += tempStr;
    }
    const theContent = JSON.stringify(body);
    const url = `${config.base_url + kall}?${data}`;
    const reply = await makeApiCall(url, 'POST', theContent);
    return reply;
  }

  /**
   * Payload is an object. Yes it is. key:value becomes &key=value; urlencoded.
   * @param call
   * @param payload
   * @param callback
   */
  async makeApiPutCall(kall, payload = null, body = null) {
    let data = '';
    for (const element in payload) {
      const tempStr = `${encodeURIComponent(element)}=${encodeURIComponent(payload[element])}&`;
      data += tempStr;
    }
    const putBody = JSON.stringify(body);
    let url = config.base_url + kall;
    if (payload !== null) url += `?${data}`;

    const reply = makeApiCall(url, 'PUT', putBody);
    return reply;
  }

  getLog = {};

  /**
   * Make Get call to the API.
   * @param kall
   * @returns {Promise}
   */
  async makeApiGetCall(kall) {
    const url = config.base_url + kall;
    const data = await makeApiCall(url, 'GET');

    if (__DEV__) {
      if (!this.getLog[kall]) {
        this.getLog[kall] = { count: 0, lastCall: undefined };
      }
      this.getLog[kall].count = this.getLog[kall].count + 1;
      this.getLog[kall].lastCall = new Date().toLocaleTimeString();
      console.groupCollapsed('API Getlog');
      console.table(this.getLog, ['count', 'lastCall']);
      console.groupEnd();
    }

    return data;
  }
}

/**
 * Perform an actual API call
 * @param url
 * @param type
 * @returns {Promise}
 */
async function makeApiCall(url, type, body = null) {
  const start = new Date();
  const token = await auth.getToken();
  const response = await fetch(url, {
    method: type,
    body,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'glimmer',
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok === true) {
    // JSON
    if (response.headers.get('content-type').indexOf('application/json') !== -1) {
      try {
        const data = await response.json();
        if (__DEV__) {
          const end = new Date();
          console.log('API OK', type, url, end - start);
        }
        return (data);
      } catch (error) {
        console.log('JSON error', error);
        throw new Error('API OK, but could not parse JSON.');
      }
    } else if (response.headers.get('content-type').indexOf('image') !== -1) {
      const url = response.url;
      return url;
    } else {
      throw new Error('API OK, but could not parse JSON.');
    }
  } else {
    console.log('Error', response);
    throw new Error('API ERROR', response.status);
  }
}
