import catchAsync from "../../utils/catchAsync";
import { registerUserIntoDB } from "./user.services";

const registerUser = catchAsync(async (req, res) => {
  const result = await registerUserIntoDB(req.body);

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: "User registered successfully",
    data: result,
  });
});

export { registerUser };
