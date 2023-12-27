import { Router } from "express";
import {
  createCourse,
  getAllCourses,
  getBestCourse,
  getSingleCourseWithReviews,
  updateCourse,
} from "./courses.controller";
import validateData from "../../middlewares/validateData";
import { courseValidations } from "./courses.validation";

const router = Router();

router.post(
  "/courses",
  validateData(courseValidations.courseValidationSchema),
  createCourse,
);
router.get("/course/best", getBestCourse);
router.get("/courses", getAllCourses);
router.get("/courses/:courseId/reviews", getSingleCourseWithReviews);

router.put(
  "/courses/:courseId",
  validateData(courseValidations.updatedCourseValidationSchema),
  updateCourse,
);

export const CourseRoutes = router;
