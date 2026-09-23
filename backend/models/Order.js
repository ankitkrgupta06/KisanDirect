const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        farmer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        quantity: {
          type: Number,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        subtotal: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    deliveryLocation: {
      type: String,
      required: true,
    },

    deliveryLatitude: {
      type: Number,
      default: null,
    },

    deliveryLongitude: {
      type: Number,
      default: null,
    },

    status: {
      type: String,

      enum: [
        "PENDING",
        "CONFIRMED",
        "PICKED_UP",
        "IN_TRANSIT",
        "DELIVERED",
        "CANCELLED",
      ],

      default: "PENDING",
    },

    route: [
      {
        location: String,
        latitude: Number,
        longitude: Number,
      },
    ],
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);