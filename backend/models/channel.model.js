const mongoose = require("mongoose");
const express = require("express");

const channnelSchema = new mongoose.Schema({
  channelId: {
    type: String,
    unique: true,
  },
  channelTitle: {
    type: String,
    reqired: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  subscriberCount: {
    type: Number,
    required: true,
    default: 0,
  },
  favourite: {
    type: Boolean,
    default: false,
  },
});

const Channel = mongoose.model("channel", channnelSchema);

module.exports = Channel;
