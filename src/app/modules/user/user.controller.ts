import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userService } from "./user.service";

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  const result = await userService.createStudentIntoDB(password, studentData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Student create successfull",
    data: result,
  });
});

const createTeacher = catchAsync(async (req, res) => {});

const createAdmin = catchAsync(async (req, res) => {});

const getAllUser = catchAsync(async (req, res) => {});

const myProfile = catchAsync(async (req, res) => {});

const updateProfile = catchAsync(async (req, res) => {});

const updateUserStatus = catchAsync(async (req, res) => {});

export const userController = {
  createStudent,
  createTeacher,
  createAdmin,
  getAllUser,
  myProfile,
  updateProfile,
  updateUserStatus,
};
