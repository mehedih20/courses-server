import { User } from "../User/user.model";
import { checkToken } from "../User/user.utility";
import { TReview } from "./review.interface";
import { Review } from "./review.model";

// Creating review
const createReviewIntoDB = async (payload: TReview, token: string) => {
  // Checking authorization
  const decoded = checkToken(token);

  if (!decoded) {
    throw new Error("Unauthorized Access");
  }
  if (decoded?.role !== "user") {
    throw new Error("Unauthorized Access");
  }

  const isUserExist = await User.findById(decoded?._id);
  if (!isUserExist) {
    throw new Error("Unauthorized Access");
  }

  const reviewData = { ...payload, createdBy: decoded._id };
  const result = await Review.create(reviewData);
  const responseData = await Review.findById(result._id)
    .populate({ path: "createdBy", select: "_id username email role" })
    .select("-__v");

  return responseData;
};

export { createReviewIntoDB };
