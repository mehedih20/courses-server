/* eslint-disable @typescript-eslint/no-explicit-any */
import catchAsync from "../../utils/catchAsync";
import {
  changeUserPasswordService,
  loginUserService,
  registerUserIntoDB,
} from "./user.services";

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

const changeUserPassword = catchAsync(async (req, res) => {
  try {
    const token = req.headers.authorization as string;
    const result = await changeUserPasswordService(req.body, token);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Password change successful",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: err.message,
      data: null,
    });
  }
});

export { registerUser, loginUser, changeUserPassword };
