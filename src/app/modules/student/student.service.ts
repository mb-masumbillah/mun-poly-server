import mongoose from "mongoose";
import { Student } from "./student.model";
import AppError from "../../error/appError";
import { StatusCodes } from "http-status-codes";
import { User } from "../user/user.model";
import { TStudent } from "./student.interface";
import config from "../../config";
import bcrypt from "bcrypt";
import { TUser } from "../user/user.interface";

const getAllStudentIntoDB = async () => {
  const result = await Student.find().populate("user");

  return result;
};

const getSingleStudentIntoDB = async (roll: string) => {
  const result = await Student.findOne({ roll }).populate("user");

  return result;
};

const deleteStudentDB = async (roll: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedStudent = await Student.findOneAndDelete(
      { roll },
      { session }
    );
    if (!deletedStudent) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Failed to delete student");
    }

    const deletedUser = await User.findOneAndDelete(deletedStudent.user, {
      session,
    });
    if (!deletedUser) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Failed to delete user");
    }

    // Commit transaction
    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};

const updateStudentIntoDB = async (
  roll: string,
  payload: Partial<TStudent>
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1️⃣ Get existing student
    const existingStudent = await Student.findOne({ roll: roll })
      .populate("user")
      .session(session);
    if (!existingStudent) {
      throw new Error("Student not found");
    }

    // 2️⃣ Update User if email or password is in payload
    const userUpdateData: Partial<TUser> = {};

    if (payload.email && payload.email !== existingStudent.email) {
      userUpdateData.email = payload.email;
    }

    if ((payload as any).password) {
      const hashedPassword = await bcrypt.hash(
        (payload as any).password,
        Number(config.bcrypt_salt_rounds)
      );
      userUpdateData.password = hashedPassword;
    }

    // Update user if needed
    if (Object.keys(userUpdateData).length > 0) {
      await User.findOneAndUpdate(existingStudent.user, userUpdateData, {
        new: true,
        runValidators: true,
        session,
      }).populate("user");
    }

    // 3️⃣ Prepare Student update data
    const studentUpdateData: Partial<TStudent> = { ...payload };
    delete (studentUpdateData as any).password; // remove password from student payload

    // 4️⃣ Update Student
    const updatedStudent = await Student.findOneAndUpdate(
      { roll },
      studentUpdateData,
      { new: true, runValidators: true, session }
    ).populate("user");

    await session.commitTransaction();
    await session.endSession();

    return updatedStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};

export const StudentServices = {
  getAllStudentIntoDB,
  getSingleStudentIntoDB,
  deleteStudentDB,
  updateStudentIntoDB,
};
