const path = require("path");
const fs = require("fs");

const Project =
    require("../Models/Project");
const {
    getTaskStatus
} = require("../services/WebodmServices");
const {
    downloadAsset
} = require("../services/WebodmServices");

const {
    readGeoTiff
} = require("../services/geotiffService");

const {
    generateCHM
} = require(
    "../services/geotiffService"
);

const {
    estimateBiomass
} = require("../services/biomassService");

const {
    estimateCarbon
} = require("../services/carbonestimateService");


const {
    analyzeCanopyArea
} = require(
    "../services/canopyAnalysisSevice"
);

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

const getProjectStatus = async (
    req,
    res
) => {

   

    try { 
        console.log(
    "Status endpoint hit",
    req.params.projectId
);

        const projectId =
            req.params.projectId;

        const mongoProject =
            await Project.findById(projectId);

        if (!mongoProject) {

            return res.status(404).json({

                success: false,

                message:
                    "Project not found"
            });
        }

        const task =
            await getTaskStatus(

                mongoProject.webodmProjectId,

                mongoProject.webodmTaskId
            );

        /*
        ---------------------------------
        STATUS MAPPING
        ---------------------------------
        */

        let projectStatus =
            "processing";

        if (task.status === 40) {

            projectStatus =
                "completed";

            mongoProject.availableAssets =
                task.available_assets;

            await mongoProject.save();
        }

        if (
            task.status === 50 ||
            task.status === 30
        ) {

            projectStatus =
                "failed";
        }

        mongoProject.status =
            projectStatus;

        await mongoProject.save();

        return res.status(200).json({

            success: true,

            projectStatus,

            progress:
                Math.round(
                    task.running_progress * 100
                ),

            assets:
                task.available_assets || []
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch status",

            error:
                error.message
        });
    }
};

const downloadProjectAssets = async (req, res) => {
    console.log("DOWNLOAD ENDPOINT HIT");

    try {

        const { projectId } = req.params;

        const project =
            await Project.findById(projectId);

        if (!project) {

            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        if (
            !project.webodmProjectId ||
            !project.webodmTaskId
        ) {

            return res.status(400).json({
                success: false,
                message: "WebODM IDs missing"
            });
        }

        const assetFolder = path.join(
            __dirname,
            "..",
            "project-assets",
            projectId
        );

        fs.mkdirSync(assetFolder, {
            recursive: true
        });

        const dsmPath = path.join(
            assetFolder,
            "dsm.tif"
        );

        const dtmPath = path.join(
            assetFolder,
            "dtm.tif"
        );

        console.log("Downloading DSM...");

        await downloadAsset(
            project.webodmProjectId,
            project.webodmTaskId,
            "dsm.tif",
            dsmPath
        );

        console.log("Downloading DTM...");

        await downloadAsset(
            project.webodmProjectId,
            project.webodmTaskId,
            "dtm.tif",
            dtmPath
        );

        project.dsmPath = dsmPath;
        project.dtmPath = dtmPath;

        await project.save();

        return res.json({
            success: true,
            message: "Assets downloaded",
            dsmPath,
            dtmPath
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const testGeoTiff = async (
    req,
    res
) => {

    try {

        const {
            projectId
        } = req.params;

        const project =
            await Project.findById(
                projectId
            );

        if (!project) {

            return res.status(404).json({
                success: false,
                message:
                    "Project not found"
            });
        }

        const dsmData =
            await readGeoTiff(
                project.dsmPath
            );

return res.json({

    success: true,

    width:
        dsmData.width,

    height:
        dsmData.height,

    noDataValue:
        dsmData.noDataValue,

    validPixelCount:
        dsmData.validPixelCount,

    noDataPixelCount:
        dsmData.noDataPixelCount,

    sampleValues:
        dsmData.sampleValues,

    metadata:
        dsmData.metadata
});

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message:
                error.message
        });
    }
};

const generateCHMController =async (req, res) => {

    try {

       const {
            projectId
        } = req.params;

        const project =
            await Project.findById(
                projectId
            );

        if (!project) {

            return res.status(404).json({
                success: false,
                message:
                    "Project not found"
            });
        }

        const result =
            await generateCHM(
                project.dsmPath,
                project.dtmPath
            );

        return res.json({

            success: true,

            width:
                result.width,

            height:
                result.height,

            validPixels:
                result.validPixels,

            minHeight:
                result.minHeight,

            maxHeight:
                result.maxHeight,

            meanHeight:
                result.meanHeight
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                error.message
        });
    }
};

const testCanopyArea =
async (req, res) => {

    try {

        const {
            projectId
        } = req.params;

        const project =
            await Project.findById(
                projectId
            );

        if (!project) {

            return res.status(404).json({

                success: false,
                message:
                    "Project not found"
            });
        }

        const chmResult =
            await generateCHM(

                project.dsmPath,

                project.dtmPath
            );

        const canopyResult =
            analyzeCanopyArea(
                chmResult
            );

        return res.json({

            success: true,

            ...canopyResult
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                error.message
        });
    }
};

const runEnvironmentalAnalysis =
async (req, res) => {

    try {

        const {
            projectId
        } = req.params;

        const project =
            await Project.findById(
                projectId
            );

        if (!project) {

            return res.status(404).json({

                success: false,
                message:
                    "Project not found"
            });
        }

        const chmResult =
            await generateCHM(

                project.dsmPath,

                project.dtmPath
            );

        const canopyResult =
            analyzeCanopyArea(
                chmResult
            );

        const biomassResult =
            estimateBiomass(

                canopyResult.canopyArea,

                canopyResult.meanVegetationHeight
            );

        const carbonResult =
            estimateCarbon(

                biomassResult
                    .biomassEstimate
            );

        project.vegetationPixels =
            canopyResult
                .vegetationPixels;

        project.canopyArea =
            canopyResult
                .canopyArea;

        project.canopyPercentage =
            canopyResult
                .canopyPercentage;

        project.meanHeight =
            canopyResult
                .meanVegetationHeight;

        project.maxHeight =
            canopyResult
                .maxVegetationHeight;

        project.biomassEstimate =
            biomassResult
                .biomassEstimate;

        project.carbonEstimate =
            carbonResult
                .carbonEstimate;

        await project.save();

        return res.json({
            success: true,
            canopyArea: canopyResult.canopyArea,
            canopyPercentage: canopyResult.canopyPercentage,
            meanHeight: canopyResult.meanVegetationHeight,
            maxHeight: canopyResult.maxVegetationHeight,
            biomassEstimate: biomassResult.biomassEstimate,
            carbonEstimate: carbonResult.carbonEstimate
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                error.message
        });
    }
};

const getProjectsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        const projects = await Project.find({ user: userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            projects
        });

    } catch (error) {
        console.error("Error fetching user projects:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch projects",
            error: error.message
        });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const deletedProject = await Project.findByIdAndDelete(projectId);
        
        if (!deletedProject) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        return res.status(200).json({ success: true, message: "Project deleted successfully" });
    } catch (error) {
        console.error("Error deleting project:", error);
        return res.status(500).json({ success: false, message: "Failed to delete project", error: error.message });
    }
};

module.exports = {
    createNewProject,
    getProjectStatus,
    downloadProjectAssets,
    testGeoTiff,
    generateCHMController,
    testCanopyArea,
    runEnvironmentalAnalysis,
    getProjectsByUser,
    deleteProject
};