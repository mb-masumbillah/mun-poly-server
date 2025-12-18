import { Router } from "express";
import { userController } from "./user.controller";
import validatonRequest from "../../middleware/validationRequest";
import { studentValidationSchema } from "../student/student.validation";

const router = Router();

router.post("/create-admin", userController.createAdmin);
router.post(
  "/create-student",
  validatonRequest(studentValidationSchema),
  userController.createStudent
);
router.post("/create-teacher", userController.createTeacher);

router.get("/", userController.getAllUser);
router.get("/me", userController.myProfile);

router.patch("/update-profile", userController.updateProfile);
router.patch("/:id/status", userController.updateUserStatus);

export const userRouter = router;
