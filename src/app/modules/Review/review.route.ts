import { Router } from "express";
import validateData from "../../middlewares/validateData";
import { reviewValidation } from "./review.validation";
import { createReview } from "./review.controller";

const router = Router();

router.post(
  "/reviews",
  validateData(reviewValidation.reviewValidationSchema),
  createReview
);

export const ReviewRoutes = router;
