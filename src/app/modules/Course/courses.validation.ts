import { z } from "zod";

const courseTagsValidationSchema = z.object({
  name: z.string(),
  isDeleted: z.boolean(),
});

const courseDetailsValidationSchema = z.object({
  level: z.string(),
  description: z.string(),
});

const courseValidationSchema = z.object({
  title: z.string(),
  instructor: z.string(),
  categoryId: z.string(),
  price: z.number(),
  tags: z.array(courseTagsValidationSchema),
  startDate: z.string(),
  endDate: z.string(),
  language: z.string(),
  provider: z.string(),
  durationInWeeks: z.number().optional(),
  details: courseDetailsValidationSchema,
});

// Updating validations
const updatedCourseTagsValidationSchema = z.object({
  name: z.string().optional(),
  isDeleted: z.boolean().optional(),
});

const updatedCourseDetailsValidationSchema = z.object({
  level: z.string().optional(),
  description: z.string().optional(),
});

const updatedCourseValidationSchema = z.object({
  title: z.string().optional(),
  instructor: z.string().optional(),
  categoryId: z.string().optional(),
  price: z.number().optional(),
  tags: z.array(updatedCourseTagsValidationSchema).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  language: z.string().optional(),
  provider: z.string().optional(),
  durationInWeeks: z.number().optional(),
  details: updatedCourseDetailsValidationSchema.optional(),
});

export const courseValidations = {
  courseValidationSchema,
  updatedCourseValidationSchema,
};
