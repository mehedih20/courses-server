import { z } from "zod";

const reviewValidationSchema = z.object({
  courseId: z.string(),
  rating: z
    .number()
    .min(1, { message: "to be equal or greater than 1" })
    .max(5, { message: "to be equal or less than 5" }),
  review: z.string(),
});

export const reviewValidation = {
  reviewValidationSchema,
};
