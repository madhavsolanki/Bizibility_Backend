import express from "express";
import isAuthenticated from "../middlewares/authenticateUser.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";
import {
  createCareerController,
  deleteCareerController,
  getAllActiveCareersController,
  getCareerByIdController,
  updateCareerController,
} from "../controllers/carrer.controller.js";

const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  authorizeRoles("admin", "superadmin"),
  createCareerController
);

router.get("/all-active", isAuthenticated, getAllActiveCareersController);

router.put(
  "/:careerId",
  isAuthenticated,
  authorizeRoles("admin", "superadmin"),
  updateCareerController
);

router.delete(
  "/:careerId",
  isAuthenticated,
  authorizeRoles("admin", "superadmin"),
  deleteCareerController
);


router.get(
  "/:careerId",
  isAuthenticated,
  getCareerByIdController
);

export default router;
