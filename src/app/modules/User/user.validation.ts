import { z } from "zod";

const passwordChangeValidationSchema = z.object({
  currentPassword: z.string(),
  newPassword: z
    .string()
    .refine((value) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(value), {
      message:
        "to be at least 8 characters long which starts with a capital letter and possess at least 1 number",
    }),
});

const userValidationSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z
    .string()
    .refine((value) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(value), {
      message: `to be at least 8 characters long which starts with a capital letter and possess at least 1 number (eg. '[capital letter]1234567')`,
    }),
  role: z.enum(["user", "admin"]).default("user"),
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
