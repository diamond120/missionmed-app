import http from "../http-common";
import {getToken} from "../../common/common.js";
//import ITutorialData from "../types/Tutorial";

const token = `Bearer ${getToken()}`;

const config = {
  headers:{
    'Authorization': token
  }
}
const getAll = () => {
  return http.get("/tutorials");
};

const getProfile = () => {
  return http.get(`/student/profile`, config);
};

// const create = (data: ITutorialData) => {
//   return httpAuth.post<ITutorialData>("/tutorials", data);
// };

// const update = (id: any, data: ITutorialData) => {
//   return httpAuth.put<any>(`/tutorials/${id}`, data);
// };

// const remove = (id: any) => {
//   return httpAuth.delete<any>(`/tutorials/${id}`);
// };

// const removeAll = () => {
//   return httpAuth.delete<any>(`/tutorials`);
// };

// const findByTitle = (title: string) => {
//   return httpAuth.get<Array<ITutorialData>>(`/tutorials?title=${title}`);
// };

const Service = {
  getAll,
  getProfile,
  // create,
  // update,
  // remove,
  // removeAll,
  // findByTitle,
};

export default Service;