require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const AppError = require("./utils/AppError");

const authRoutes = require("./routes/authRoutes");
const clientRoutes = require("./routes/clientRoutes");
const reportClientRoutes = require("./routes/reportClientRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Serve Swagger UI at /api-docs (no separate routes/controllers used)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Optional: raw JSON
app.get("/swagger.json", (req, res) => res.json(swaggerDocument));

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/report-clients", reportClientRoutes);
app.use("/api/employees", employeeRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
