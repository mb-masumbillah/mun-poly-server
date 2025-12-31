import { StatusCodes } from "http-status-codes";
import AppError from "../../error/appError";
import { User } from "../user/user.model";
import { IJwtPayload, TLoginUser } from "./auth.interface";
import { createToken, verifyToken } from "./auth.utils";
import config from "../../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateOtp } from "../../utils/generateOtp";
import { EmailHelper } from "../../utils/emailHelper";
import { ClientSession } from "mongoose";

const loginUser = async (payload: TLoginUser) => {
  console.log(payload);
  const user = await User.isUserExist(payload?.rollOrEmail);

  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This user is not found!");
  }

  if (user?.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, "This user is deleted !");
  }

  if (user?.status === "pending") {
    throw new AppError(StatusCodes.FORBIDDEN, "This user is Pending !");
  }

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(StatusCodes.FORBIDDEN, "Password do not matched");
  }

  const jwtPayload: IJwtPayload = {
    userId: user?.roll,
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

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "You are not Authorized");
  }

  const jwtPayload: IJwtPayload = {
    userId: user?.roll,
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

  const otp = generateOtp();

  const otpToken = jwt.sign({ otp, email }, config.jwt_otp_secret as string, {
    expiresIn: "5m",
  });

  await User.updateOne({ email }, { otpToken });

  try {
    const emailContent = await EmailHelper.createEmailContent(
      { otpCode: otp },
      "forgotPassword"
    );

    await EmailHelper.sendEmail(email, emailContent, "Reset Password OTP");
  } catch (error) {
    await User.updateOne({ email }, { $unset: { otpToken: 1 } });

    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to send OTP email. Please try again later."
    );
  }
};

const verifyOTP = async ({ email, otp }: { email: string; otp: string }) => {
  const user = await User.isUserExist(email);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (!user.otpToken || user.otpToken === "") {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "No OTP token found. Please request a new password reset OTP."
    );
  }

  const decodedOtpData = verifyToken(
    user.otpToken as string,
    config.jwt_otp_secret as string
  );

  if (!decodedOtpData) {
    throw new AppError(StatusCodes.FORBIDDEN, "OTP has expired or is invalid");
  }

  if (decodedOtpData.otp !== otp) {
    throw new AppError(StatusCodes.FORBIDDEN, "Invalid OTP");
  }

  // user.otpToken = null;
  // await user.save();

  await User.updateOne({ email }, { $unset: { otpToken: 1 } });

  const resetToken = jwt.sign(
    { email },
    config.jwt_pass_reset_secret as string,
    { expiresIn: "15m" }
  );

  return {
    resetToken,
  };
};

const resetPassword = async ({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}) => {
  // console.log(token, newPassword)

  const session: ClientSession = await User.startSession();

  try {
    session.startTransaction();

    const decodedData = verifyToken(
      token as string,
      config.jwt_pass_reset_secret as string
    );

    const user = await User.findOne({
      email: decodedData.email,
      isDeleted: false,
    }).session(session);

    console.log(user);

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    const hashedPassword = await bcrypt.hash(
      String(newPassword),
      Number(config.bcrypt_salt_rounds)
    );

    await User.updateOne(
      { email: user.email },
      { password: hashedPassword }
    ).session(session);

    await session.commitTransaction();

    return {
      message: "Password changed successfully",
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyOTP,
};
