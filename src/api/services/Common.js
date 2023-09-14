import http from "../http-common";

const getProfileStaticData = (data) => {
  return http.get("/lists", data);
};

const Service = {
    getProfileStaticData
};

export default Service;