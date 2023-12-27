import catchAsync from "../../utils/catchAsync";
import { loginUserService, registerUserIntoDB } from "./user.services";

const registerUser = catchAsync(async (req, res) => {
  const result = await registerUserIntoDB(req.body);

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: "User registered successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const { userData, accessToken } = await loginUserService(req.body);

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: "User login successful",
    data: {
      user: userData,
      token: accessToken,
    },
  });
});

export { registerUser, loginUser };
