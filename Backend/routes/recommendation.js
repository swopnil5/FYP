const express = require("express");
const { getRecommendations, getNearbyRecommendations } = require("../controllers/recommendation");
const router = express.Router();


router.get("/", getRecommendations);
router.get("/nearby", getNearbyRecommendations);

module.exports = router;
