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

// update task status and set start and end dates accordingly
export const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  const updateFields = { status };
  //const normalizedStatus = status.toLowerCase();

  if (status === "In Progress") {
    updateFields.startDate = new Date();
  } else if (status === "Completed") {
    updateFields.endDate = new Date();
  }

  const task = await Task.findByIdAndUpdate(req.params.id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!task) throw new Error("Task not found");

  res.status(200).json({
    success: true,
    message: "Status updated",
    data: task,
  });
};

export const deleteTask = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) throw new Error("Task not found");
  res.status(200).json({ success: true, message: "Task deleted" });
};
