import Member from "../models/member.model.js";
import Task from "../models/task.model.js";

export const assignMemberToTask = async (req, res) => {
  const { taskId, memberId, forceAssign = false } = req.body;

  const member = await Member.findById(memberId);
  const task = await Task.findById(taskId);

  if (!member || !task) {
    return res
      .status(404)
      .json({ success: false, message: "Member or Task not found" });
  }

  // get incomplete assigned tasks
  const memberTasks = await Task.find({
    assignedTo: memberId,
    status: { $ne: "Completed" },
  });

  // calculate total assigned hours including new task
  const totalHoursAssigned = memberTasks.reduce(
    (sum, t) => sum + t.estimatedHours,
    0
  );

  // calculate days available until task deadline including current date and deadline
  const today = new Date();
  const daysUntilDeadline =
    Math.floor((task.deadline - today) / (1000 * 60 * 60 * 24)) + 1;

  // Calculate the total available hours the member can work
  const availableHoursForNewTask = member.availableHours * daysUntilDeadline;
  const combinedTotalHours = totalHoursAssigned + task.estimatedHours;

  const willBeOverloaded = combinedTotalHours > availableHoursForNewTask;

  // prevent task assignment if overloaded and not forcing the assignment
  if (willBeOverloaded && !forceAssign) {
    return res.status(200).json({
      success: false,
      warning: true,
      message: "Assigning this task will overload the member",
      data: {
        member,
        task,
        totalHoursAssigned,
        availableHours: availableHoursForNewTask,
      },
    });
  }

  task.assignedTo = memberId;
  await task.save();

  res.status(200).json({
    success: true,
    message: willBeOverloaded
      ? "Task assigned with overload"
      : "Task assigned successfully",
    data: task,
  });
};

export const getMemberSuggestions = async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.findById(taskId);

  if (!task) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  const members = await Member.find();
  const today = new Date();
  const daysUntilDeadline =
    Math.floor((task.deadline - today) / (1000 * 60 * 60 * 24)) + 1;

  const availableMembers = [];

  for (const member of members) {
    const totalAvailableTime = daysUntilDeadline * member.availableHours;

    // get all assigned
    const memberTasks = await Task.find({
      assignedTo: member._id,
      status: { $ne: "Completed" },
    });

    const currentLoad = memberTasks.reduce(
      (sum, t) => sum + t.estimatedHours,
      0
    );
    const remainingCapacity = totalAvailableTime - currentLoad;

    const isOverloaded = currentLoad > totalAvailableTime;

    // consider members who have sufficient remaining capacity and are not overloaded
    if (remainingCapacity >= task.estimatedHours && !isOverloaded) {
      availableMembers.push({
        member,
        currentLoad,
        remainingCapacity,
      });
    }
  }

  // sort available members by least current load
  availableMembers.sort((a, b) => a.currentLoad - b.currentLoad);

  res.status(200).json({
    success: true,
    data: availableMembers,
  });
};

export const unassignMemberFromTask = async (req, res) => {
  const { taskId } = req.body;
  const task = await Task.findById(taskId);

  if (!task) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  if (!task.assignedTo) {
    return res
      .status(400)
      .json({ success: false, message: "Task is not assigned to anyone" });
  }

  task.assignedTo = undefined;
  await task.save();

  res.status(200).json({
    success: true,
    message: "Task unassigned successfully",
    data: task,
  });
};
