import mongoose from "mongoose";
import { USER_ROLE } from "../../interface/constant";
import { TStudent } from "../student/student.interface";
import { TUser, UserRole } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../error/appError";
import { StatusCodes } from "http-status-codes";
import { Student } from "../student/student.model";
import { uploadToCloudinary } from "../../utils/sendImageToCloudinary";


type TClientInfo = Pick<
  TUser["clientInfo"],
  "device" | "browser" | "ipAddress"
> &
  Partial<Omit<TUser["clientInfo"], "device" | "browser" | "ipAddress">>;

const createStudentIntoDB = async (
  file: any,
  password: string,
  payload: TStudent,
  clientInfoData: TClientInfo
) => {
  const userData: Partial<TUser> = {};

  userData.roll = payload?.roll;
  userData.password = password;
  userData.email = payload?.email;
  userData.role = UserRole?.STUDENT;
  userData.needsPasswordChange = false;
  userData.clientInfo = clientInfoData;

  const isUser = await User.isUserExist(payload?.roll);

  if (isUser) {
    throw new AppError(400, "Student is Exist. Please create new student!");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

     if (file) {
      const { secure_url }: any = await uploadToCloudinary(`${payload.roll}-${payload.fullName}`, file.buffer);
      payload.image = secure_url;
    }

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    if (!newUser) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Failed to create user");
    }

    payload.roll = newUser[0].roll;
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

const getMe = async (email: string, roll: string, role: string) => {
  let result = null;
  if (role === "student") {
    result = await Student.findOne({ roll }).populate("user");
  }
  if (role === "superAdmin") {
    result = await User.findOne({ email });
  }

  return result;
};

const changeStatus = async (roll: string, payload: { status: string }) => {
  console.log(roll, payload);

  const result = await User.findOneAndUpdate({ roll }, payload, {
    new: true,
  });
  return result;
};

const updateProfile = async () => {};

const updateUserStatus = async () => {};

export const userService = {
  createStudentIntoDB,
  createInstructorIntoDB,
  createAdminIntoDB,
  getAllUser,
  getMe,
  updateProfile,
  updateUserStatus,
  changeStatus,
};
