const Order = require("../models/Order");
const Product = require("../models/Product");

const {
  matchProducts,
} = require("../services/matchingService");


// =========================
// CREATE ORDER
// =========================

const createOrder = async (req, res) => {
  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({
        success: false,
        message:
          "Only buyers can place orders.",
      });
    }

    const {
      cropName,
      quantity,
      deliveryLocation,
      deliveryLatitude,
      deliveryLongitude,
    } = req.body;

    if (
      !cropName ||
      !quantity ||
      !deliveryLocation
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Crop, quantity and delivery location are required.",
      });
    }

    // Find products from multiple farmers
    const matching =
      await matchProducts(
        cropName,
        quantity
      );

    if (!matching.fullyMatched) {
      return res.status(400).json({
        success: false,
        message:
          "Not enough inventory available.",
        matching,
      });
    }

    const items =
      matching.matches.map((match) => ({
        product: match.productId,

        farmer: match.farmer.id,

        quantity:
          match.allocatedQuantity,

        price:
          match.pricePerUnit,

        subtotal:
          match.subtotal,
      }));

    const totalAmount =
      items.reduce(
        (total, item) =>
          total + item.subtotal,
        0
      );

    const order = await Order.create({
      buyer: req.user._id,

      items,

      totalAmount,

      deliveryLocation,

      deliveryLatitude,

      deliveryLongitude,

      status: "PENDING",
    });

    // Reserve inventory
    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) continue;

      product.quantity -= item.quantity;

      if (product.quantity <= 0) {
        product.quantity = 0;
        product.status = "SOLD";
      } else {
        product.status = "AVAILABLE";
      }

      await product.save();
    }

    const populatedOrder =
      await Order.findById(order._id)
        .populate(
          "buyer",
          "name email phone location"
        )
        .populate(
          "items.product"
        )
        .populate(
          "items.farmer",
          "name location phone"
        );

    res.status(201).json({
      success: true,
      message:
        "Order created successfully.",
      order: populatedOrder,
      matching,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================
// BUYER ORDERS
// =========================

const getBuyerOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await Order.find({
        buyer: req.user._id,
      })
        .populate(
          "items.product"
        )
        .populate(
          "items.farmer",
          "name location phone"
        )
        .sort({
          createdAt: -1,
        });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================
// FARMER ORDERS
// =========================

const getFarmerOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await Order.find({
        "items.farmer":
          req.user._id,
      })
        .populate(
          "buyer",
          "name phone location"
        )
        .populate(
          "items.product"
        )
        .sort({
          createdAt: -1,
        });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================
// UPDATE ORDER STATUS
// =========================

const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const {
      status,
    } = req.body;

    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "PICKED_UP",
      "IN_TRANSIT",
      "DELIVERED",
      "CANCELLED",
    ];

    if (
      !validStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.status = status;

    await order.save();

    res.json({
      success: true,
      message:
        "Order status updated.",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================
// GET SINGLE ORDER
// =========================

const getOrderById = async (
  req,
  res
) => {
  try {
    const order =
      await Order.findById(
        req.params.id
      )
        .populate(
          "buyer",
          "name email phone location"
        )
        .populate(
          "items.product"
        )
        .populate(
          "items.farmer",
          "name location phone"
        );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  createOrder,
  getBuyerOrders,
  getFarmerOrders,
  updateOrderStatus,
  getOrderById,
};