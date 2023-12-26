import {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
} from "./category.services";
import catchAsync from "../../utils/catchAsync";

const createCategory = catchAsync(async (req, res) => {
  const result = await createCategoryIntoDB(req.body);

  res.status(200).json({
    success: true,
    statusCode: 201,
    message: "Category created successfully",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const result = await getAllCategoriesFromDB();

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Categories retrieved successfully",
    data: result,
  });
});

export { createCategory, getAllCategories };
