import { TReview } from "./review.interface";
import { Review } from "./review.model";

// Creating review
const createReviewIntoDB = async (payload: TReview) => {
  const result = await Review.create(payload);
  return result;
};

export { createReviewIntoDB };
