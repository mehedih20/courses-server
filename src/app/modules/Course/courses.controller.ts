/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getBestCourseFromDB,
  getSingleCourseWithReviewsFromDB,
  upadteCourseIntoDB,
} from "./courses.services";
import catchAsync from "../../utils/catchAsync";
import status from "http-status";

const createCourse = catchAsync(async (req, res) => {
  try {
    const token = req.headers.authorization;
    const result = await createCourseIntoDB(req.body, token as string);

    res.status(status.OK).json({
      success: true,
      statusCode: 201,
      message: "Course created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(status.UNAUTHORIZED).json({
      success: false,
      message: err.message,
      errorMessage:
        "You do not have the necessary permissions to access this resource.",
      errorDetails: null,
      stack: null,
    });
  }
});

const getAllCourses = catchAsync(async (req, res) => {
  const result = await getAllCoursesFromDB(req.query);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Courses retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCourseWithReviews = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await getSingleCourseWithReviewsFromDB(courseId);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Course and Reviews retrieved successfully",
    data: result,
  });
});

const getBestCourse = catchAsync(async (req, res) => {
  const result = await getBestCourseFromDB();

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Best course retrieved successfully",
    data: result,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  try {
    const { courseId } = req.params;
    const token = req.headers.authorization;
    const result = await upadteCourseIntoDB(
      courseId,
      req.body,
      token as string,
    );

    res.status(status.OK).json({
      success: true,
      statusCode: 200,
      message: "Course updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(status.UNAUTHORIZED).json({
      success: false,
      message: error.message,
      errorMessage:
        "You do not have the necessary permissions to access this resource.",
      errorDetails: null,
      stack: null,
    });
  }
});

export {
  createCourse,
  getAllCourses,
  getBestCourse,
  updateCourse,
  getSingleCourseWithReviews,
};
