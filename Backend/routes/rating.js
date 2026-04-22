const express = require("express");
const { createRating, getRatingByServiceId, updateRating } = require("../controllers/ratings");
const router = express.Router();


router.post("/create", createRating);
router.put("/update/:ratingId", updateRating);
router.route("/byServiceId/:serviceId").get(getRatingByServiceId);

module.exports = router;
