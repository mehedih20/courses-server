import {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
} from "./category.services";
import catchAsync from "../../utils/catchAsync";
import status from "http-status";

const createCategory = catchAsync(async (req, res) => {
  try {
    const token = req.headers.authorization;
    const result = await createCategoryIntoDB(req.body, token as string);

    res.status(status.OK).json({
      ssuccess: true,
      statusCode: 201,
      message: "Category created successfully",
      data: result,
    });
  } catch (error) {
    res.status(status.UNAUTHORIZED).json({
      success: false,
      errorMessage:
        "You do not have the necessary permissions to access this resource.",
      errorDetails: null,
      stack: null,
    });
  }
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
