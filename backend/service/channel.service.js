const axios = require("axios");

const Channel = require("../models/channel.model");

const getChannelInfo = async ({ channelId }) => {
  try {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${process.env.YOUTUBE_API_KEY}`;
    const res = await axios.get(url);

    if (!res.data.items || res.data.items.length == 0) {
      console.log("No channel found");
      throw new Error("No channel found");
    }

    const channel = res.data.items[0];

    const channelInfo = {
      channelId: channel.id,
      channelTitle: channel.snippet.title,
      thumbnail: channel.snippet.thumbnails.medium.url,
      description: channel.snippet.description,
      subscriberCount: parseInt(channel.statistics.subscriberCount || 0, 10),
    };

    await Channel.create(channelInfo);

    return channelInfo;
  } catch (error) {
    console.log("channel info ", error.message);
    throw error;
    // return error;
  }
};

const removeChannel = async (channelId) => {
  const channel = await Channel.findOne({ channelId });

  if (!channel) {
    console.log("no channel found");
    throw new Error("No such channel present");
  }

  await Channel.findOneAndDelete(channelId);
  console.log("channel found and deleted");
  return "channel found and deleted";
};

const getAllChannels = async () => {
  try {
    return await Channel.find();
  } catch (error) {
    console.log("error fetching channels");
    throw error;
  }
};

const updateFavourite = async (channelId, favourite) => {
  const channel = await Channel.findOneAndUpdate(
    { channelId },
    { $set: { favourite } },
    { new: true },
  );

  if (!channel) {
    throw new Error("No channel found");
  }

  return channel;
};

module.exports = {
  getChannelInfo,
  removeChannel,
  getAllChannels,
  updateFavourite,
};
