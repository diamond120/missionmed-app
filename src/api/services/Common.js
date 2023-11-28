import http from "../http-common";
import {getToken} from "../../common/common";

const getProfileStaticData = (data) => {
  return http.get("/lists", data);
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

const checkSession = (data) => {
  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    },
  }
  return http.post(`/student/check-sessions`, data, config);
}

const getAPI = (path) => {
  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    }
  }
  return http.get(path, config);
};

const postAPI = (path,data) => {
  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    }
  }
  return http.post(path, data, config);
};

const Service = {
    getProfileStaticData,
    getUniversityTutorList,
    checkSession,
    getAPI,
    postAPI
};

export default Service;