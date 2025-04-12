import express from "express";
import {
  forgotPassword,
  generateOtpForVerification,
  getAllUsersInfo,
  getUserInfo,
  loginUser,
  registerUser,
  resetPasswordWithOtp,
  updateUser,
  verifyOtpAndActivateUser,
} from "../controllers/user.controller.js";
import { uploadProfileImage } from "../middlewares/multer.js";

const router = express.Router();

// Register Route
router.post("/register", registerUser);

// Generate OTP Route
router.post("/generate-otp", generateOtpForVerification);

// Verify OTP Route
router.post("/verify-otp", verifyOtpAndActivateUser);

// Login Route
router.post("/login", loginUser)

// Forgot Password Route
router.post("/forgot-password", forgotPassword);

// Reset Password Route 
router.post("/reset-password", resetPasswordWithOtp);

// Update User Route
router.put(
  "/update/:id",
  uploadProfileImage.single("profile_image"),
  updateUser
);

// Get Particular user Information
router.get("/:id", getUserInfo);

// Get All Users Information
router.get("/", getAllUsersInfo);

export default router;
