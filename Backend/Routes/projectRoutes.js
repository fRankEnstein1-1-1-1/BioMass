const express = require("express");

const router = express.Router();

const {
    createNewProject
} = require("../Controllers/projectController");


router.post(
    "/projects",
    createNewProject
);

module.exports = router;