import { createReviewIntoDB } from "./review.services";
import catchAsync from "../../utils/catchAsync";
import status from "http-status";

const createReview = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const result = await createReviewIntoDB(req.body, token as string);

  res.status(status.OK).json({
    success: true,
    statusCode: 201,
    message: "Review created successfully",
    data: result,
  });
});

export { createReview };
