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

const getUniversityTutorList = (data) => {
  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    }
  }
  return http.post(`/university-tutors-list`, data, config);
}

const getSlotslist = (data) => {
  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    }
  }
  return http.post("/student/slots", data, config);
};

const Service = {
    getProfileStaticData,
    getUniversityList,
    getUniversityTutorList,
    getSlotslist
};

export default Service;