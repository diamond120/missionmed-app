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

const rescheduleInterview = (data) => {
  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    },
  }
  return http.post(`/student/reschedule-interview`, data, config);
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
  getStudentMockInterviews,
  updateMockInterviewData,
  getInterviewSummary,
  bookInterview,
  rescheduleInterview,
  getTutorMockInterviews
};

export default Service;

// {
//   "success": true,
//   "status_code": 200,
//   "message": "Interview Reschedule Successfully",
//   "data": {
//       "id": 1,
//       "tutor_id": 1,
//       "student_id": 1,
//       "university": "The University of Melbourne",
//       "mock_interview": "Mock Interview#2",
//       "date": "2023-09-28",
//       "session_start_time": "2023-09-28 09:00 am",
//       "session_end_time": "2023-09-28 11:00 am",
//       "note": "dfdsfdsfdsffsfdsfs",
//       "agenda": null,
//       "post_session_tasks": null,
//       "report": null,
//       "created_at": "2023-09-26T11:37:42.000000Z",
//       "updated_at": "2023-09-27T11:47:02.000000Z",
//       "deleted_at": null
//   }
// }