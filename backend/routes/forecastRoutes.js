const express = require("express");

const {
  getForecast,
  addDemandData,
  seedData,
  predictMarketPrice,
} = require("../controllers/forecastController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get demand forecast
router.get(
  "/",
  getForecast
);

// Add demand record
router.post(
  "/demand",
  protect,
  addDemandData
);

// Insert demo demand data
router.post(
  "/seed",
  seedData
);

// ML market price prediction
router.post(
  "/price",
  predictMarketPrice
);

module.exports = router;