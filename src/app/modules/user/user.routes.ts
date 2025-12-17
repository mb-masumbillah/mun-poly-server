import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/create-admin", userController.createAdmin);
router.post("/create-user", userController.createUser);
router.post("/create-student", userController.createStudent);
router.post("/create-teacher", userController.createTeacher);

router.get("/", userController.getAllUser);
router.get("/me", userController.myProfile);

router.patch("/update-profile", userController.updateProfile);
router.patch("/:id/status", userController.updateUserStatus);

export const userRouter = router