import { Router } from "express";
import validateData from "../../middlewares/validateData";
import { userValidation } from "./user.validation";
import { registerUser } from "./user.controller";

const router = Router();

router.post(
  "/auth/register",
  validateData(userValidation.userValidationSchema),
  registerUser,
);

export const UserRoutes = router;
