const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Root route (test)
app.get("/", (req, res) => {
  console.log("api is running")
  res.status(200).json({ message: "API is running..." });
});

app.use("/api/vendor", require("./routes/vendorRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));


module.exports = app;
