const express = require("express");
const cors = require("cors");
// const { fetchVideosFromChannels } = require("./youtube");
const { connectDB }=require("./config/db");
const videoRoute = require("./route/video.route")
require("dotenv").config();

connectDB();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/api/videos",videoRoute);

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
