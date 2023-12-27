import config from "../../config";
import { User } from "../User/user.model";
import { TReview } from "./review.interface";
import { Review } from "./review.model";
import jwt, { JwtPayload } from "jsonwebtoken";

// Creating review
const createReviewIntoDB = async (payload: TReview, token: string) => {
  if (!token) {
    return null;
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  if (decoded?.role !== "admin") {
    return null;
  }

  const isUserExist = await User.findById(decoded._id);
  if (!isUserExist) {
    return null;
  }

  const reviewData = { ...payload, createdBy: decoded._id };
  const result = await Review.create(reviewData);
  const responseData = await Review.findById(result._id)
    .populate({ path: "createdBy", select: "_id username email role" })
    .select("-__v");

  return responseData;
};

export { createReviewIntoDB };
