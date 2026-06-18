import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';   // Change this for production

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});



export const signup = async (userData) => {
    try {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Something went wrong" };
    }
};

export const login = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Something went wrong" };
    }
};



export const createProject = async (projectData) => {

    try {

        const response = await api.post(
            "/projects",
            projectData
        );

        return response.data;

    } catch (error) {

        throw (
            error.response?.data ||
            { message: "Project creation failed" }
        );
    }
};



export const uploadImages = async (
    projectId,
    formData,
    onUploadProgress
) => {

    try {

        const response = await api.post(

            `/upload/${projectId}`,

            formData,

            {
                headers: {
                    'Content-Type':
                        'multipart/form-data',
                },
                onUploadProgress,
                transformRequest:
                    (data) => data,
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "Upload Error Details:",
            error.response?.data || error
        );

        throw error;
    }
};
export const getProjectsByUser = async (userId) => {
    try {
        const response = await api.get(`/projects/user/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch projects" };
    }
};
export const getProjectStatus = async (projectId) => {
    try {
        const response = await api.get(`/projects/${projectId}/status`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch project status" };
    }
};

export const downloadProjectAssets = async (projectId) => {
    try {
        const response = await api.post(`/projects/${projectId}/download-assets`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to download assets" };
    }
};

export const runEnvironmentalAnalysis = async (projectId) => {
    try {
        const response = await api.post(`/projects/${projectId}/analyze`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to run analysis" };
    }
};

export const deleteProject = async (projectId) => {
    try {
        const response = await api.delete(`/projects/${projectId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to delete project" };
    }
};

export default api;