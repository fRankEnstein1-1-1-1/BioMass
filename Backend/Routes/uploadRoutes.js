const express = require("express");

const router = express.Router();

const upload =
    require("../Middlewares/uploadMiddleware");

const {
    uploadImages
} = require("../Controllers/uploadController");


router.post(
    "/upload/:projectId",
    upload.array("images", 300),
    uploadImages
);

module.exports = router;