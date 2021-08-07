const router = require("express").Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

const {
  getVenue,
  getVenues,
  updateVenue,
  addVenue,
  deleteVenue,
  getVenuesByVendorID,
} = require(`../controllers/venue`);

router
  .route("/")
  .get(getVenues)
  .post(protect, authorize("vendor"), addVenue);

router.route("/vendor/:id").get(getVenuesByVendorID);

router
  .route("/:id")
  .get(getVenue)
  .put(protect, authorize("vendor"), updateVenue)
  .delete(protect, authorize("vendor"), deleteVenue);

module.exports = router;
