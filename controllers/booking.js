const Town = require(`../models/Town`);
const asynchandler = require(`../middleware/async`);
const Booking = require("../models/Booking");

// @desc Gett all bookings by vendor
//@route GET /api/v1/booking/vendor/:id
// @access Public
exports.getAllBookingsByVendor = asynchandler(async (req, res, next) => {
  const bookings = await Booking.find({ vendor: req.user._id }).populate(
    "venue bookingBy vendor"
  );
  res
    .status(200)
    .json({ success: true, count: bookings.length, data: bookings });
});

// @desc Gett all bookings by venue
//@route GET /api/v1/booking/venue/:id
// @access Public
exports.getAllBookingsByVenue = asynchandler(async (req, res, next) => {
  const bookings = await Booking.find({ venue: req.params.id }).populate(
    "venue bookingBy vendor"
  );
  res
    .status(200)
    .json({ success: true, count: bookings.length, bookings: bookings });
});

// @desc Accept the booking
//@route PUT /api/v1/booking/accept/:id
// @access Public
exports.acceptBooking = asynchandler(async (req, res, next) => {
  const booking = await Booking.findByIdAndUpdate(req.body._id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: booking });
});

// @desc Remove the booking
//@route GET /api/v1/booking/delete/:id
// @access Public
exports.deleteBooking = asynchandler(async (req, res, next) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, data: {} });
});

// @desc Create a booking
//@route POST /api/v1/booking
// @access Public
exports.createBooking = asynchandler(async (req, res, next) => {
  const bookingData = req.body;
  bookingData.bookingBy = req.user._id;
  console.log(bookingData, "book");

  const booking = await Booking.create(bookingData);
  res.status(201).json({ success: true, data: booking });
});
