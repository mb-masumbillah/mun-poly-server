import { Types } from "mongoose";

export type TSemester =
  | "1st"
  | "2nd"
  | "3rd"
  | "4th"
  | "5th"
  | "6th"
  | "7th"
  | "8th";

export type TAcademicTechnology = "CST" | "EEE" | "Civil" | "Mechanical";

export type TStudent = {
  fullName: string;
  user: Types.ObjectId
  roll: string;
  registration: string;
  department: "CST" | "EEE" | "Civil" | "Mechanical";
  session: string;
  shift: "1st" | "2nd";
  semester: "1st" | "2nd" | "3rd" | "4th" | "5th" | "6th" | "7th" | "8th";
  email: string;
  number: string;
  image?: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
