import api from "./axios";

// Upload Multiple Resumes
export const uploadResumes = async (jobId, files) => {

    const formData = new FormData();

    files.forEach((file) => {
        formData.append("files", file);
    });

    const response = await api.post(
        `/resumes/jobs/${jobId}/upload`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};

// Get Live Resume Status
export const getResumeStatus = async (jobId) => {

    const response = await api.get(
        `/resumes/jobs/${jobId}/status`
    );

    return response.data;

};

// Delete Resume
export const deleteResume = async (resumeId) => {
    const response = await api.delete(`/resumes/${resumeId}`);
    return response.data;
};