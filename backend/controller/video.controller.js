const {
  fetchVideosFromChannels,
  getAllVideo,
  updateWatchLater,
  clearOldVideos: clearOldVideosService
} = require("../service/video.service");

// Controller to fetch videos
const getVideos = async (req, res) => {
  try {
    const videos = await fetchVideosFromChannels();
    res.json({ success: true, count: videos.length, videos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllVideos = async (req, res) => {
  try {
    const allVideo = await getAllVideo();
    res.json({ success: true, count: allVideo.length, allVideo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateWatchLaterVideo = async (req, res) => {
  const { videoId, watchLater = true } = req.body;

  if (!videoId) {
    return res.status(400).json({ success: false, message: "videoId is required" });
  }

  if (typeof watchLater !== "boolean") {
    return res.status(400).json({ success: false, message: "watchLater must be a boolean" });
  }

  try {
    const video = await updateWatchLater(videoId, watchLater);
    return res.status(200).json({ success: true, video });
  } catch (err) {
    const statusCode = err.message === "No video found with that videoId" ? 404 : 500;
    return res.status(statusCode).json({ success: false, message: err.message });
  }
};

const clearOldVideos = async (req, res) => {
  try {
    const result = await clearOldVideosService();
    return res.status(200).json({ success: true, deletedCount: result.deletedCount });
  }
  catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getVideos, getAllVideos, updateWatchLaterVideo, clearOldVideos };
