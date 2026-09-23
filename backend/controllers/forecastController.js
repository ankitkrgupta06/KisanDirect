const Demand = require("../models/Demand");

const {
  generateForecast,
  seedDemandData,
} = require("../services/forecastService");

// =========================
// GET DEMAND FORECAST
// =========================

const getForecast = async (req, res) => {
  try {
    const {
      crop = "Tomato",
      location = "Bhagalpur",
      days = 7,
    } = req.query;

    const forecast = await generateForecast(
      crop,
      location,
      Number(days)
    );

    res.json({
      success: true,
      crop,
      location,
      days: Number(days),
      forecast,
    });
  } catch (error) {
    console.error(
      "GET FORECAST ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// ADD DEMAND DATA
// =========================

const addDemandData = async (req, res) => {
  try {
    const {
      cropName,
      demand,
      location,
      date,
    } = req.body;

    if (
      !cropName ||
      demand === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Crop name and demand are required.",
      });
    }

    const record = await Demand.create({
      cropName,
      demand,
      location: location || "Bhagalpur",
      date: date || new Date(),
    });

    res.status(201).json({
      success: true,
      record,
    });
  } catch (error) {
    console.error(
      "ADD DEMAND DATA ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// SEED DEMO DATA
// =========================

const seedData = async (req, res) => {
  try {
    await seedDemandData();

    res.json({
      success: true,
      message:
        "Demand demo data ready.",
    });
  } catch (error) {
    console.error(
      "SEED DEMAND DATA ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// ML MARKET PRICE PREDICTION
// =========================

const predictMarketPrice = async (
  req,
  res
) => {
  try {
    const {
      commodity,
      market,
      variety,
    } = req.body;

    // -------------------------
    // Validate input
    // -------------------------

    if (!commodity) {
      return res.status(400).json({
        success: false,
        message:
          "Commodity is required.",
      });
    }

    // -------------------------
    // Send request to Python ML
    // service
    // -------------------------

    const response = await fetch(
      `${process.env.ML_SERVICE_URL}/predict`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          Commodity: commodity,
          Market:
            market || "Bhagalpur",
          Variety: variety,
        }),
      }
    );

    // -------------------------
    // Read ML response
    // -------------------------

    const data =
      await response.json();

    // -------------------------
    // Handle ML errors
    // -------------------------

    if (!response.ok) {
      return res
        .status(response.status)
        .json(data);
    }

    // -------------------------
    // Return prediction
    // -------------------------

    res.json(data);
  } catch (error) {
    console.error(
      "ML PRICE PREDICTION ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "ML service is unavailable. Please make sure the Python ML server is running on port 8000.",
    });
  }
};

// =========================
// EXPORT CONTROLLERS
// =========================

module.exports = {
  getForecast,
  addDemandData,
  seedData,
  predictMarketPrice,
};