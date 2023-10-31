import http from "../http-common";
import {getToken} from "../../common/common.js";

// const getStudentMockInterviews = (customConfig={}) => {
//   const token = `Bearer ${getToken()}`;
//   const headerConfig = {
//     headers:{
//       'Authorization': token
//     }
//   }
//   return http.get(`/student/interview-details`, {...headerConfig,...customConfig });
// };

const updateMockInterviewData = (data,customConfig={}) => {
  const token = `Bearer ${getToken()}`;
  const headerConfig = {
    headers:{
      'Authorization': token
    }
  }
  return http.post(`/interview-data`,data, {...headerConfig,...customConfig });
};



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

// const rescheduleInterview = (data) => {
//   const token = `Bearer ${getToken()}`;
//   const config = {
//     headers:{
//       'Authorization': token
//     },
//   }
//   return http.post(`/student/reschedule-interview`, data, config);
// }


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
  // getStudentMockInterviews,
  updateMockInterviewData,
  getInterviewSummary,
  bookInterview,
  // rescheduleInterview,
  getTutorMockInterviews
};

export default Service;
