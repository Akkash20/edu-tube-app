const { fetchVideosFromChannels ,  getAllVideo } = require("../service/video.service");

// Controller to fetch videos
const getVideos = async (req, res) => {
  try {
    const videos = await fetchVideosFromChannels();
    res.json({ success: true, count: videos.length, videos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllVideos= async (req,res) => {

  try {
    const allVideo=await getAllVideo();
    res.json({success: true,count: allVideo.length,allVideo});
  } catch (err) {
    req.status(500).json({success:false, message:err.message});
  }

}

module.exports = { getVideos, getAllVideos };
