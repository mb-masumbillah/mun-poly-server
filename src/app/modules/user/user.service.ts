import mongoose from "mongoose";
import { USER_ROLE } from "../../interface/constant";
import { TStudent } from "../student/student.interface";
import { TUser, UserRole } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../error/appError";
import { StatusCodes } from "http-status-codes";
import { Student } from "../student/student.model";


type TClientInfo =
  Pick<TUser["clientInfo"], "device" | "browser" | "ipAddress"> &
  Partial<Omit<TUser["clientInfo"], "device" | "browser" | "ipAddress">>;


const createStudentIntoDB = async (password: string, payload: TStudent,  clientInfoData: TClientInfo) => {
  const userData: Partial<TUser> = {};

  userData.id = payload?.id;
  userData.password = password;
  userData.email = payload?.email;
  userData.role = UserRole?.STUDENT;
  userData.needsPasswordChange = false;
  userData.clientInfo = clientInfoData ;

  const isUser = await User.isUserExist(payload?.id);

  if (isUser) {
    throw new AppError(400, "Student is Exist. Please create new student!");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // ========> TODO:  file and cloudinary <==========

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    if (!newUser) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Failed to create user");
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a student (transaction-2)
    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Failed to create student");
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createInstructorIntoDB = async () => {};

const createAdminIntoDB = async () => {};

const getAllUser = async () => {};

const myProfile = async () => {};

const updateProfile = async () => {};

const updateUserStatus = async () => {};

export const userService = {
  createStudentIntoDB,
  createInstructorIntoDB,
  createAdminIntoDB,
  getAllUser,
  myProfile,
  updateProfile,
  updateUserStatus,
};
