import { Router } from "express";
import validateData from "../../middlewares/validateData";
import { categoryValidation } from "./category.validation";
import { createCategory, getAllCategories } from "./category.controller";

const router = Router();

router.post(
  "/categories",
  validateData(categoryValidation.categoryValidationSchema),
  createCategory
);

router.get("/categories", getAllCategories);

export const CategoryRoutes = router;
