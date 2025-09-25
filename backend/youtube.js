const axios = require("axios");
const channelList = require("./channelList"); // your selected channels
require("dotenv").config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

async function fetchVideosFromChannels() {
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

      allVideos.push(...videos);
    } catch (err) {
      console.error(`Error fetching from ${channelId}:`, err.message);
    }
  }

  return allVideos;
}

module.exports = { fetchVideosFromChannels };
