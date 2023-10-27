import http from "../http-common";
import {getToken} from "../../common/common.js";

const getStudentTeachingSession = (customConfig={}) => {
  const token = `Bearer ${getToken()}`;
  const headerConfig = {
    headers:{
      'Authorization': token
    }
  }
  return http.get(`/student/teaching-session-details`, {...headerConfig,...customConfig });
};

const updateTeachingSessionData = (data,customConfig={}) => {
  const token = `Bearer ${getToken()}`;
  const headerConfig = {
    headers:{
      'Authorization': token
    }
  }
  return http.post(`/teachingsession-data`,data, {...headerConfig,...customConfig });
};

const getSessionummary = (teachingSessionId) => {
  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    },
    params: {
      teachingSessionId:teachingSessionId,
    }
  }
  return http.get(`/teachingsession-summary`,config);
}

const bookSession = (data) => {

  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    },
  }
  return http.post(`/student/book-teaching-session`, data, config);
}

const rescheduleSession = (data) => {
  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    },
  }
  return http.post(`/student/reschedule-teachingsession`, data, config);
}

const getTutorTeachingSession = (customConfig={}) => {
  const token = `Bearer ${getToken()}`;
  const headerConfig = {
    headers:{
      'Authorization': token
    }
  }
  return http.get(`/tutor/teaching-session-details`, {...headerConfig,...customConfig });
}; 

const sessionRate = (data) => {
  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    }
  }
  return http.post(`/tutor/teaching-sessionrate`, data, config);
};

const freezeSession = (data) => {
  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    }
  }
  return http.post(`/student/freeze-student-teaching-sessions`, data, config);
};

const cancleSession = (data) => {
  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    }
  }
  return http.post(`/student/cancel-session`, data, config);
};

const Service = {
  getStudentTeachingSession,
  updateTeachingSessionData,
  getSessionummary,
  bookSession,
  rescheduleSession,
  getTutorTeachingSession,
  sessionRate,
  freezeSession,
  cancleSession
};

export default Service;