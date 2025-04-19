import express from "express";
import {
  createEnquiryController,
  getAllEnquiriesController,
  getEnquiryByIdController,
  updateEnquiryStatusController,
} from "../controllers/enquiry.controller.js";
import isAuthenticated from "../middlewares/authenticateUser.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";


const router = express.Router();

router.post("/:planId", isAuthenticated, authorizeRoles("user"), createEnquiryController);
router.get("/", isAuthenticated, authorizeRoles("admin", "superadmin"), getAllEnquiriesController);
router.get("/:id", isAuthenticated, authorizeRoles("admin", "superadmin"), getEnquiryByIdController);
router.put("/:id", isAuthenticated, authorizeRoles("admin", "superadmin"), updateEnquiryStatusController);


export default router;