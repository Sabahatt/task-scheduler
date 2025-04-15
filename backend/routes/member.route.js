import express from "express";
const router = express.Router();
import {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
} from "../controllers/member.controller.js";
import asyncHandler from "../middlewares/asyncHandler.js";

router.get("/", asyncHandler(getAllMembers));
router.get("/:id", asyncHandler(getMemberById));
router.post("/", asyncHandler(createMember));
router.put("/:id", asyncHandler(updateMember));
router.delete("/:id", asyncHandler(deleteMember));

export default router;
