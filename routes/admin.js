const router = require("express").Router({ mergeParams: true });

const { getAllUsers, getAllVenues } = require(`../controllers/admin`);

// const User = require("../models/User");
// const advancedResults = require("../middleware/advancedResults");
// const { protect, authorize } = require("../middleware/auth");

// router.use(protect);
// router.use(authorize("admin"));

router.route("/users").get(getAllUsers);

router.route("/venues").get(getAllVenues);

module.exports = router;
