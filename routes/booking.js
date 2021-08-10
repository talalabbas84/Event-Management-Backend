const router = require("express").Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

const {
  createBooking,
  getAllBookingsByVendor,
  acceptBooking,
  deleteBooking,
  getAllBookingsByVenue,
} = require(`../controllers/booking`);

router
  .route("/")
  // .get(getVenues)
  .post(protect, authorize("user"), createBooking);

router.route("/accept/:id").put(acceptBooking);

router.route("/delete/:id").delete(deleteBooking);

router.route("/vendor/:id").get(protect, getAllBookingsByVendor);
router.route("/venue/:id").get(getAllBookingsByVenue);

// router.route("/vendor/:id").get(getVenuesByVendorID);
// router
//   .route("/image/:id")
//   .post(addImageToVenue)
//   .put(RemoveImageFromVenue);

// router
//   .route("/:id")
//   .get(getVenue)
//   .put(protect, authorize("vendor"), updateVenue)
//   .delete(protect, authorize("vendor"), deleteVenue);

module.exports = router;
