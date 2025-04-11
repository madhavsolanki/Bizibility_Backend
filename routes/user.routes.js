import express from "express";
import {
  getAllUsersInfo,
  getUserInfo,
  loginUSer,
  registerUser,
  updateUser,
} from "../controllers/user.controller.js";
import { uploadProfileImage } from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUSer);

router.put(
  "/update/:id",
  uploadProfileImage.single("profile_image"),
  updateUser
);

router.get("/:id", getUserInfo);

router.get("/", getAllUsersInfo);

export default router;
