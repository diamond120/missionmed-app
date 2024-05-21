import { getToken } from '../../common/common';
import http from "../http-common";

export const getPackages = () => {
    const token = `Bearer ${getToken()}`;
    const config = {
        headers: {
            'Authorization': token
        }
    }
    return http.get(`/auth/packages`, config);
}

export const getSessions = () => {
    const token = `Bearer ${getToken()}`;
    const config = {
        headers: {
            'Authorization': token
        }
    }
    return http.get(`/sessions`, config);
}

export const createSession = (data: any) => {
    const token = `Bearer ${getToken()}`;
    const config = {
        headers: {
            'Authorization': token
        },

    }

    return http.post(`/sessions`, data, config,);
}

export const getSessionDetail = (sessionId: number) => {
    const token = `Bearer ${getToken()}`;
    const config = {
        headers: {
            'Authorization': token
        }
    }
    return http.get(`/sessions/${sessionId}`, config);
}
