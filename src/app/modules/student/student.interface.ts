import { Types } from "mongoose";

export type TSemester =
  | "First Semester"
  | "Second Semester"
  | "Third Semester"
  | "Fourth Semester"
  | "Fifth Semester"
  | "Sixth Semester"
  | "Seventh Semester"
  | "Eighth Semester";

export type TAcademicTechnology =
  | "Computer Technology"
  | "Electrical Technology"
  | "Electronics Technology"
  | "Mechanical Technology"
  | "Civil Technology"
  | "IPCT Technology";

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

export type TSecondarySchool = {
  sscRoll: number;
  sscRegistrationNo: number;
  sscBoard: string;
  sscGroup: "Science" | "Business Studies" | "Humanities";
  sscGPA: number;
  sscSchoolName: string;
};

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  fullName: string;
  gender: "Male" | "Female" | "Other";
  dateOfBirth?: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  profileImg?: string;
  secondarySchool: TSecondarySchool;
  diplomaRoll?: number;
  diplomaRegistrationNo?: number;
  admissionSemester: TSemester;
  academicTechnology: TAcademicTechnology;
  shift: string;
  session: string;
  nationality: string;
  religion: string;
  isDeleted: boolean;
};
