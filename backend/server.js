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

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://kisan-direct-delta.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// routes AFTER CORS
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.use(express.json());
app.use("/uploads", express.static("uploads"));


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

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  () => {
    console.log(
      `Server running on http://localhost:${PORT}`
    );
  }
);