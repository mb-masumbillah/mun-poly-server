import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import validationRequest from "../../middleware/validationRequest";
import { studentValidationSchema } from "../student/student.validation";
import { clientInfoParser } from "../../middleware/clientInfoParser";
import { upload } from "../../utils/sendImageToCloudinary";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../interface/constant";
import { changeStatusValidationSchema } from "./user.validation";

const router = Router();

router.post("/create-admin", userController.createAdmin);
router.post(
  "/create-student",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validationRequest(studentValidationSchema),
  clientInfoParser,
  userController.createStudent
);
router.post("/create-teacher", userController.createInstructor);

router.get("/", userController.getAllUser);
router.get(
  "/me",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.student),
  userController.getMe
);

router.patch(
  "/change-status/:roll",
  auth(USER_ROLE.superAdmin),
  validationRequest(changeStatusValidationSchema),
  userController.changeStatus
);

router.patch("/update-profile", userController.updateProfile);
router.patch("/:id/status", userController.updateUserStatus);

export const userRouter = router;
