import http from "../http-common";
import {getToken} from "../../common/common.js";
//import ITutorialData from "../types/Tutorial";

const token = `Bearer ${getToken()}`;

const config = {
  headers:{
    'Authorization': token
  }
}

const getProfile = () => {
  return http.get(`/student/profile`, config);
};

const updateProfile = (data) => {
  return http.post(`/student/update`, data, config);
};

const updateAppInfo = (data) => {
  return http.post(`/student/update/application_info`, data, config);
};

const Service = {
  getProfile,
  updateProfile,
  updateAppInfo
};

export default Service;