import { Router } from "express";
import validateData from "../../middlewares/validateData";
import { userValidation } from "./user.validation";
import { loginUser, registerUser } from "./user.controller";

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

export const UserRoutes = router;
