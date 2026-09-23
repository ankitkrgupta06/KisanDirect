const mongoose = require("mongoose");

const demandSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    demand: {
      type: Number,
      required: true,
    },

    location: {
      type: String,
      default: "",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Demand", demandSchema);