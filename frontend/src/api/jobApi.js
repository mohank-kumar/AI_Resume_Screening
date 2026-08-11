import api from "./axios";

// Get all Job Descriptions
export const getJobs = async () => {
    try {
        const response = await api.get("/jobs");
        return response.data;
    } catch (error) {
        console.error("Error fetching jobs:", error);
        throw error;
    }
};

// Get Single Job
export const getJobById = async (jobId) => {
    try {
        const response = await api.get(`/jobs/${jobId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching job:", error);
        throw error;
    }
};

// Create Job Description
export const createJob = async (jobData) => {
    try {
        const response = await api.post("/jobs", jobData);
        return response.data;
    } catch (error) {
        console.error("Error creating job:", error);
        throw error;
    }
};

// Update Job Description
export const updateJob = async (jobId, jobData) => {
    try {
        const response = await api.put(`/jobs/${jobId}`, jobData);
        return response.data;
    } catch (error) {
        console.error("Error updating job:", error);
        throw error;
    }
};

// Delete Job Description
export const deleteJob = async (jobId) => {
    try {
        const response = await api.delete(`/jobs/${jobId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting job:", error);
        throw error;
    }
};