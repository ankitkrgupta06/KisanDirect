const Feedback = require("../models/Feedback");
const Order = require("../models/Order");

// ========================================
// SUBMIT FEEDBACK
// ========================================
const submitFeedback = async (req, res) => {
  try {
    const {
      orderId,
      rating,
      comment,
      deliveryCondition,
    } = req.body;

    // Validate required fields
    if (!orderId || !rating || !deliveryCondition) {
      return res.status(400).json({
        success: false,
        message:
          "Order ID, rating and delivery condition are required.",
      });
    }

    // Find order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Make sure the logged-in buyer owns this order
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to submit feedback for this order.",
      });
    }

    // Feedback only after delivery
    if (order.status !== "DELIVERED") {
      return res.status(400).json({
        success: false,
        message:
          "Feedback can only be submitted after the order is delivered.",
      });
    }

    // Validate rating
    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({
      order: orderId,
    });

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: "Feedback has already been submitted for this order.",
      });
    }

    // Create feedback
    const feedback = await Feedback.create({
      order: orderId,
      buyer: req.user._id,
      rating: Number(rating),
      comment: comment || "",
      deliveryCondition,
      photo: req.file ? `/uploads/${req.file.filename}` : null,
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully.",
      feedback,
    });
  } catch (error) {
    console.error("SUBMIT FEEDBACK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// GET FEEDBACK FOR AN ORDER
// ========================================
const getOrderFeedback = async (req, res) => {
  try {
    const { orderId } = req.params;

    const feedback = await Feedback.findOne({
      order: orderId,
    })
      .populate("buyer", "name email")
      .populate("order");

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "No feedback found for this order.",
      });
    }

    return res.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("GET ORDER FEEDBACK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// GET BUYER'S FEEDBACK
// ========================================
const getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({
      buyer: req.user._id,
    })
      .populate("order")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("GET MY FEEDBACK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  submitFeedback,
  getOrderFeedback,
  getMyFeedback,
};