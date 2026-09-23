const express = require("express");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require("../controllers/productController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();


// Public marketplace
router.get(
  "/",
  getProducts
);


// Farmer's own products
router.get(
  "/mine",
  protect,
  authorize("farmer"),
  getMyProducts
);


// Single product
router.get(
  "/:id",
  getProductById
);


// Add product
router.post(
  "/",
  protect,
  authorize("farmer"),
  createProduct
);


// Update product
router.put(
  "/:id",
  protect,
  authorize("farmer"),
  updateProduct
);


// Delete product
router.delete(
  "/:id",
  protect,
  authorize("farmer"),
  deleteProduct
);


module.exports = router;