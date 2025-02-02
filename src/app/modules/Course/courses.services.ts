/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Category } from "../Category/category.model";
import { Review } from "../Review/review.model";
import { User } from "../User/user.model";
import { checkToken } from "../User/user.utility";
import { TCourse } from "./courses.interface";
import { Course } from "./courses.model";

//Creating a course
const createCourseIntoDB = async (payload: TCourse, token: string) => {
  // Checking authorization
  const decoded = checkToken(token);

  if (!decoded) {
    throw new Error("Unauthorized Access");
  }
  if (decoded?.role !== "admin") {
    throw new Error("Unauthorized Access");
  }

  const isUserExist = await User.findById(decoded._id);
  if (!isUserExist) {
    throw new Error("Unauthorized Access");
  }

  //Verifying the categoryId
  const checkCategoryIdExists = await Category.findById(payload.categoryId);
  if (!checkCategoryIdExists) {
    throw new Error("Category not found");
  }

  const courseData = { ...payload, createdBy: decoded._id };
  const result = await Course.create(courseData);

  // Fetching data for proper response format
  const responseData = await Course.findById(result._id).select("-__v");
  return responseData;
};

//Getting all courses with or without query
const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  //Extracting query fields
  const {
    sortBy,
    limit = 10,
    page = 1,
    provider,
    minPrice,
    maxPrice,
    tags,
    startDate,
    endDate,
    language,
    durationInWeeks,
    level,
    sortOrder,
  } = query;

  const skip = (Number(page) - 1) * Number(limit);

  // Formatting sort object
  const sortObj: any = {};
  const sortByField = [
    "title",
    "price",
    "startDate",
    "endDate",
    "language",
    "durationInWeeks",
  ];

  if (sortBy && !sortOrder && sortByField.includes(sortBy as string)) {
    sortObj[sortBy as string] = "asc";
  } else if (sortOrder && sortBy) {
    sortObj[sortBy as string] = sortOrder;
  } else if (sortOrder && !sortBy) {
    sortObj.price = sortOrder;
  }

  // Formatting filter object
  const querObj: any = {};

  if (provider) querObj.provider = provider;
  if (tags) querObj["tags.name"] = tags;
  if (startDate) querObj.startDate = { $gte: startDate };
  if (endDate) querObj.endDate = { $lte: endDate };
  if (language) querObj.language = language;
  if (durationInWeeks) querObj.durationInWeeks = Number(durationInWeeks);
  if (level) querObj["details.level"] = level;
  if (minPrice) querObj.price = { $gte: Number(minPrice) };
  if (maxPrice) querObj.price = { $lte: Number(maxPrice) };

  if (minPrice && maxPrice) {
    querObj.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
  }

  // Making query to database and paginating
  const searchQuery = await Course.find(querObj)
    .sort(sortObj)
    .select("-__v")
    .populate({ path: "createdBy", select: "_id username email role" })
    .skip(skip)
    .limit(Number(limit));

  // Making the meta data
  const metaData = {
    page: Number(page),
    limit: Number(limit),
    total: (await Course.find(querObj)).length,
  };

  return { meta: metaData, data: searchQuery };
};

//Getting course by id with reviews
const getSingleCourseWithReviewsFromDB = async (courseId: string) => {
  const courseData = await Course.findById(courseId)
    .populate({ path: "createdBy", select: "_id username email role" })
    .select("-__v");

  const reviewData = await Review.find({ courseId })
    .select("-__v")
    .populate({ path: "createdBy", select: "_id username email role" });

  return { course: courseData, reviews: reviewData };
};

//Getting the best course based on average rating
const getBestCourseFromDB = async () => {
  const reviewData = await Review.aggregate([
    {
      $group: {
        _id: "$courseId",
        averageValue: { $avg: "$rating" },
        reviewValue: { $sum: 1 },
      },
    },
    {
      $sort: { averageValue: -1 },
    },
  ]);

  const { _id, averageValue, reviewValue } = reviewData[0];
  const course = await Course.findById(_id)
    .populate({ path: "createdBy", select: "_id username email role" })
    .select("-__v");

  return {
    course,
    averageRating: Number(averageValue.toFixed(1)),
    reviewCount: reviewValue,
  };
};

//Dynamically updating course information
const upadteCourseIntoDB = async (
  id: string,
  payload: Partial<TCourse>,
  token: string,
) => {
  // Checking authorization
  const decoded = checkToken(token);

  if (!decoded) {
    throw new Error("Unauthorized Access");
  }
  if (decoded?.role !== "admin") {
    throw new Error("Unauthorized Access");
  }

  const isUserExist = await User.findById(decoded._id);
  if (!isUserExist) {
    throw new Error("Unauthorized Access");
  }

  const { tags, details, ...remainingBasicData } = payload;

  //If durationInWeeks is not provided then deriving it
  if (
    remainingBasicData.startDate &&
    remainingBasicData.endDate &&
    !remainingBasicData.durationInWeeks
  ) {
    const startTime = new Date(remainingBasicData.startDate as string);
    const endTime = new Date(remainingBasicData.endDate as string);
    const difference = endTime.getTime() - startTime.getTime();
    remainingBasicData.durationInWeeks = Math.ceil(
      difference / (7 * 24 * 60 * 60 * 1000),
    );
  }

  const updatedBasicData = await Course.findByIdAndUpdate(
    id,
    remainingBasicData,
    {
      new: true,
      runValidators: true,
    },
  );

  if (tags && tags.length > 0) {
    // Extracting deleted tags
    const deletedTags = tags
      .filter((el) => el.name && el.isDeleted)
      .map((el) => el.name);

    //Deleting tags from database
    const courseWithDeletedTags = await Course.findByIdAndUpdate(
      id,
      {
        $pull: {
          tags: { name: { $in: deletedTags } },
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    //Extracting newly added tags
    const addedTags = tags.filter((el) => el.name && !el.isDeleted);

    //Adding tags into the database
    const courseWithAddedTags = await Course.findByIdAndUpdate(
      id,
      {
        $addToSet: { tags: { $each: addedTags } },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  //Updating details
  if (details && Object.keys(details).length > 0) {
    const updatedDetails = await Course.findByIdAndUpdate(
      id,
      {
        $set: {
          "details.level": details.level,
          "details.description": details.description,
        },
      },
      {
        new: true,
      },
    );
  }

  const updatedCourse = await Course.findById(id)
    .populate({ path: "createdBy", select: "_id username email role" })
    .select("-__v");

  return updatedCourse;
};

export {
  createCourseIntoDB,
  getAllCoursesFromDB,
  upadteCourseIntoDB,
  getSingleCourseWithReviewsFromDB,
  getBestCourseFromDB,
};
