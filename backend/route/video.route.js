const express = require("express");
const router = express.Router();
const {
  getVideos,
  getAllVideos,
  updateWatchLaterVideo,
  clearOldVideos,
} = require("../controller/video.controller");

router.get("/fetchYoutubeList", getVideos);
router.get("/getAllVideos", getAllVideos);
router.patch("/watchLater", updateWatchLaterVideo);
router.delete("/clearOldVideos", clearOldVideos);

module.exports = router;
