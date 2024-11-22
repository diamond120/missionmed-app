import http from "../http-common";

const getInterviewSummary = (mockInterviewId) => {
    const config = {
        params: {
            mockInterviewId: mockInterviewId,
        },
    };
    return http.get(`/interview-summary`, config);
};

const bookInterview = (data) => {
    return http.post(`/student/book-interview`, data);
};

/**
 * 
 * @deprecated - not in use - 2024-09-27
 */
const getTutorMockInterviews = (customConfig = {}) => {
    return http.get(`/tutor/session-details`, { ...customConfig });
};

const Service = {
    getInterviewSummary,
    bookInterview,
    getTutorMockInterviews,
};

export default Service;
