import { StatusCodes } from "http-status-codes";
import AppError from "../../error/appError";
import { User } from "../user/user.model";
import { IJwtPayload, TLoginUser } from "./auth.interface";
import { createToken, verifyToken } from "./auth.utils";
import config from "../../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateOtp } from "../../utils/generateOtp";

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExist(payload?.idOrEmail);

  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This user is not found!");
  }

  if (user?.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, "This user is deleted !");
  }

  if (user?.status === "blocked") {
    throw new AppError(StatusCodes.FORBIDDEN, "This user is blocked ! !");
  }

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(StatusCodes.FORBIDDEN, "Password do not matched");
  }

  const jwtPayload: IJwtPayload = {
    userId: user?.id,
    role: user?.role,
    email: user?.email,
    status: user?.status,
    isDeleted: user?.isDeleted,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  await User.findByIdAndUpdate(
    user?._id,
    { clientInfo: payload.clientInfo, lastLogin: Date.now() },
    { new: true }
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const user = await User.isUserExist(userData?.userId);

  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This user is not found!");
  }

  if (user?.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, "This user is deleted !");
  }

  if (user?.status === "blocked") {
    throw new AppError(StatusCodes.FORBIDDEN, "This user is blocked ! !");
  }

  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password))) {
    throw new AppError(StatusCodes.FORBIDDEN, "Password do not matched");
  }

  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    }
  );

  return { message: "Password changed successfully" };
};

const refreshToken = async (token: string) => {
  console.log({ token });
  let verifiedToken = null;

  try {
    verifiedToken = verifyToken(token, config.jwt_refresh_secret as string);
  } catch (err) {
    throw new AppError(StatusCodes.FORBIDDEN, "Invalid Refresh Token");
  }

  const { userId, iat } = verifiedToken;

  const user = await User.isUserExist(userId);

  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This user is not found!");
  }

  if (user?.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, "This user is deleted !");
  }

  if (user?.status === "blocked") {
    throw new AppError(StatusCodes.FORBIDDEN, "This user is blocked ! !");
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "You are not Authorized");
  }

  const jwtPayload: IJwtPayload = {
    userId: user?.id,
    role: user?.role,
    email: user?.email,
    status: user?.status,
    isDeleted: user?.isDeleted,
  };

  const newAccessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

const forgotPassword = async ({ email }: { email: string }) => {
  const user = await User.isUserExist(email);

  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This user is not found!");
  }

  if (user?.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, "This user is deleted !");
  }

  if (user?.status === "blocked") {
    throw new AppError(StatusCodes.FORBIDDEN, "This user is blocked ! !");
  }

  const otp = generateOtp()

  const otpToken = jwt.sign({otp, email}, config.)


};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
};
