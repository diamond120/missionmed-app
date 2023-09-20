import http from "../http-common";

const getProfileStaticData = (data) => {
  return http.get("/lists", data);
};


const getUniversityList = (data) => {
  return http.get("/university-list", data);
};

const Service = {
    getProfileStaticData,
    getUniversityList
};

export default Service;