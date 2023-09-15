import http from "../http-common";

const getUserDetails = (token) => {
  let bToken = `Bearer ${token}`;
  const config = {
    headers:{
      'Authorization': bToken
    }
  }
  return http.get("/userdetails", config);
};


const Service = {
  getUserDetails
};

export default Service;