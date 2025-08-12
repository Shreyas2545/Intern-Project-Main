import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = AsyncHandler(async (req, _, next) => {
  try {
    // 1. Get the token from cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace(/^Bearer\s+/i, "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request: No token provided");
    }

    // 2. Verify the token using the secret key
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 3. Find the user in DB based on token payload
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      // Token is valid but user no longer exists
      throw new ApiError(401, "Invalid Access Token: User not found");
    }

    // 4. Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    // Handle token expiration specifically
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Access Token has expired");
    }
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

export const verifyAdmin = AsyncHandler(async (req, _, next) => {
  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "Admin access only");
  }
  next();
});

export const optionalAuth = AsyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace(/^Bearer\s+/i, "");
    if (token) {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken",
      );
      if (user) req.user = user;
    }
    next();
  } catch {
    // Do NOT throw: optionalAuth just means "if valid, attach user; if not, continue unauth"
    next();
  }
});
