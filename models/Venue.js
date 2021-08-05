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
    segregation: {
      type: Boolean,
      default: false,
    },
    catering: {
      type: Boolean,
      default: false,
    },
    projector: {
      type: Boolean,
      default: false,
    },
    stageDecoration: {
      type: Boolean,
      default: false,
    },
    waitering: {
      type: Boolean,
      default: false,
    },
    musicSystem: {
      type: Boolean,
      default: false,
    },
    specialLight: {
      type: Boolean,
      default: false,
    },
    airConditioner: {
      type: Boolean,
      default: false,
    },
    standbyGenerator: {
      type: Boolean,
      default: false,
    },
    parking: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [String],
      required: [true, "Please upload atleast one image"],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Town", venueSchema);
