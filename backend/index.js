const express = require("express");
const cors = require("cors");
// const { fetchVideosFromChannels } = require("./youtube");
const { connectDB }=require("./config/db");
const videoRoute = require("./route/video.route")
const userRoute = require("./route/user.route")
const channelRoute = require("./route/channel.route");
require("dotenv").config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/videos",videoRoute);
app.use("/api/users",userRoute);
app.use("/api/channel",channelRoute);

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

app.listen(PORT, "0.0.0.0" , () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
