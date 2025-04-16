import express from "express";
const router = express.Router();
import {
  assignMemberToTask,
  getMemberSuggestions
} from "../controllers/assignment.controller.js";
import asyncHandler from "../middlewares/asyncHandler.js";

router.post("/", asyncHandler(assignMemberToTask));
router.get("/suggestions/:taskId", asyncHandler(getMemberSuggestions));

export default router;