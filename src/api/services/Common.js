import http from "../http-common";
import {getToken} from "../../common/common";

const getProfileStaticData = (data) => {
  return http.get("/lists", data);
};

// const getUniversityList = () => {
//   const token = `Bearer ${getToken()}`;
//   const config = {
//     headers:{
//       'Authorization': token
//     }
//   }
//   return http.get("/university-list", config);
// };

const getUniversityTutorList = (data) => {
  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    }
  }
  return http.post(`/university-tutors-list`, data, config);
}

// const getSlotslist = (data) => {
//   const token = `Bearer ${getToken()}`;
//   const config = {
//     headers:{
//       'Authorization': token
//     }
//   }
//   return http.post("/student/slots", data, config);
// };

// UCAT Session

// const getUCATSlotslist = (data) => {
//   const token = `Bearer ${getToken()}`;
//   const config = {
//     headers:{
//       'Authorization': token
//     }
//   }
//   return http.post("/student/ucat-booking-slots", data, config);
// };

// const getTutorList = (data) => {
//   const token = `Bearer ${getToken()}`;
//   const config = {
//     headers:{
//       'Authorization': token
//     }
//   }
//   return http.post(`/ucat-tutors-list`, data, config);
// }

const checkSession = (data) => {
  const token = `Bearer ${getToken()}`;
  const config = {
    headers:{
      'Authorization': token
    },
  }
  return http.post(`/student/check-sessions`, data, config);
}

// End UCAT Session api

// Student Teaching Session
// const getTeachingSlotslist = (data) => {
//   const token = `Bearer ${getToken()}`;
//   const config = {
//     headers:{
//       'Authorization': token
//     }
//   }
//   return http.post("/student/student-teachingsession-slots", data, config);
// };

// End Student Teaching Session

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
    // getUniversityList,
    getUniversityTutorList,
    // getSlotslist,
    // getUCATSlotslist,
    // getTutorList,
    checkSession,
    // getTeachingSlotslist,
    getAPI,
    postAPI
};

export default Service;