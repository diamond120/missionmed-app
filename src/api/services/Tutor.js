import http from "../http-common";
import {getToken} from "../../common/common.js";
//import ITutorialData from "../types/Tutorial";

const getProfile = () => {
  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    }
  }
  return http.get(`/tutor/profile`, config);
};

const updateProfile = (data) => {
  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    }
  }
  return http.post(`/tutor/update`, data, config);
};


const sessionRate = (data) => {
  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    }
  }
  return http.post(`/tutor/sessionrate`, data, config);
};

// const getAll = () => {
//   return http.get("/tutorials");
// };

// const get = (id: any) => {
//   return http.get<ITutorialData>(`/tutorials/${id}`);
// };

// const create = (data: ITutorialData) => {
//   return http.post<ITutorialData>("/tutorials", data);
// };

// const update = (id: any, data: ITutorialData) => {
//   return http.put<any>(`/tutorials/${id}`, data);
// };

// const remove = (id: any) => {
//   return http.delete<any>(`/tutorials/${id}`);
// };

// const removeAll = () => {
//   return http.delete<any>(`/tutorials`);
// };

// const findByTitle = (title: string) => {
//   return http.get<Array<ITutorialData>>(`/tutorials?title=${title}`);
// };

const lessionTypes = () => {
  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    }
  }
  return http.get(`/lessiontypes`, config);
};

const Service = {
  getProfile,
  updateProfile,
  sessionRate,
  lessionTypes
};

export default Service;