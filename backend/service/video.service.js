const axios = require("axios");
const channelList = require("../channelList"); // your selected channels
const Video=require("../models/video.model");
require("dotenv").config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const fetchVideosFromChannels = async () => {
  const allVideos = [];

  for (const channelId of channelList) {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=5&type=video`;

    try {
      const res = await axios.get(url);

      const videos = res.data.items.map((video) => ({
        title: video.snippet.title,
        videoId: video.id.videoId,
        thumbnail: video.snippet.thumbnails.medium.url,
        publishedAt: video.snippet.publishedAt,
        channelTitle: video.snippet.channelTitle,
      }));

      try{
        const inserted=await Video.insertMany(videos, { ordered: false });
        allVideos.push(...inserted);
      }
      catch(err) {
        if (err.code === 11000) {
          console.log("⚠️ Duplicate videos skipped.");
          if (err.result?.result?.nInserted > 0 && err.insertedDocs) {
            allVideos.push(...err.insertedDocs);
          }
        } else {
          throw err;
        }
      }
     

      // allVideos.push(...videos);
    } catch (err) {
      console.error(`❌ Error fetching from ${channelId}:`, err.message);
    }
  }

  return allVideos;
};

const getAllVideo = async () => {
  try{
    const videos=await Video.find();
    return videos;
  }
  catch(err){
    console.log("error fetching from db");
    throw(err);
  }
  
};

module.exports = { fetchVideosFromChannels , getAllVideo };