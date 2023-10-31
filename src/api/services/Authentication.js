import http from "../http-common";

const login = (data) => {
  return http.post("/commonlogin", data);
};

const forgotPassword = (data) => {
  return http.post("/forgotPassword", data);
};

const changePassword = (data) => {
  return http.post("/changePassword", data);
};

const Service = {
  login,
  forgotPassword,
  changePassword
};

export default Service;