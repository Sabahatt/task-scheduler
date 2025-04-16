import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import taskRoutes from "./routes/task.route.js";
import memberRoutes from "./routes/member.route.js";
import assignmentRoutes from './routes/assignment.route.js'
import dashboardRoutes from './routes/dashboard.route.js'
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
app.use(express.json());

// routes
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/members", memberRoutes);
app.use("/api/v1/assignment", assignmentRoutes);
app.use("/api/v1/summary", dashboardRoutes);

// global error handler
app.use(errorHandler);

app.listen(5000, () => {
  connectDB();
  console.log("Server started at http://localhost:5000");
});
