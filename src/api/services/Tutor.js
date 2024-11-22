import http from "~/api/http-common";

const getProfile = () => {
  return http.get(`/tutor/profile`);
};

const updateProfile = (data) => {
  return http.post(`/tutor/update`, data);
};

const lessionTypes = () => {
  return http.get(`/lessiontypes`);
};

const Service = {
  getProfile,
  updateProfile,
  lessionTypes
};

export default Service;