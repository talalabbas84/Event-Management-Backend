const router = require("express").Router({ mergeParams: true });

const {
  getAllUsers,
  getAllVenues,
  toggleUserAccount,
} = require(`../controllers/admin`);

// const User = require("../models/User");
// const advancedResults = require("../middleware/advancedResults");
// const { protect, authorize } = require("../middleware/auth");

// router.use(protect);
// router.use(authorize("admin"));

router.route("/users").get(getAllUsers);

router.route("/venues").get(getAllVenues);

router.route("/users/:id").put(toggleUserAccount);

module.exports = router;
