const Town = require(`../models/Town`);
const asynchandler = require(`../middleware/async`);

// @desc Gett all towns
//@route GET /api/v1/town
// @access Public
exports.getTowns = asynchandler(async (req, res, next) => {
  const towns = await Town.find({});
  res.status(200).json({ success: true, count: towns.length, data: towns });
});
