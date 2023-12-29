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
  const token = req.headers.authorization;
  const result = await createCourseIntoDB(req.body, token as string);

  res.status(status.OK).json({
    success: true,
    statusCode: 201,
    message: "Course created successfully",
    data: result,
  });
});

const getAllCourses = catchAsync(async (req, res) => {
  const result = await getAllCoursesFromDB(req.query);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Courses retrieved successfully",
    meta: result.meta,
    data: {
      courses: result.data,
    },
  });
});

const getSingleCourseWithReviews = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await getSingleCourseWithReviewsFromDB(courseId);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Course with reviews retrieved successfully",
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
  const { courseId } = req.params;
  const token = req.headers.authorization;
  const result = await upadteCourseIntoDB(courseId, req.body, token as string);

  res.status(status.OK).json({
    success: true,
    statusCode: 200,
    message: "Course updated successfully",
    data: result,
  });
});

export {
  createCourse,
  getAllCourses,
  getBestCourse,
  updateCourse,
  getSingleCourseWithReviews,
};
