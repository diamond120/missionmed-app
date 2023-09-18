import http from "../http-common";
import {getToken} from "../../common/common.js";

const get = (customConfig) => {
  const token = `Bearer ${getToken()}`;
  const headerConfig = {
    headers:{
      'Authorization': token
    }
  }
  return http.get(`/notification/list`, {...headerConfig,...customConfig });
};

const deleteNotification = (data) => {
  const token = `Bearer ${getToken()}`;
  const headerConfig = {
    headers:{
      'Authorization': token
    }
  }
  return http.post(`/notification/delete`, data, headerConfig);
};

const Service = {
  get,
  deleteNotification
};

export default Service;