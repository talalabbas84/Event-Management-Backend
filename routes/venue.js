const router = require("express").Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

const {
  getVenue,
  getVenues,
  updateVenue,
  addVenue,
  deleteVenue,
} = require(`../controllers/venue`);

router
  .route("/")
  .get(getVenues)
  .post(addVenue);

router
  .route("/:id")
  .get(getVenue)
  .put(protect, authorize("vendor"), updateVenue)
  .delete(protect, authorize("vendor"), deleteVenue);

module.exports = router;
