import http from "../http-common";

const login = (data) => {
  return http.post("/commonlogin", data);
};

const Service = {
  login
};

export default Service;