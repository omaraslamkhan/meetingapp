/**
 * src/api/http.js
 */
import axios from "axios";
import qs from "qs";
import config from "../config/config";
import {BASE_URL} from '../config/productionConfig'

/**
 *
 * parse error response
 */
function parseError(messages) {
  // error
  if (messages) {
    if (messages instanceof Array) {
      return Promise.reject({ messages: messages });
    } else {
      return Promise.reject({ messages: [messages] });
    }
  } else {
    return Promise.reject({ messages: ["Service fails"] });
  }
}

/**
 * parse response
 */
function parseBody(response) {
  //  if (response.status === 200 && response.data.status.code === 200) { // - if use custom status code
  if (response.status === 200) {
    return response;
  } else {
    return this.parseError(response.data.messages);
  }
}

/**
 * axios instance
 */
let instance = axios.create({
  baseURL: `${BASE_URL}`,
  paramsSerializer: function (params) {
    return qs.stringify(params, { indices: false });
  },
});

// request header
instance.interceptors.request.use(
  (config) => {
    // Do something before request is sent

    // api tokenなどを利用してheaderに載せる場合
    // const apiToken = sessionStorage.getItem('token')
     config.headers = { userid: JSON.parse(localStorage.getItem('user')).id }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response parse
instance.interceptors.response.use(
  (response) => {
    return parseBody(response);
  },
  (error) => {
    console.warn("Error status", error.response.status);
    // return Promise.reject(error)
    if (error.response) {
      return parseError(error.response.data);
    } else {
      return Promise.reject(error);
    }
  }
);

export const http = instance;
