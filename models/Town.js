const mongoose = require("mongoose");

const townSchema = new mongoose.Schema({
  town: {
    type: String,
    required: [true, "Please add a town"],
  },
  city: {
    type: String,
    required: [true, "Please add city"],
  },
  area: String,
  status: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Town", townSchema);

// city: "Karachi",
//     town: "Malir",
//     area: "Saadi Garden",
//     status: "Y",
