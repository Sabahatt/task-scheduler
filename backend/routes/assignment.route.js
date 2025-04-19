import express from "express";
const router = express.Router();
import {
  assignMemberToTask,
  getMemberSuggestions,
  unassignMemberFromTask
} from "../controllers/assignment.controller.js";
import asyncHandler from "../middlewares/asyncHandler.js";

router.post("/", asyncHandler(assignMemberToTask));
router.post("/unassign", asyncHandler(unassignMemberFromTask));
router.get("/suggestions/:taskId", asyncHandler(getMemberSuggestions));

export default router;