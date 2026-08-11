import api from "./axios";

export const getRecentJobs = async () => {
    const response = await api.get("/dashboard/recent-jobs");
    return response.data;
};

export const getScreeningStatus = async () => {
    const response = await api.get("/dashboard/screening-status");
    return response.data;
};

export const getTopCandidates = async () => {

    const response = await api.get(
        "/dashboard/top-candidates"
    );

    return response.data;

};

export const getAverageScore = async () => {

    const response = await api.get(
        "/dashboard/average-score"
    );

    return response.data;

};