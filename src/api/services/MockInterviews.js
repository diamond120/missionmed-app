import http from "../http-common";
import {getToken} from "../../common/common.js";

const getStudentMockInterviews = (customConfig={}) => {
  const token = `Bearer ${getToken()}`;
  const headerConfig = {
    headers:{
      'Authorization': token
    }
  }
  return http.get(`/student/interview-details`, {...headerConfig,...customConfig });
};


const Service = {
  getStudentMockInterviews,
};

export default Service;