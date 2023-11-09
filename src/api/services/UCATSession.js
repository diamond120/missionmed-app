import http from "../http-common";
import {getToken} from "../../common/common.js";

// const getStudentUCATSession = (customConfig={}) => {
//   const token = `Bearer ${getToken()}`;
//   const headerConfig = {
//     headers:{
//       'Authorization': token
//     }
//   }
//   return http.get(`/student/ucat-session-details`, {...headerConfig,...customConfig });
// };

// const updateUCATSessionData = (data,customConfig={}) => {
//   const token = `Bearer ${getToken()}`;
//   const headerConfig = {
//     headers:{
//       'Authorization': token
//     }
//   }
//   return http.post(`/ucatbooking-data`,data, {...headerConfig,...customConfig });
// };

// const getSessionummary = (ucatBookingId) => {
//   const token = `Bearer ${getToken()}`;
//   const config = {
//     headers:{
//       'Authorization': token
//     },
//     params: {
//       ucatBookingId:ucatBookingId,
//     }
//   }
//   return http.get(`/ucatbooking-summary`,config);
// }

// const bookSession = (data) => {

//   const token = `Bearer ${getToken()}`;
//   const config = {
//     headers:{
//       'Authorization': token
//     },
//   }
//   return http.post(`/student/book-ucat-session`, data, config);
// }

// const rescheduleSession = (data) => {
//   const token = `Bearer ${getToken()}`;
//   const config = {
//     headers:{
//       'Authorization': token
//     },
//   }
//   return http.post(`/student/reschedule-ucatbboking`, data, config);
// }

const getTutorUcatSession = (customConfig={}) => {
  const token = `Bearer ${getToken()}`;
  const headerConfig = {
    headers:{
      'Authorization': token
    }
  }
  return http.get(`/tutor/ucatbooking-session-details`, {...headerConfig,...customConfig });
}; 

// const sessionRate = (data) => {
//   const token = `Bearer ${getToken()}`;
//   const config = {
//     headers:{
//       'Authorization': token
//     }
//   }
//   return http.post(`/tutor/ucatbook-sessionrate`, data, config);
// };

// const bookFreezeSession = (data) => {
//   const token = `Bearer ${getToken()}`;
//   const config = {
//     headers:{
//       'Authorization': token
//     },
//   }
//   return http.post(`/student/freeze-sessions`, data, config);
// }

// const cancleSession = (data) => {
//   const token = `Bearer ${getToken()}`;
//   const config = {
//     headers:{
//       'Authorization': token
//     },
//   }
//   return http.post(`/student/cancel-session`, data, config);
// }


const Service = {
  // getStudentUCATSession,
  // updateUCATSessionData,
  // getSessionummary,
  // bookSession,
  // rescheduleSession,
  getTutorUcatSession,
  // sessionRate,
  // bookFreezeSession,
  // cancleSession
};

export default Service;