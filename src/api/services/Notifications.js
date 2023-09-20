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


const getUnreadNotificationCount = (customConfig, data={}) => {
  const token = `Bearer ${getToken()}`;
  const headerConfig = {
    headers:{
      'Authorization': token
    }
  }
  return http.post(`/notification/unread`, data,{...headerConfig,...customConfig });
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

const update = (data) => {
  const token = `Bearer ${getToken()}`;
  const headerConfig = {
    headers:{
      'Authorization': token
    }
  }
  return http.post(`/notification/update`, data, headerConfig);
};


const Service = {
  get,
  deleteNotification,
  update,
  getUnreadNotificationCount
};

export default Service;