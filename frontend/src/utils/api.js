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
    formData
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
export default api;