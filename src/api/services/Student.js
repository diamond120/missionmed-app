import http from "~/api/http-common";

const getProfile = () => {
  return http.get(`/student/profile`);
};

const updateProfile = (data) => {
  return http.post(`/student/update`, data);
};

const updateAppInfo = (data) => {
  return http.post(`/student/update/application_info`, data);
};

const Service = {
  getProfile,
  updateProfile,
  updateAppInfo
};

export default Service;