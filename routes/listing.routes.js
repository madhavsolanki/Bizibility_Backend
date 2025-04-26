import express from 'express';
import isAuthenticated from '../middlewares/authenticateUser.middleware.js';
import { authorizeRoles } from '../middlewares/authorization.middleware.js';
import { createListingController } from '../controllers/listing.controller.js';

const router = express.Router();

router .post("/create/:planId", isAuthenticated, authorizeRoles("user"), createListingController);

  export default router;