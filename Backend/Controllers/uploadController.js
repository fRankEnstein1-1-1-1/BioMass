const Project =
    require("../Models/Project");

const {
    createProject,
    createTask
} = require("../services/WebodmServices");


const uploadImages = async (req, res) => {

    try {


        if (!req.files || req.files.length === 0) {

            return res.status(400).json({
                success: false,
                message: "No images uploaded"
            });
        }

     
        const projectId =
            req.params.projectId;



        const mongoProject =
            await Project.findById(projectId);

        if (!mongoProject) {

            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

     

        const uploadFolder =
            req.uploadFolder;

      

        const webodmProject =
            await createProject(
                mongoProject.projectName
            );

    

        const task =
            await createTask(
                webodmProject.id,
                uploadFolder
            );

  

        mongoProject.folderPath =
            uploadFolder;

        mongoProject.webodmProjectId =
            webodmProject.id;

        mongoProject.webodmTaskId =
            task.id;

        mongoProject.status =
            "processing";

        await mongoProject.save();

  

        return res.status(200).json({

            success: true,

            message:
                "Images uploaded successfully",

            projectId:
                mongoProject._id,

            uploadFolder,

            webodmProject,

            task
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Upload failed",

            error: error.message
        });
    }
};

module.exports = {
    uploadImages
};