import { Router } from "express";
import validateData from "../../middlewares/validateData";
import { userValidation } from "./user.validation";
import { changeUserPassword, loginUser, registerUser } from "./user.controller";

const router = Router();

router.post(
  "/auth/register",
  validateData(userValidation.userValidationSchema),
  registerUser,
);

router.post(
  "/auth/login",
  validateData(userValidation.userLoginValidationSchema),
  loginUser,
);

router.post(
  "/auth/change-password",
  validateData(userValidation.passwordChangeValidationSchema),
  changeUserPassword,
);

export const UserRoutes = router;
