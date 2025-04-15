import Task from "../models/task.model.js";

export const getAllTasks = async (req, res) => {
  const tasks = await Task.find().populate("assignedTo");
  res.status(200).json({
    success: true,
    message: "Tasks retrieved successfully",
    data: tasks,
  });
};

export const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id).populate("assignedTo");
  if (!task) throw new Error("Task not found");
  res.status(200).json({ success: true, message: "Task found", data: task });
};

export const createTask = async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json({ success: true, message: "Task created", data: task });
};

export const updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!task) throw new Error("Task not found");
  res.status(200).json({ success: true, message: "Task updated", data: task });
};

export const updateTaskStatus = async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!task) throw new Error("Task not found");
  res
    .status(200)
    .json({ success: true, message: "Status updated", data: task });
};

export const deleteTask = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) throw new Error("Task not found");
  res.status(200).json({ success: true, message: "Task deleted" });
};
