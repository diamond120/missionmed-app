import http from "../http-common";

export const getPackages = () => {
    return http.get(`/student/packages`);
};

export const getSessions = () => {
    return http.get(`/sessions`);
};

export const createSession = (data: any) => {
    return http.post(`/sessions`, data);
};

export const getSessionDetail = (sessionId: number) => {
    return http.get(`/sessions/${sessionId}`);
};

export const getpackage = (packageId: number) => {
    return http.get(`/student/packages/${packageId}`);
};
