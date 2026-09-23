const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

dotenv.config();


// =========================
// APP
// =========================

const app = express();


// =========================
// DATABASE
// =========================

connectDB();


// =========================
// MIDDLEWARE
// =========================

const corsOptions = {
  origin: "https://kisan-direct-delta.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.options(/.*/, cors(corsOptions));

app.use(express.json());
// =========================
// HEALTH CHECK
// =========================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "KisanDirect API is running",
    status: "success",
  });
});


// =========================
// API ROUTES
// =========================

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/products",
  require("./routes/productRoutes")
);

app.use(
  "/api/orders",
  require("./routes/orderRoutes")
);

app.use(
  "/api/forecast",
  require("./routes/forecastRoutes")
);

app.use(
  "/api/logistics",
  require("./routes/logisticsRoutes")
);

app.use(
  "/api/feedback",
  require("./routes/feedbackRoutes")
);


// =========================
// ERROR HANDLING
// =========================

app.use(notFound);

app.use(errorHandler);


// =========================
// SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});