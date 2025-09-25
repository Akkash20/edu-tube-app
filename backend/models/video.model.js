const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // removes extra spaces
    },
    videoId: {
      type: String,
      required: true,
      unique: true, // one YouTube video = one record
    },
    thumbnail: {
      type: String,
    },
    publishedAt: {
      type: Date,
      required: true,
    },
    channelTitle: {
      type: String,
      required: true,
    }
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
