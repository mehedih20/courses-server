import { createReviewIntoDB } from "./review.services";
import catchAsync from "../../utils/catchAsync";
import status from "http-status";

const createReview = catchAsync(async (req, res) => {
  try {
    const token = req.headers.authorization;
    const result = await createReviewIntoDB(req.body, token as string);

    res.status(status.OK).json({
      success: true,
      statusCode: 201,
      message: "Review created successfully",
      data: result,
    });
  } catch (error) {
    res.status(status.UNAUTHORIZED).json({
      success: false,
      errorMessage:
        "You do not have the necessary permissions to access this resource.",
      errorDetails: null,
      stack: null,
    });
  }
});

export { createReview };
