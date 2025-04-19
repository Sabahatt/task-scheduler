import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Member from "../models/member.model.js";
import Task from "../models/task.model.js";

dotenv.config();

const seedData = async () => {
  await connectDB();

  // Clear old data
  await Task.deleteMany();
  await Member.deleteMany();

  // Insert members
  const members = await Member.insertMany([
    { memberName: "Diana Wells", availableHours: 4 },
    { memberName: "John Carter", availableHours: 6 },
    { memberName: "Maya Singh", availableHours: 8 },
    { memberName: "Omar Idris", availableHours: 2 },
    { memberName: "Elena Morales", availableHours: 10 },
    { memberName: "Akash Mehta", availableHours: 5 },
  ]);

  // Insert tasks
  const tasks = [
    {
      title: "Design UI components",
      description: "Task cards and layout tweaks.",
      priority: "High",
      estimatedHours: 12,
      startDate: new Date(),
      deadline: new Date(Date.now() + 4 * 86400000),
      status: "In Progress",
      assignedTo: members[0]._id,
    },
    {
      title: "Build timeline view",
      description: "Timeline with task mapping.",
      priority: "High",
      estimatedHours: 20,
      startDate: new Date(),
      deadline: new Date(Date.now() + 7 * 86400000),
      status: "Pending",
      assignedTo: members[3]._id,
    },
    {
      title: "Setup user authentication",
      description: "JWT login and session logic.",
      priority: "Medium",
      estimatedHours: 8,
      startDate: new Date(),
      deadline: new Date(Date.now() + 3 * 86400000),
      status: "Pending",
      assignedTo: members[1]._id,
    },
    {
      title: "Add Swagger documentation",
      description: "Document all APIs for frontend use.",
      priority: "Low",
      estimatedHours: 4,
      startDate: new Date(),
      deadline: new Date(Date.now() + 2 * 86400000),
      status: "Completed",
      endDate: new Date(Date.now() + 1 * 86400000),
      assignedTo: members[2]._id,
    },
    {
      title: "Fix date bugs",
      description: "Fix deadline display issues across timezones.",
      priority: "Low",
      estimatedHours: 2,
      startDate: new Date(),
      deadline: new Date(Date.now() + 1 * 86400000),
      status: "Completed",
      endDate: new Date(),
      assignedTo: members[4]._id,
    },
    {
      title: "Optimize queries",
      description: "Add indexes and lean queries for tasks.",
      priority: "Medium",
      estimatedHours: 10,
      startDate: new Date(),
      deadline: new Date(Date.now() + 5 * 86400000),
      status: "In Progress",
      assignedTo: members[5]._id,
    },
  ];

  await Task.insertMany(tasks);

  console.log("✅ Demo data seeded successfully!");
  mongoose.connection.close();
};

seedData();
