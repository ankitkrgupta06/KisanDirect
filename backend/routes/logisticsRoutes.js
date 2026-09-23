const express = require("express");

const {
  optimizeOrderRoute,
  getOrderRoute,
} = require("../controllers/logisticsController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();


// Optimize route
router.post(
  "/optimize",
  protect,
  optimizeOrderRoute
);


// Get saved order route
router.get(
  "/order/:id",
  protect,
  getOrderRoute
);


module.exports = router;