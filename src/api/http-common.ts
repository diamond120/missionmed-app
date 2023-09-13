import axios from 'axios';
import {BASE_URL} from "../config/app-config";

const http =  axios.create({
  //baseURL: process.env.API_URL,
  baseURL: BASE_URL,
  headers: {
    "Content-type": "application/json"
  }
});

export default http;
