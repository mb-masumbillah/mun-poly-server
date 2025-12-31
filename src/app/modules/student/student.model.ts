import { Schema, model, Types } from "mongoose";
import { TStudent } from "./student.interface";

const studentSchema = new Schema<TStudent>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User id is required"],
      ref: "User",
    },

    roll: {
      type: String,
      required: true,
      unique: true,
    },
    registration: {
      type: String,
      required: true,
      unique: true,
    },
    department: {
      type: String,
      required: true,
      enum: ["CST", "EEE", "Civil", "Mechanical"],
    },
    session: {
      type: String,
      required: true,
      match: /^\d{4}-\d{4}$/,
    },
    shift: {
      type: String,
      required: true,
      enum: ["1st", "2nd"],
    },
    semester: {
      type: String,
      required: true,
      enum: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    number: {
      type: String,
      required: true,
      match: /^\+8801[3-9][0-9]{8}$/,
    },
    image: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false
    },
  },
  {
    timestamps: true,
  }
);

export const Student = model<TStudent>("Student", studentSchema);
