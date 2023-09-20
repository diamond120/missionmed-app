import http from "../http-common";
import {getToken} from "../../common/common";

const getProfileStaticData = (data) => {
  return http.get("/lists", data);
};

const getUniversityList = () => {
  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    }
  }
  return http.get("/university-list", config);
};

const Service = {
    getProfileStaticData,
    getUniversityList
};

export default Service;