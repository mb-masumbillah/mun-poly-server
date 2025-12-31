import { Router } from "express";
import { StudentController } from "./student.controller";
import { USER_ROLE } from "../../interface/constant";
import auth from "../../middleware/auth";
import validationRequest from "../../middleware/validationRequest";
import { studentUpdateSchema } from "./student.validation";

const router = Router();

// we call controller funciton
router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  StudentController.getAllStudents,
);

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  StudentController.getSingleStudent,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  StudentController.deleteStudent,
);

router.patch(
  '/:roll',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validationRequest(studentUpdateSchema),
  StudentController.updateStudent,
);



export const StudentRoute = router;
