const Product = require("../models/Product");


// =========================
// GET ALL PRODUCTS
// =========================

const getProducts = async (req, res) => {
  try {
    const {
      cropName,
      location,
    } = req.query;

    const filter = {
      status: "AVAILABLE",
      quantity: { $gt: 0 },
    };

    if (cropName) {
      filter.cropName = {
        $regex: cropName,
        $options: "i",
      };
    }

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    const products = await Product.find(filter)
      .populate(
        "farmer",
        "name email phone location latitude longitude"
      )
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================
// GET SINGLE PRODUCT
// =========================

const getProductById = async (req, res) => {
  try {
    const product =
      await Product.findById(req.params.id)
        .populate(
          "farmer",
          "name email phone location"
        );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================
// CREATE PRODUCT
// =========================

const createProduct = async (req, res) => {
  try {
    if (req.user.role !== "farmer") {
      return res.status(403).json({
        success: false,
        message:
          "Only farmers can add products.",
      });
    }

    const {
      cropName,
      quantity,
      unit,
      pricePerUnit,
      location,
      latitude,
      longitude,
      harvestDate,
    } = req.body;

    if (
      !cropName ||
      quantity === undefined ||
      pricePerUnit === undefined ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Crop, quantity, price and location are required.",
      });
    }

    const product = await Product.create({
      farmer: req.user._id,
      cropName,
      quantity,
      unit: unit || "kg",
      pricePerUnit,
      location,
      latitude,
      longitude,
      harvestDate,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully.",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================
// UPDATE PRODUCT
// =========================

const updateProduct = async (req, res) => {
  try {
    const product =
      await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (
      product.farmer.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only edit your own products.",
      });
    }

    const allowedFields = [
      "cropName",
      "quantity",
      "unit",
      "pricePerUnit",
      "location",
      "latitude",
      "longitude",
      "harvestDate",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();

    res.json({
      success: true,
      message: "Product updated.",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================
// DELETE PRODUCT
// =========================

const deleteProduct = async (req, res) => {
  try {
    const product =
      await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (
      product.farmer.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only delete your own products.",
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================
// FARMER PRODUCTS
// =========================

const getMyProducts = async (req, res) => {
  try {
    const products =
      await Product.find({
        farmer: req.user._id,
      }).sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
};