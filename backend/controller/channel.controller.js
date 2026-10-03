const {
  getChannelInfo,
  removeChannel,
  getAllChannels,
  updateFavourite,
} = require("../service/channel.service");

const getChannelInfoController = async (req, res) => {
  const channelId = req.body;

  try {
    const channelInfo = await getChannelInfo(channelId);
    return res.status(200).json({ sucess: true, data: channelInfo });
  } catch (err) {
    return res.status(400).json({ sucess: false, message: err.message });
  }
};

const removeChannelController = async (req, res) => {
  const { channelId } = req.body;

  try {
    const channelInfo = await removeChannel(channelId);
    res.status(200).json({ sucess: true, message: channelInfo });
  } catch (err) {
    res.status(400).json({ sucess: false, message: err.message });
  }
};

const getAllChannelsController = async (req, res) => {
  try {
    const channels = await getAllChannels();
    return res
      .status(200)
      .json({ success: true, count: channels.length, channels });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateFavouriteController = async (req, res) => {
  const { channelId } = req.params;
  const { favourite } = req.body;

  if (!channelId || typeof favourite !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "channelId and a boolean favourite value are required",
    });
  }

  try {
    const channel = await updateFavourite(channelId, favourite);
    return res.status(200).json({
      success: true,
      message: favourite
        ? "Channel added to favourites"
        : "Channel removed from favourites",
      channel,
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  getChannelInfoController,
  removeChannelController,
  getAllChannelsController,
  updateFavouriteController,
};
