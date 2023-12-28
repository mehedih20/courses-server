import { z } from "zod";

const passwordChangeValidationSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
});

const userValidationSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(["user", "admin"]),
});

const userLoginValidationSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const userValidation = {
  userValidationSchema,
  userLoginValidationSchema,
  passwordChangeValidationSchema,
};
