import { createReviewIntoDB } from "./review.services";
import catchAsync from "../../utils/catchAsync";
import status from "http-status";

const createReview = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const result = await createReviewIntoDB(req.body, token as string);

  if (result === null) {
    res.status(status.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized Access",
      errorMessage:
        "You do not have the necessary permissions to access this resource.",
      errorDetails: null,
      stack: null,
    });
  }

  res.status(200).json({
    success: true,
    statusCode: 201,
    message: "Review created successfully",
    data: result,
  });
});

export { createReview };
