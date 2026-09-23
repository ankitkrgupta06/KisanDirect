const express = require("express");
const router = express.Router();

const {
  submitFeedback,
  getOrderFeedback,
  getMyFeedback,
} = require("../controllers/feedbackController");

const { protect } = require("../middleware/authMiddleware");

const multer = require("multer");

// ========================================
// MULTER CONFIGURATION
// ========================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`
    );
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// ========================================
// SUBMIT FEEDBACK
// ========================================

router.post(
  "/",
  protect,
  upload.single("photo"),
  submitFeedback
);

// ========================================
// GET FEEDBACK FOR AN ORDER
// ========================================

router.get(
  "/order/:orderId",
  protect,
  getOrderFeedback
);

// ========================================
// GET MY FEEDBACK
// ========================================

router.get(
  "/my",
  protect,
  getMyFeedback
);

module.exports = router;