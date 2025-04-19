import Member from "../models/member.model.js";
import Task from "../models/task.model.js";

export const assignMemberToTask = async (req, res) => {
  const { taskId, memberId, forceAssign = false } = req.body;

  const member = await Member.findById(memberId);
  const task = await Task.findById(taskId);

  if (!member || !task) {
    return res.status(404).json({ success: false, message: 'Member or Task not found' });
  }

  // calculate workload
  const memberTasks = await Task.find({ assignedTo: memberId, status: { $ne: 'Completed' } });
  const totalHoursAssigned = memberTasks.reduce((sum, t) => sum + t.estimatedHours, 0);
  const willBeOverloaded = totalHoursAssigned + task.estimatedHours > member.availableHours;
  
  // prevent assignment and show overload warning if overallocated
  if (willBeOverloaded && !forceAssign) {
    return res.status(200).json({
      success: false,
      warning: true,
      message: 'Assigning this task will overload the member',
      data: { member, task, totalHoursAssigned, availableHours: member.availableHours }
    });
  }

  // assign task if not overloaded or force assigning
  task.assignedTo = memberId;
  await task.save();

  res.status(200).json({
    success: true,
    message: willBeOverloaded
      ? 'Task assigned with overload'
      : 'Task assigned successfully',
    data: task
  });
};


export const getMemberSuggestions = async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.findById(taskId);

  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  const members = await Member.find();
  const today = new Date();
  const start = new Date(today.toDateString());
  const end = new Date(task.deadline.toDateString());
  // including the deadline day  
  const oneDayMs = 1000 * 60 * 60 * 24;
  const daysUntilDeadline = Math.floor((end - start) / oneDayMs) + 1;

  const availableMembers = [];

  for (const member of members) {
    const totalAvailableTime = daysUntilDeadline * member.availableHours;

    // get all tasks assigned to this member that are due in this window
    const memberTasks = await Task.find({
      assignedTo: member._id,
      deadline: { $gte: today, $lte: task.deadline }
    });

    const currentLoad = memberTasks.reduce((sum, t) => sum + t.estimatedHours, 0);
    const remainingCapacity = totalAvailableTime - currentLoad; // remaining Capacity = available working hours for the member before the task’s deadline, minus the hours already taken by other tasks during that same time window

    if (remainingCapacity >= task.estimatedHours) {
      availableMembers.push({
        member,
        currentLoad,
        remainingCapacity
      });
    }
  }

  // sort by member with least current load
  availableMembers.sort((a, b) => a.currentLoad - b.currentLoad);

  res.status(200).json({
    success: true,
    data: availableMembers
  });
};


export const unassignMemberFromTask = async (req, res) => {
  const { taskId } = req.body;
  const task = await Task.findById(taskId);

  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  if (!task.assignedTo) {
    return res.status(400).json({ success: false, message: 'Task is not assigned to anyone' });
  }

  task.assignedTo = undefined;
  await task.save();

  res.status(200).json({
    success: true,
    message: 'Task unassigned successfully',
    data: task,
  });
}