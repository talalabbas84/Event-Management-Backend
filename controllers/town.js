const Town = require(`../models/Town`);
const ErrorResponse = require(`../utils/errorResponse`);
const asynchandler = require(`../middleware/async`);

// @desc Gett all towns
//@route GET /api/v1/town
// @access Public
exports.getTowns = asynchandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});
