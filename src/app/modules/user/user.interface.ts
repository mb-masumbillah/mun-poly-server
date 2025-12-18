import { Model } from "mongoose";

export interface TUser {
  id: string;
  password: string;
  email: string;
  needsPasswordChange?: boolean;
  role: "superAdmin" | "admin" | "student" | "instructor";
  status: "in-progress" | "blocked";
  passwordChangedAt?: Date;
  isDeleted: boolean;
}


export interface UserModel extends Model<TUser>{
    isUserExist(id: string):Promise<TUser>;
}