const User = require(`../models/User`);
const Venue = require(`../models/Venue`);
const ErrorResponse = require(`../utils/errorResponse`);
const asynchandler = require(`../middleware/async`);
const uploadMedia = require(`../utils/uploadMedia`);

// @desc Get venues
//@route GET /api/v1/admin/users
// @access Private/Admin
exports.getAllUsers = asynchandler(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({ success: true, data: users });
});

// @desc Get All venues
//@route GET /api/v1/admin/users
// @access Private/Admin
exports.getAllVenues = asynchandler(async (req, res, next) => {
  const venues = await Venue.find({});
  res.status(200).json({ success: true, data: venues });
});

// @desc Toggle user accounts
//@route POST /api/v1/admin/users/:id
// @access Private/Admin
exports.toggleUserAccount = asynchandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { accountActive: !req.body.accountActive },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ success: true, data: user });
});
