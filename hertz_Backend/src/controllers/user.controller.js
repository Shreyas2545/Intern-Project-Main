import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found during token generation");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, `Token generation failed: ${error.message}`);
  }
};

const registerUser = AsyncHandler(async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  if ([fullName, email, password, confirmPassword].some((f) => !f?.trim())) {
    throw new ApiError(400, "All fields are required");
  }
  if (password !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const user = await User.create({ fullName, email, password });
  const createdUser = await User.findById(user._id);
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    createdUser._id,
  );
  const loggedInUser = await User.findById(createdUser._id).select(
    "-password -refreshToken",
  );
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        { user: loggedInUser, accessToken },
        "User registered and logged in successfully",
      ),
    );
});

const loginUser = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    throw new ApiError(400, "Email and password are required");
  }

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const adminUser = {
      _id: "admin_user_id",
      fullName: "Admin",
      email: process.env.ADMIN_EMAIL,
      isAdmin: true,
    };
    const accessToken = jwt.sign(
      { _id: adminUser._id, email: adminUser.email, isAdmin: true },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" },
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: adminUser, accessToken },
          "Admin logged in successfully",
        ),
      );
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        "User logged in successfully",
      ),
    );
});

const logoutUser = AsyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true },
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getCurrentUser = AsyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateUserProfile = AsyncHandler(async (req, res) => {
  const updateData = {};
  const { fullName } = req.body;

  // Update fullName
  if (fullName?.trim()) {
    updateData.fullName = fullName.trim();
  }

  // Handle avatar upload
  if (req.file) {
    const avatar = await uploadOnCloudinary(req.file.path);
    if (!avatar?.url) {
      throw new ApiError(400, "Error while uploading avatar.");
    }
    updateData.avatar = avatar.url;
  }

  // Update nested address fields using dot notation
  ["streetAddress", "city", "state", "postalCode", "country"].forEach(
    (field) => {
      if (req.body[field] !== undefined) {
        updateData[`address.${field}`] = req.body[field].trim();
      }
    },
  );

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateData },
    { new: true, runValidators: true },
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

// =======================================================
// --- ADDRESS CONTROLLER FUNCTIONS (UNCHANGED) ---
// =======================================================

const addAddress = AsyncHandler(async (req, res) => {
  const { name, streetAddress, city, state, postalCode, country } = req.body;

  if (!name || !streetAddress || !city || !state || !postalCode || !country) {
    throw new ApiError(400, "All required address fields must be provided.");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const newAddress = { name, streetAddress, city, state, postalCode, country };
  user.addresses.push(newAddress);
  await user.save({ validateBeforeSave: false });
  const savedAddress = user.addresses[user.addresses.length - 1];

  return res
    .status(201)
    .json(new ApiResponse(201, savedAddress, "Address added successfully."));
});

const getAddresses = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("addresses");
  if (!user) {
    throw new ApiError(404, "User not found.");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, user.addresses, "Addresses fetched successfully."),
    );
});

const updateAddress = AsyncHandler(async (req, res) => {
  const { id: addressId } = req.params;
  const newAddressData = req.body;

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw new ApiError(400, "Invalid address ID format.");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const idx = user.addresses.findIndex((a) => a._id.toString() === addressId);
  if (idx === -1) {
    throw new ApiError(404, "Address not found.");
  }

  Object.keys(newAddressData).forEach((key) => {
    user.addresses[idx][key] = newAddressData[key];
  });

  await user.save({ validateBeforeSave: false });
  const updatedAddress = user.addresses[idx];

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedAddress, "Address updated successfully."),
    );
});

const deleteAddress = AsyncHandler(async (req, res) => {
  const { id: addressId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw new ApiError(400, "Invalid address ID format.");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const before = user.addresses.length;
  user.addresses = user.addresses.filter((a) => a._id.toString() !== addressId);

  if (user.addresses.length === before) {
    throw new ApiError(404, "Address not found to delete.");
  }

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Address deleted successfully."));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserProfile,
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
};
