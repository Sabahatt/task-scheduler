import express from "express";
const router = express.Router();
import {
  getDashboardSummary
} from "../controllers/dashboard.controller.js";
import asyncHandler from "../middlewares/asyncHandler.js";

router.get("/", asyncHandler(getDashboardSummary));

export default router;
