const express=require("express");
const router= express.Router();
const {getVideos,getAllVideos} = require("../controller/video.controller");

router.get("/fetchYoutubeList",getVideos);
router.get("/getAllVideos",getAllVideos);

module.exports = router;