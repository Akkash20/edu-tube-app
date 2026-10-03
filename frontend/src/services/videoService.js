import api from "./api";

export async function getAllVideos() {
  const response = await api.get("/videos/getAllVideos");
  return response.data.allVideo;
}