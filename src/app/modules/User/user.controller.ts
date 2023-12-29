/* eslint-disable @typescript-eslint/no-explicit-any */
import catchAsync from "../../utils/catchAsync";
import {
  changeUserPasswordService,
  loginUserService,
  registerUserIntoDB,
} from "./user.services";
import status from "http-status";

const registerUser = catchAsync(async (req, res) => {
  const result = await registerUserIntoDB(req.body);

  res.status(status.OK).json({
    success: true,
    statusCode: 201,
    message: "User registered successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const { userData, accessToken } = await loginUserService(req.body);

  res.status(status.OK).json({
    success: true,
    statusCode: 200,
    message: "User login successful",
    data: {
      user: userData,
      token: accessToken,
    },
  });
});

const changeUserPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization as string;
  const result = await changeUserPasswordService(req.body, token);

  res.status(status.OK).json({
    success: true,
    statusCode: 200,
    message: "Password changed successfully",
    data: result,
  });
});

export { registerUser, loginUser, changeUserPassword };
