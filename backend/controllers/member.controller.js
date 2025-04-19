import Member from "../models/member.model.js";
import Task from "../models/task.model.js";

export const getAllMembers = async (req, res) => {
  // const members = await Member.find();
  
  // const membersWithTaskCount = await Promise.all(
  //   members.map(async (member) => {
  //     const taskCount = await Task.countDocuments({ assignedTo: member._id });
  //     return {
  //       ...member.toObject(),
  //       taskCount,
  //     };
  //   })
  // );
  // res
  //   .status(200)
  //   .json({ success: true, message: "Members retrieved", data: membersWithTaskCount });
  const members = await Member.find();

    const membersWithData = await Promise.all(
      members.map(async (member) => {
        const tasks = await Task.find({
          assignedTo: member._id,
          status: { $ne: "Completed" }
        });

        const taskCount = tasks.length;
        const totalAssignedHours = tasks.reduce(
          (sum, task) => sum + task.estimatedHours,
          0
        );

        const isOverloaded = totalAssignedHours > member.availableHours;

        return {
          ...member.toObject(),
          taskCount,
          assignedTasks: tasks,
          isOverloaded
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Members retrieved",
      data: membersWithData
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
