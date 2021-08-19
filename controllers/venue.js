const Venue = require(`../models/Venue`);
const ErrorResponse = require(`../utils/errorResponse`);
const asynchandler = require(`../middleware/async`);
const uploadMedia = require(`../utils/uploadMedia`);

// @desc Get venues
//@route GET /api/v1/venue
// @access Private/Admin
exports.getVenues = asynchandler(async (req, res, next) => {
  const venues = await Venue.find({}).populate("user venueTown");
  res.status(200).json({ success: true, data: venues });
});

// @desc Get venues by vendor Id
//@route GET /api/v1/venue/vendor/:id
// @access Private/Admin
exports.getVenuesByVendorID = asynchandler(async (req, res, next) => {
  const venues = await Venue.find({ user: req.user._id }).populate(
    "user venueTown"
  );
  res.status(200).json({ success: true, data: venues });
});

// @desc Get single venue
//@route GET /api/v1/venue/:id
// @access Public
exports.getVenue = asynchandler(async (req, res, next) => {
  const venue = await Venue.findById(req.params.id).populate({
    path: "venueTown user",
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
  const { venue } = req.body;
  const JSONVenue = JSON.parse(venue);
  if (!venue.venueTown) {
    return next(new ErrorResponse(`Please select Venue Town`), 404);
  }
  if (req.files && req.files.media) {
    // if (req.files.media.length) {

    // }
    if (Array.isArray(req.files.media)) {
      const promises = req.files.media.map(async (media) => {
        const url1 = await uploadMedia(media, "venue-bazaar");
        url.push(url1.res.url);
      });

      const results = Promise.all(promises).then(async () => {
        console.log(req.user._id);

        console.log(venue);

        JSONVenue.images = url;
        JSONVenue.user = req.user._id;

        const venueData = await Venue.create(JSONVenue);
        return res.status(200).json({
          success: true,
          venue: venueData,
        });
      });
    } else {
      const url2 = await uploadMedia(req.files.media, "venue-bazaar");
      url.push(url2.res.url);
      JSONVenue.images = url;
      JSONVenue.user = req.user._id;

      const venueData = await Venue.create(JSONVenue);
      return res.status(200).json({
        success: true,
        venue: venueData,
      });
    }
  } else {
    return next(new ErrorResponse(`Please upload atleast one image`), 404);
  }
});

// @desc Update venue
//@route PUT /api/v1/venue/:id
// @access Private
exports.updateVenue = asynchandler(async (req, res, next) => {
  let venue = await Venue.findById(req.params.id);

  if (!venue) {
    return next(new ErrorResponse(`No venue found`), 404);
  }

  console.log(req.body.venue, "venue");
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

// @desc Add an image
//@route Delete /api/v1/venue/image/:id
// @access Private
exports.addImageToVenue = asynchandler(async (req, res, next) => {
  console.log(req.files.media);
  if (req.files && req.files.media) {
    let venue = await Venue.findById(req.params.id);

    if (!venue) {
      return next(new ErrorResponse(`No venue found`), 404);
    }
    const url = await uploadMedia(req.files.media, "venue-bazaar");
    if (url && url.res && url.res.url) {
      venue = await Venue.findByIdAndUpdate(
        req.params.id,
        { $push: { images: url.res.url } },
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).json({
        success: true,
        data: venue,
        url: url.url,
      });
    } else {
      return next(new ErrorResponse(`Error with file upload`), 404);
    }
  } else {
    return next(new ErrorResponse(`Upload image`), 404);
  }
});

// @desc Delete an image
//@route Delete /api/v1/venue/image/:id
// @access Private
exports.RemoveImageFromVenue = asynchandler(async (req, res, next) => {
  let venue = await Venue.findById(req.params.id);
  if (!venue) {
    return next(new ErrorResponse(`No venue found`), 404);
  }
  venue = await Venue.findByIdAndUpdate(
    req.params.id,
    { $pull: { images: req.body.url } },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: venue,
  });
});
