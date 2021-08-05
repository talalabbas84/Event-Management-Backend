const router = require("express").Router({ mergeParams: true });

const { getTowns } = require(`../controllers/town`);

router.route("/").get(getTowns);

module.exports = router;
