import { StatusCodes } from "http-status-codes";
import AppError from "../error/appError";
import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import config from "../config";
import { User } from "../modules/user/user.model";
import { TuserRole } from "../modules/user/user.interface";


const auth = (...requiredRoles: TuserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
    }

    try {
      const decoded = jwt.verify(
        token,
        config?.jwt_access_secret as string
      ) as JwtPayload;

      const { role, email, isDeleted, iat } = decoded;

      const user = await User.findOne({ email, role, isDeleted });

      if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "This user is not found!");
      }

      if (
        user.passwordChangedAt &&
        User.isJWTIssuedBeforePasswordChanged(
          user.passwordChangedAt,
          iat as number
        )
      ) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "You are not Authorized");
      }

      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
      }

      req.user = decoded as JwtPayload;

      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return next(
          new AppError(
            StatusCodes.UNAUTHORIZED,
            "Token has expired! Please login again."
          )
        );
      }
      return next(new AppError(StatusCodes.UNAUTHORIZED, "Invalid token!"));
    }
  });
};

export default auth;
