import catchAsync from "../../utils/catchAsync"

const createUser = catchAsync(async(req, res) =>{})

const createStudent = catchAsync(async(req, res) =>{})

const createTeacher = catchAsync(async(req, res) =>{})

const createAdmin = catchAsync(async(req, res) =>{})

const getAllUser = catchAsync(async(req, res) =>{})

const myProfile = catchAsync(async(req, res) =>{})

const updateProfile = catchAsync(async(req, res) =>{})

const updateUserStatus = catchAsync(async(req, res) =>{})

export const userController = {
  createUser,
  createStudent,
  createTeacher,
  createAdmin,
  getAllUser,
  myProfile,
  updateProfile,
  updateUserStatus,
};
