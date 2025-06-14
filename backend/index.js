const express = require("express");
const cors = require("cors");
const { fetchVideosFromChannels } = require("./youtube");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

app.get("/api/videos", async (req, res) => {
  try {
    const videos = await fetchVideosFromChannels();
    res.json(videos);
  } catch (err) {
    console.error("Error in /api/videos:", err.message);
    res.status(500).json({ message: "Error fetching videos", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
