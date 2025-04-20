import Member from "../models/member.model.js";
import Task from "../models/task.model.js";

export const getAllMembers = async (req, res) => {
  const members = await Member.find();

  const membersWithData = await Promise.all(
    members.map(async (member) => {
      const tasks = await Task.find({
        assignedTo: member._id,
        status: { $ne: "Completed" },
      });

      const taskCount = tasks.length;
      const totalAssignedHours = tasks.reduce(
        (sum, task) => sum + task.estimatedHours,
        0
      );

      // calculate the total available time based on the task deadlines
      const today = new Date();

      // if no tasks are assigned, consider the total available time as 0
      if (taskCount === 0) {
        return {
          ...member.toObject(),
          taskCount,
          assignedTasks: tasks,
          isOverloaded: false, // no tasks means not overloaded
        };
      }

      // find the maximum deadline among all tasks to determine the total available time
      const latestDeadline = Math.max(...tasks.map((task) => task.deadline));

      // calculate total available time for the member based on the maximum deadline
      const daysUntilLatestDeadline =
        Math.floor((latestDeadline - today) / (1000 * 60 * 60 * 24)) + 1;
      const totalAvailableTime =
        member.availableHours * daysUntilLatestDeadline;

      // check if the member is overloaded, assigned tasks exceed available time
      const isOverloaded = totalAssignedHours > totalAvailableTime;

      return {
        ...member.toObject(),
        taskCount,
        assignedTasks: tasks,
        isOverloaded,
      };
    })
  );

  res.status(200).json({
    success: true,
    message: "Members retrieved",
    data: membersWithData,
  });
};

export const getMemberById = async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) throw new Error("Member not found");

  const tasks = await Task.find({ assignedTo: member._id });
  res.status(200).json({
    success: true,
    message: "Member and their tasks",
    data: { member, tasks },
  });
};

export const createMember = async (req, res) => {
  const member = await Member.create(req.body);
  res
    .status(201)
    .json({ success: true, message: "Member created", data: member });
};

export const updateMember = async (req, res) => {
  const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!member) throw new Error("Member not found");
  res
    .status(200)
    .json({ success: true, message: "Member updated", data: member });
};

export const deleteMember = async (req, res) => {
  const member = await Member.findByIdAndDelete(req.params.id);
  if (!member) throw new Error("Member not found");

  await Task.updateMany(
    { assignedTo: member._id },
    { $unset: { assignedTo: "" } }
  );

  const unassignedTasks = await Task.find({ assignedTo: null }).sort({
    updatedAt: -1,
  });

  res.status(200).json({
    success: true,
    message: "Member deleted and tasks unassigned",
    data: unassignedTasks,
  });
};
