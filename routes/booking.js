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
  .post(protect, createBooking);

router.route("/accept").put(acceptBooking);

router.route("/delete/:id").delete(deleteBooking);

router.route("/vendor/:id").get(protect, getAllBookingsByVendor);
router.route("/venue/:id").get(getAllBookingsByVenue);

module.exports = router;
