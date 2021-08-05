const Venue = require(`../models/Venue`);
const ErrorResponse = require(`../utils/errorResponse`);
const asynchandler = require(`../middleware/async`);

// @desc Get venues
//@route GET /api/v1/venue
// @access Private/Admin
exports.getVenues = asynchandler(async (req, res, next) => {
  const venues = await Venue.find({});
  res.status(200).json({ success: true, data: venues });
});

// @desc Get single venue
//@route GET /api/v1/venue/:id
// @access Public
exports.getVenue = asynchandler(async (req, res, next) => {
  const venue = await Venue.findById(req.params.id).populate({
    path: "venueTown",
  });

  if (!venue) {
    return next(new ErrorResponse(`No venue found`), 404);
  }
  res.status(200).json({
    success: true,
    count: venue.length,
    data: venue,
  });
});

// @desc Add venue
//@route POST /api/v1/venue
// @access Private
exports.addVenue = asynchandler(async (req, res, next) => {
  const venue = await Venue.create(req.body.venue);
  res.status(200).json({
    success: true,
    data: venue,
  });
});

// @desc Update venue
//@route PUT /api/v1/venue/:id
// @access Private
exports.updateVenue = asynchandler(async (req, res, next) => {
  let venue = await Venue.findById(req.params.id);

  if (!venue) {
    return next(new ErrorResponse(`No venue found`), 404);
  }

  venue = await Venue.findByIdAndUpdate(req.params.id, req.body.venue, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: venue,
  });
});

// @desc Delete venue
//@route Delete /api/v1/venue/:id
// @access Private
exports.deleteVenue = asynchandler(async (req, res, next) => {
  const venue = await Venue.findById(req.params.id);

  if (!Venue) {
    return next(new ErrorResponse(`No venue found`), 404);
  }
  await venue.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});
