import { z } from "zod";

/* ======================
   Guardian Validation
====================== */
const guardianValidationSchema = z.object({
  fatherName: z.string().min(1, "Father name is required"),
  fatherOccupation: z.string().min(1, "Father occupation is required"),

  fatherContactNo: z
    .string()
    .regex(/^01\d{9}$/, "Father contact number must be 11 digits"),

  motherName: z.string().min(1, "Mother name is required"),
  motherOccupation: z.string().min(1, "Mother occupation is required"),

  motherContactNo: z
    .string()
    .regex(/^01\d{9}$/, "Mother contact number must be 11 digits"),
});

/* ======================
   Secondary School Validation
====================== */
const secondarySchoolValidationSchema = z.object({
  sscRoll: z.number().int().positive("SSC roll must be a positive number"),

  sscRegistrationNo: z
    .number()
    .int()
    .positive("SSC registration number must be positive"),

  sscBoard: z.string().min(1, "SSC board is required"),

  sscGroup: z.enum(["Science", "Business Studies", "Humanities"]),

  // ✅ GPA validation fixed
  sscGPA: z
    .number()
    .min(0, "SSC GPA cannot be less than 0.00")
    .max(5, "SSC GPA cannot be greater than 5.00"),

  sscSchoolName: z.string().min(1, "SSC school name is required"),
});

/* ======================
   Student Validation
====================== */
export const studentValidationSchema = z.object({
  body: z.object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password cannot exceed 64 characters"),

    student: z.object({
      id: z.number(),
      fullName: z.string().min(1, "Full name is required"),

      // ✅ enum consistent
      gender: z.enum(["Male", "Female", "Other"]),

      dateOfBirth: z.string().optional(),

      email: z.string().email("Invalid email address"),

      contactNo: z
        .string()
        .regex(/^01\d{9}$/, "Contact number must be 11 digits"),

      emergencyContactNo: z
        .string()
        .regex(/^01\d{9}$/, "Emergency contact number must be 11 digits"),

      bloodGroup: z
        .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
        .optional(),

      presentAddress: z.string().min(1, "Present address is required"),
      permanentAddress: z.string().min(1, "Permanent address is required"),

      guardian: guardianValidationSchema,

      secondarySchool: secondarySchoolValidationSchema,

      diplomaRoll: z
        .number()
        .int("Diploma roll must be an integer")
        .positive("Diploma roll must be positive")
        .optional(),

      academicTechnology: z.string().min(1, "Academic technology is required"),

      shift: z.string().min(1, "Shift is required"),
      session: z.string().min(1, "Session is required"),

      nationality: z.string().min(1, "Nationality is required"),
      religion: z.string().min(1, "Religion is required"),
    }),
  }),
});
