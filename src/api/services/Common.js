import http from "../http-common";

const getProfileStaticData = () => {
    return http.get("/lists");
};

const getUniversityTutorList = (data) => {
    return http.post(`/university-tutors-list`, data);
};

const checkSession = (data) => {
    return http.post(`/student/check-sessions`, data);
};

const getAPI = (path) => {
    return http.get(path);
};

const postAPI = (path, data, cancelToken = "") => {
    const config = {
        cancelToken: cancelToken || undefined,
    };
    return http.post(path, data, config);
};

const getUserDetails = () => {
    return http.get("/userdetails");
};

const Service = {
    getProfileStaticData,
    getUniversityTutorList,
    checkSession,
    getAPI,
    postAPI,
    getUserDetails,
};

export default Service;
