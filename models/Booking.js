const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  venue: {
    type: mongoose.Schema.ObjectId,
    ref: "Venue",
    required: [true, "Please select venue"],
  },
  bookingBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please add booking By"],
  },
  bookingDate: {
    type: Date,
    required: [true, "Please select date for booking"],
  },
  bookingStatus: {
    type: String,
    enum: ["confirm", "pending"],
  },
  vendor: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please add vendor"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
