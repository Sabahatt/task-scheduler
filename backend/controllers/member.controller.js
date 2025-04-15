import Member from "../models/member.model.js";
import Task from "../models/task.model.js";

export const getAllMembers = async (req, res) => {
  const members = await Member.find();
  res
    .status(200)
    .json({ success: true, message: "Members retrieved", data: members });
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
