import { Router } from "express";
import { userController } from "./user.controller";
import validationRequest from "../../middleware/validationRequest";
import { studentValidationSchema } from "../student/student.validation";
import { clientInfoParser } from "../../middleware/clientInfoParser";

const router = Router();

router.post("/create-admin", userController.createAdmin);
router.post(
  "/create-student",
  validationRequest(studentValidationSchema),
  clientInfoParser,
  userController.createStudent
);
router.post("/create-teacher", userController.createInstructor);

router.get("/", userController.getAllUser);
router.get("/me", userController.myProfile);

router.patch("/update-profile", userController.updateProfile);
router.patch("/:id/status", userController.updateUserStatus);

export const userRouter = router;
