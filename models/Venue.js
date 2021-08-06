const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema({
  venueName: {
    type: String,
    required: [true, "Please add a town"],
  },
  venueType: {
    type: String,
    required: [true, "Please select venue Type"],
    enum: ["normal", "banquet"],
  },
  venueAddress: {
    type: String,
    required: [true, "Please add venue address"],
  },
  venueTown: {
    type: mongoose.Schema.ObjectId,
    ref: "Town",
    required: [true, "Please select town"],
  },
  venueCity: {
    type: String,
    required: [true, "Please select city"],
  },
  venueTel1: {
    type: String,
    required: [true, "Please add telephone "],
  },
  venueTel2: {
    type: String,
  },
  venueEmail: {
    type: String,
    required: [true, "Please add an email"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  venueWebsite: {
    type: String,
  },
  venueDescription: {
    type: String,
  },
  venueMinPrice: {
    type: Number,
    required: [true, "Please add min price"],
  },
  venueMaxPrice: {
    type: Number,
    required: [true, "Please add max price"],
  },
  venueCapacity: {
    type: Number,
    required: [true, "Please add venue capacity"],
  },
  venueFacility: {
    type: [String],
    required: [true, "please select atleast one facility"],
  },
  images: {
    type: [String],
    required: [true, "Please upload atleast one image"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please select user"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Venue", venueSchema);
