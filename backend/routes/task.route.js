import express from "express";
const router = express.Router();
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/task.controller.js";
import asyncHandler from "../middlewares/asyncHandler.js";

router.get("/", asyncHandler(getAllTasks));
router.get("/:id", asyncHandler(getTaskById));
router.post("/", asyncHandler(createTask));
router.put("/:id", asyncHandler(updateTask));
router.patch("/:id/status", asyncHandler(updateTaskStatus));
router.delete("/:id", asyncHandler(deleteTask));

export default router;
