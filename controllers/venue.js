const Venue = require(`../models/Venue`);
const ErrorResponse = require(`../utils/errorResponse`);
const asynchandler = require(`../middleware/async`);
const uploadMedia = require(`../utils/uploadMedia`);

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
  let url = [];
  if (req.files && req.files.media) {
    const promises = req.files.media.map(async (media) => {
      const url1 = await uploadMedia(media, "venue-bazaar");
      url.push(url1.res.url);
    });

    const results = Promise.all(promises).then(async () => {
      const { venue } = req.body;
      console.log(req.user._id);
      venue.images = url;
      venue.user = req.user._id;
      console.log(venue);
      // console.log(...JSON.parse(venue));
      // console.log({ ...JSON.parse(venue) });
      const venueData = await Venue.create(JSON.parse(venue));
      return res.status(200).json({
        success: true,
        venue: venueData,
      });
    });
  } else {
    return next(new ErrorResponse(`Please upload atleast one image`), 404);
  }
  // const venue = await Venue.create(req.body.venue);
  // if (req.files.media) {
  //   // console.log(req.files.media, "medioaia");
  //   // res.status(200).json({
  //   //   success: true,
  //   //   data: venue,
  //   // });
  // } else {
  // }
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
