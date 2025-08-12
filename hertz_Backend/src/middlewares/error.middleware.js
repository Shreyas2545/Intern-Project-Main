import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
  // Always log full error for debugging
  console.error(
    `\n[${new Date().toISOString()}] Error on ${req.method} ${req.originalUrl}`,
  );
  console.error(err.stack);

  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  // Mongoose CastError
  if (error.name === "CastError") {
    error = new ApiError(400, `Invalid ID: ${error.path}`);
  }
  // Duplicate key
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    error = new ApiError(400, `Duplicate ${field} entered`);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};
