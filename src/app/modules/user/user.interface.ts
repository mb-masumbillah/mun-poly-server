import { Model, Types } from "mongoose";
import { USER_ROLE } from "../../interface/constant";

export enum UserRole {
  SUPER_ADMIN = "superAdmin",
  ADMIN = "admin",
  STUDENT = "student",
  INSTRUCTOR = "instructor",
}


export interface TUser {
  _id: Types.ObjectId;
  roll: string;
  password: string;
  email: string;
  needsPasswordChange?: boolean;
  role: UserRole;
  status: "pending" | "approved";
  passwordChangedAt?: Date;
  clientInfo: {
    device: "pc" | "mobile"; // Device type
    browser: string; // Browser name
    ipAddress: string; // User IP address
    pcName?: string; // Optional PC name
    os?: string; // Optional OS name (Windows, MacOS, etc.)
    userAgent?: string; // Optional user agent string
  };
  lastLogin: Date;
  otpToken?: string | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserModel extends Model<TUser> {
  isUserExist(value: string): Promise<TUser>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<TUser>;

   isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}


export type TuserRole = keyof typeof USER_ROLE;
