const express = require("express");

const router = express.Router();

const {
    createNewProject,
    getProjectStatus,downloadProjectAssets , testGeoTiff,generateCHMController
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

module.exports = router;