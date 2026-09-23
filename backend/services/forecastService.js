const Demand = require("../models/Demand");

// Demo date for hackathon
const DEMO_TODAY = new Date("2026-09-03T00:00:00");

// =========================
// MOVING AVERAGE FORECAST
// =========================

const generateForecast = async (
  cropName,
  location,
  days = 7
) => {
  const historicalData = await Demand.find({
    cropName: {
      $regex: `^${cropName}$`,
      $options: "i",
    },
    location: {
      $regex: location || "",
      $options: "i",
    },
  })
    .sort({
      date: -1,
    })
    .limit(30);

  let baseDemand = 100;

  if (historicalData.length > 0) {
    const total = historicalData.reduce(
      (sum, item) => sum + item.demand,
      0
    );

    baseDemand =
      total / historicalData.length;
  }

  const forecast = [];

  for (let i = 1; i <= days; i++) {
    const date = new Date(DEMO_TODAY);

    date.setDate(
      date.getDate() + i
    );

    // Small trend for demo purposes
    const trendMultiplier =
      1 + ((i % 3) - 1) * 0.04;

    const predictedDemand = Math.round(
      baseDemand * trendMultiplier
    );

    let trend = "STABLE";

    if (trendMultiplier > 1.01) {
      trend = "UP";
    } else if (trendMultiplier < 0.99) {
      trend = "DOWN";
    }

    forecast.push({
      cropName,
      location,
      date:
        date.toISOString().split("T")[0],
      predictedDemand,
      trend,
    });
  }

  return {
    cropName,
    location,
    historicalRecords:
      historicalData.length,
    averageDemand:
      Math.round(baseDemand),
    forecast,
  };
};

// =========================
// SEED DEMAND DATA
// =========================

const seedDemandData = async () => {
  const count =
    await Demand.countDocuments();

  if (count > 0) {
    return;
  }

  const crops = [
    "Tomato",
    "Potato",
    "Onion",
  ];

  const data = [];

  for (let i = 30; i >= 1; i--) {
    for (const crop of crops) {
      const date = new Date(DEMO_TODAY);

      date.setDate(
        date.getDate() - i
      );

      const demand =
        100 +
        Math.floor(
          Math.random() * 80
        );

      data.push({
        cropName: crop,
        date,
        demand,
        location: "Bhagalpur",
      });
    }
  }

  await Demand.insertMany(data);

  console.log(
    "Demo demand data inserted."
  );
};

module.exports = {
  generateForecast,
  seedDemandData,
};