const multer = require("multer");

const path = require("path");

const fs = require("fs");
const Project = require("../Models/Project");


const mainUploadPath = "uploads";

if (!fs.existsSync(mainUploadPath)) {

    fs.mkdirSync(mainUploadPath);
}



const storage = multer.diskStorage({

 destination: async (req, file, cb) => {

    try {

        const Project =
            require("../Models/Project");

    

        const projectId =
            req.params.projectId;

        if (!projectId) {

            return cb(
                new Error("Project ID is required"),
                null
            );
        }


        const project =
            await Project.findById(projectId);

        if (!project) {

            return cb(
                new Error("Project not found"),
                null
            );
        }

      

        const userId =
            project.user.toString();

   

        if (!req.uploadFolder) {

            const uploadPath = path.join(
                mainUploadPath,
                userId,
                projectId
            );

            fs.mkdirSync(uploadPath, {
                recursive: true
            });

            req.uploadFolder =
                uploadPath;
        }

        cb(null, req.uploadFolder);

    } catch (error) {

        cb(error, null);
    }
},

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9);

        cb(
            null,
            uniqueName +
            path.extname(file.originalname)
        );
    }
});



const fileFilter = (req, file, cb) => {

    const allowedTypes =
        /jpg|jpeg|png/;

    const extname =
        allowedTypes.test(
            path.extname(file.originalname)
            .toLowerCase()
        );

    const mimetype =
        allowedTypes.test(file.mimetype);

    if (extname && mimetype) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only JPG, JPEG, PNG files allowed"
            )
        );
    }
};


const upload = multer({

    storage,

    limits: {
        fileSize: 20 * 1024 * 1024
    },

    fileFilter
});

module.exports = upload;