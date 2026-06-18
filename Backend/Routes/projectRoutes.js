const express = require("express");

const router = express.Router();

const {
    createNewProject,
    getProjectStatus,downloadProjectAssets , testGeoTiff,generateCHMController,testCanopyArea , runEnvironmentalAnalysis, getProjectsByUser, deleteProject
} = require("../Controllers/projectController");



router.post(
    "/projects",
    createNewProject
);

router.get(
    "/projects/:projectId/status",
   getProjectStatus
);

router.post(
    "/projects/:projectId/download-assets",
    downloadProjectAssets
);



router.get(
    "/projects/:projectId/test-geotiff",
    testGeoTiff
);

router.get(
    "/projects/:projectId/generate-chm",
    generateCHMController
)
router.get(
    "/projects/:projectId/testcanopy",
    testCanopyArea
)

router.post(
    "/projects/:projectId/analyze",
    runEnvironmentalAnalysis
);

router.get(
    "/projects/user/:userId",
    getProjectsByUser
);

router.delete(
    "/projects/:projectId",
    deleteProject
);

module.exports = router;