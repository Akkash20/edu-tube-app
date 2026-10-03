const express = require("express");

const router = express.Router();

const {
  getChannelInfoController,
  removeChannelController,
  getAllChannelsController,
  updateFavouriteController,
} = require("../controller/channel.controller");

router.post("/getChannelInfo", getChannelInfoController);
router.delete("/removeChannel", removeChannelController);
router.get("/getAllChannels", getAllChannelsController);
router.patch("/:channelId/favourite", updateFavouriteController);

module.exports = router;
