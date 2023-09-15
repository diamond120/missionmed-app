import http from "../http-common";
import {getToken} from "../../common/common.js";
//import ITutorialData from "../types/Tutorial";


const getProfile = () => {
  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    }
  }
  return http.get(`/student/profile`, config);
};

const updateProfile = (data) => {
  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    }
  }
  return http.post(`/student/update`, data, config);
};

const updateAppInfo = (data) => {
  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    }
  }
  return http.post(`/student/update/application_info`, data, config);
};

const Service = {
  getProfile,
  updateProfile,
  updateAppInfo
};

export default Service;