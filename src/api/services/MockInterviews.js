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

const updateMockInterviewAgenda = (data,customConfig={}) => {
  const token = `Bearer ${getToken()}`;
  const headerConfig = {
    headers:{
      'Authorization': token
    }
  }
  return http.post(`/student/interview-details`,data, {...headerConfig,...customConfig });
};

const getInterviewSummary = (mockInterviewId) => {
  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    },
    params: {
      mockinterviewId:mockInterviewId,
    }
  }
  return http.get(`/student/interview-summary`,config);
}

const Service = {
  getStudentMockInterviews,
  updateMockInterviewAgenda,
  getInterviewSummary
};

export default Service;