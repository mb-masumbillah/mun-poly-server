import { Router } from "express";
import {
  createPayment,
  deletePayment,
  getAllPayments,
  getSinglePayment,
  updatePayment,
} from "./payment.controller";
import { upload } from "../../utils/sendImageToCloudinary";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../interface/constant";

const router = Router();

router.post("/create", auth(USER_ROLE.student) ,upload.single("file"), createPayment);
router.get("/", getAllPayments);
router.get("/:roll", getSinglePayment);
router.patch("/:roll", upload.single("file"), updatePayment);
router.delete("/:roll", deletePayment);

export const paymentRoute = router;
