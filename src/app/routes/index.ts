import { Router } from "express";
import { CourseRoutes } from "../modules/Course/courses.route";
import { CategoryRoutes } from "../modules/Category/category.route";
import { ReviewRoutes } from "../modules/Review/review.route";
import { UserRoutes } from "../modules/User/user.route";

const router = Router();

const allModelRoutes = [CourseRoutes, CategoryRoutes, ReviewRoutes, UserRoutes];

allModelRoutes.forEach((item) => router.use(item));

export default router;
