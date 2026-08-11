import api from "./axios";

// Ranking
export const getRanking = async (jobId) => {

    const response = await api.get(
        `/screening/jobs/${jobId}/ranking`
    );

    return response.data;

};

// Analytics
export const getAnalytics = async (jobId) => {

    const response = await api.get(
        `/screening/jobs/${jobId}/analytics`
    );

    return response.data;

};

// Candidate Details
export const  getCandidate = async (resumeId) => {

    const response = await api.get(
        `/screening/${resumeId}`
    );

    return response.data;

};

export const getAllCandidates = async () => {

    const response = await api.get(
        "/screening/candidates"
    );

    return response.data;

};