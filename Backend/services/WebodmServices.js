const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

const WEBODM_URL = process.env.WEBODM_URL;

let token = null;


const authenticateWebODM = async () => {
    try {

        const response = await axios.post(
            `${WEBODM_URL}/api/token-auth/`,
            {
                username: process.env.WEBODM_USERNAME,
                password: process.env.WEBODM_PASSWORD
            }
        );

        token = response.data.token;

        console.log("WebODM Authentication Successful");

        return token;

    } catch (error) {

        console.log("Authentication Failed");

        if (error.response) {
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
    }
};



const createProject = async (projectName) => {

    try {

        if (!token) {
            await authenticateWebODM();
        }

        const response = await axios.post(
            `${WEBODM_URL}/api/projects/`,
            {
                name: projectName
            },
            {
                headers: {
                    Authorization: `JWT ${token}`
                }
            }
        );

        console.log("Project Created Successfully");

        return response.data;

    } catch (error) {

        console.log("Project Creation Failed");

        if (error.response) {
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
    }
};

const createTask = async (projectId, imageFolderPath) => {

    try {

        if (!token) {
            await authenticateWebODM();
        }

        const form = new FormData();

      

        const files = fs.readdirSync(imageFolderPath);

        files.forEach((file) => {

            const filePath = path.join(
                imageFolderPath,
                file
            );

            form.append(
                "images",
                fs.createReadStream(filePath)
            );
        });

     

        const options = [

    {
        name: "auto-boundary",
        value: true
    },

    {
        name: "feature-quality",
        value: "low"
    },

    {
        name: "min-num-features",
        value: 6000
    },

    {
        name: "pc-quality",
        value: "medium"
    },

    {
        name: "skip-3dmodel",
        value: true
    },

    {
        name: "orthophoto-resolution",
        value: 5
    },

    {
        name: "fast-orthophoto",
        value: true
    },

   

    {
        name: "dsm",
        value: true
    },

  

    {
        name: "dtm",
        value: true
    }
];
        form.append(
            "options",
            JSON.stringify(options)
        );

        form.append("resize_to", 2048);

      
        const response = await axios.post(
            `${WEBODM_URL}/api/projects/${projectId}/tasks/`,
            form,
            {
                headers: {
                    Authorization: `JWT ${token}`,
                    ...form.getHeaders()
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );

        console.log("Task Created Successfully");

        return response.data;

    } catch (error) {

        console.log("Task Creation Failed");

        if (error.response) {
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
    }
};

const getTaskStatus = async (
    projectId,
    taskId
) => {

    try {

        if (!token) {
            await authenticateWebODM();
        }

        const response = await axios.get(

            `${WEBODM_URL}/api/projects/${projectId}/tasks/${taskId}/`,

            {
                headers: {
                    Authorization: `JWT ${token}`
                }
            }
        );

        return response.data;

    } catch (error) {

        console.log(
            "Get Task Status Failed"
        );

        if (error.response) {
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }

        throw error;
    }
};

const downloadAsset = async (
    projectId,
    taskId,
    assetName,
    savePath
) => {

    try {

        if (!token) {
            await authenticateWebODM();
        }

        const response = await axios({

            method: "GET",

            url:
                `${WEBODM_URL}/api/projects/${projectId}/tasks/${taskId}/download/${assetName}`,

            responseType: "stream",

            headers: {
                Authorization:
                    `JWT ${token}`
            }
        });

        const writer =
            fs.createWriteStream(savePath);

        response.data.pipe(writer);

        return new Promise(
            (resolve, reject) => {

                writer.on(
                    "finish",
                    resolve
                );

                writer.on(
                    "error",
                    reject
                );
            }
        );

    } catch (error) {

        console.log(
            "Asset Download Failed"
        );

        throw error;
    }
};

module.exports = {
    authenticateWebODM,
    createProject,
    createTask,
    getTaskStatus,
    downloadAsset
};