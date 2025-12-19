import { Schema, model, Types } from "mongoose";
import { TGuardian, TSecondarySchool, TStudent } from "./student.interface";
import { semester, technology } from "./student.constaint";

/* ======================
   Sub Schemas
====================== */

// Guardian Schema
const guardianSchema = new Schema<TGuardian>(
  {
    fatherName: { type: String, required: true },
    fatherOccupation: { type: String, required: true },
    fatherContactNo: { type: String, required: true },
    motherName: { type: String, required: true },
    motherOccupation: { type: String, required: true },
    motherContactNo: { type: String, required: true },
  },
  { _id: false }
);

// Secondary School Schema
const secondarySchoolSchema = new Schema<TSecondarySchool>(
  {
    sscRoll: { type: Number, required: true },
    sscRegistrationNo: { type: Number, required: true },
    sscBoard: { type: String, required: true },
    sscGroup: {
      type: String,
      enum: ["Science", "Business Studies", "Humanities"],
      required: true,
    },
    sscGPA: { type: Number, required: true },
    sscSchoolName: { type: String, required: true },
  },
  { _id: false }
);

/* ======================
   Main Student Schema
====================== */

const studentSchema = new Schema<TStudent>(
  {
    id: { type: String, required: true, unique: true },

    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    dateOfBirth: { type: String },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    contactNo: { type: String, required: true },
    emergencyContactNo: { type: String, required: true },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },

    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },

    guardian: {
      type: guardianSchema,
      required: true,
    },

    profileImg: { type: String },

    secondarySchool: {
      type: secondarySchoolSchema,
      required: true,
    },

    diplomaRoll: { type: Number },
    diplomaRegistrationNo: { type: Number },

    admissionSemester: {
      type: String,
      enum: [...semester],
      required: true,
      default: "First Semester",
    },

    academicTechnology: {
      type: String,
      enum: [...technology],
      required: true,
    },

    shift: { type: String, required: true },
    session: { type: String, required: true },

    nationality: { type: String, required: true },
    religion: { type: String, required: true },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/* ======================
   Model Export
====================== */

export const Student = model<TStudent>("Student", studentSchema);
