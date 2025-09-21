require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const connectDatabase = require("./config/db");

const app = express();

// Security middlewares
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Set-Cookie"],
  })
);

// Connect to the database
connectDatabase();

// Route definitions
const routes = {
  auth: require("./routes/authRoutes"),
  products: require("./routes/productRoutes"),
  users: require("./routes/UserRoutes"),
  admin: require("./routes/adminRoutes"),
  seller: require("./routes/sellerRoutes"),
  cart: require("./routes/cartRoutes"),
  orders: require("./routes/orderRoutes"),
};

// Register routes dynamically
Object.entries(routes).forEach(([key, route]) => {
  app.use(`/api/${key}`, route);
});

// Root endpoint
app.get("/", (req, res) => res.send("Secure E-Commerce API Running..."));

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  // Add any cleanup logic here (e.g., closing DB connections)
  process.exit(0);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
