import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    memberName: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 30,
    },
    availableHours: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
  },
  {
    timestamps: true,
  }
);

const Member = mongoose.model("Member", memberSchema);

export default Member;
