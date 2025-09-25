import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import "./VideoList.css";

const VideoList = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/videos/getAllVideos")//.get("http:ip:5000/api/videos") fixme: add fetching from two server
      .then((res) => setVideos(res.data.allVideo))
      .catch((err) => console.error("Error fetching videos:", err));
  }, []);

  return (
    <div className="container">
      <h2 className="header">🎓 Educational Video Feed</h2>
      <div className="grid">
        {videos.map((video) => (
          <div className="card" key={video.videoId}>
            <div className="player-wrapper">
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${video.videoId}`}
                width="100%"
                height="100%"
                controls
              />
            </div>
            <div className="card-content">
              <h4 className="title">{video.title}</h4>
              <p className="channel">{video.channelTitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoList;
