import { Router } from "express";
import { AuthController } from "./auth.controller";
import validationRequest from "../../middleware/validationRequest";
import { AuthValidation } from "./auth.validation";
import { clientInfoParser } from "../../middleware/clientInfoParser";
import { USER_ROLE } from "../../interface/constant";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";

const router = Router();

router.post(
  "/login",
  validationRequest(AuthValidation.loginValidationSchema),
  clientInfoParser,
  AuthController.loginUser
);

router.post(
  "/change-password",
  auth(UserRole.STUDENT),
  validationRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword
);

router.post(
  "/refresh-token",
  validationRequest(AuthValidation.refreshTokenValidationSchema),
  AuthController.refreshToken
);

export const authRouter = router;
