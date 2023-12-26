import {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getBestCourseFromDB,
  getSingleCourseWithReviewsFromDB,
  upadteCourseIntoDB,
} from "./courses.services";
import catchAsync from "../../utils/catchAsync";

const createCourse = catchAsync(async (req, res) => {
  const result = await createCourseIntoDB(req.body);

  res.status(201).json({
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
  const { courseId } = req.params;

  const result = await upadteCourseIntoDB(courseId, req.body);

  res.status(200).json({
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
