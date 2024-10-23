import http from "~/api/http-common";

const get = (customConfig) => {
  return http.get(`/notification/list`, {...customConfig });
};

const getUnreadNotificationCount = (customConfig, data={}) => {
  return http.post(`/notification/unread`, data,{...customConfig });
};

const deleteNotification = (data) => {
  return http.post(`/notification/delete`, data);
};

const update = (data) => {
  return http.post(`/notification/update`, data);
};

const Service = {
  get,
  deleteNotification,
  update,
  getUnreadNotificationCount
};

export default Service;