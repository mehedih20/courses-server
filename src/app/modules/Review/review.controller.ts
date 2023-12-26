import { createReviewIntoDB } from "./review.services";
import catchAsync from "../../utils/catchAsync";

const createReview = catchAsync(async (req, res) => {
  const result = await createReviewIntoDB(req.body);

  res.status(200).json({
    success: true,
    statusCode: 201,
    message: "Review created successfully",
    data: result,
  });
});

export { createReview };
