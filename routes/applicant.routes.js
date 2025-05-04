import express from "express";
import isAuthenticated from "../middlewares/authenticateUser.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";
import { createApplicant, getAllApplicants, getApplicantById, getApplicantsByJobId } from "../controllers/applicant.controller.js";


const router = express.Router();

// Apply For the JOB
router.post("/apply/:id", isAuthenticated, authorizeRoles("user"), createApplicant);

// GET all Applicants
router.get("/", isAuthenticated, authorizeRoles("admin", "superadmin"), getAllApplicants);

// Get All Applications Of Particular JOB
router.get("/applicants/:id", isAuthenticated, authorizeRoles("admin", "superadmin"), getApplicantsByJobId);

// Get Applicant by Applicant id
router.get("/applicant/:id", isAuthenticated, authorizeRoles("admin", "superadmin"), getApplicantById)

export default router;