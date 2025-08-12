// app.js (or server entry file where you created `app`)
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";

// Import routes
import userRouter from "./routes/user.routes.js";
import categoryRouter from "./routes/category.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import designRoutes from "./routes/design.routes.js";
import productRoutes from "./routes/product.routes.js";

const app = express();

// --- CORS Configuration ---
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

// --- Core Middleware ---
// Increase limits: design payloads can be large (many elements + base64). Adjust if you want bigger.
const BODY_LIMIT = process.env.BODY_LIMIT || "10mb";

app.use(express.json({ limit: BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: BODY_LIMIT }));
app.use(express.static("public"));
app.use(cookieParser());

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running properly",
    timestamp: new Date().toISOString(),
  });
});

// --- Route Declarations ---
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/designs", designRoutes);
app.use("/api/v1/products", productRoutes);

// Handle undefined routes
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// --- Global Error Handling Middleware ---
app.use(errorHandler);

export { app };
