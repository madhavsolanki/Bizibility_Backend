import express from 'express';
import isAuthenticated from '../middlewares/authenticateUser.middleware.js';
import { authorizeRoles } from '../middlewares/authorization.middleware.js';
import {
  createPlanController,
  updatePlanController,
  deletePlanController,
  getAllPlansController,
  getPlanByIdController,
  getPlansByDurationController
} from "../controllers/plan.controller.js";

const router = express.Router();


// Accessible by superadmin
router.post("/", isAuthenticated, authorizeRoles("superadmin"), createPlanController);
router.put("/:id", isAuthenticated, authorizeRoles("superadmin"), updatePlanController);
router.delete("/:id", isAuthenticated, authorizeRoles("superadmin"), deletePlanController);


// Accessible by all authenticated users
router.get("/", isAuthenticated, getAllPlansController);
router.get("/:id", isAuthenticated, getPlanByIdController);
router.get("/duration/:duration", getPlansByDurationController)


export default router;