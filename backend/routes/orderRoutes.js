const express = require("express");

const {
  createOrder,
  getBuyerOrders,
  getFarmerOrders,
  updateOrderStatus,
  getOrderById,
} = require("../controllers/orderController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();


// Create order
router.post(
  "/",
  protect,
  createOrder
);


// Buyer orders
router.get(
  "/buyer",
  protect,
  getBuyerOrders
);


// Farmer orders
router.get(
  "/farmer",
  protect,
  getFarmerOrders
);


// Get single order
router.get(
  "/:id",
  protect,
  getOrderById
);


// Update status
router.put(
  "/:id/status",
  protect,
  updateOrderStatus
);


module.exports = router;