const Project =
    require("../Models/Project");


const createNewProject = async (req, res) => {

    try {

        const {
            projectName,
            userId
        } = req.body;

      

        if (!projectName || !userId) {

            return res.status(400).json({

                success: false,

                message:
                    "Project name and userId are required"
            });
        }

      

        const project =
            await Project.create({

                projectName,

                user: userId
            });

 

        return res.status(201).json({

            success: true,

            message:
                "Project created successfully",

            project
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message:
                "Project creation failed",

            error: error.message
        });
    }
};

module.exports = {
    createNewProject
};