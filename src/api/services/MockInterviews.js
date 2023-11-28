import http from "../http-common";
import { getToken } from "../../common/common.js";

const getInterviewSummary = (mockInterviewId) => {
  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    },
    params: {
      mockInterviewId:mockInterviewId,
    }
  }
  return http.get(`/interview-summary`,config);
}

const bookInterview = (data) => {
  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    },
  }
  return http.post(`/student/book-interview`, data, config);
}

const getTutorMockInterviews = (customConfig={}) => {
  const token = `Bearer ${getToken()}`;
  const headerConfig = {
    headers:{
      'Authorization': token
    }
  }
  return http.get(`/tutor/session-details`, {...headerConfig,...customConfig });
}; 

const Service = {
  getInterviewSummary,
  bookInterview,
  getTutorMockInterviews
};

export default Service;
