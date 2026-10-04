import api from "./api";

export async function getAllVideos() {
  const response = await api.get("/videos/getAllVideos");
  return response.data.allVideo;
}

export async function updateWatchLaterVideo(videoId, watchLater) {
  const response = await api.patch("/videos/watchLater", {
    videoId,
    watchLater,
  });

  return response.data.video;
}