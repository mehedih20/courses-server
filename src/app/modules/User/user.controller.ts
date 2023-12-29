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
  try {
    const { userData, accessToken } = await loginUserService(req.body);

    res.status(status.OK).json({
      success: true,
      statusCode: 201,
      message: "User login successful",
      data: {
        user: userData,
        token: accessToken,
      },
    });
  } catch (err: any) {
    const errorStatus =
      err.message === "User not found!"
        ? status.NOT_FOUND
        : status.UNAUTHORIZED;

    const errorMessage =
      err.message === "User not found!"
        ? "No user found for the credentials you provided"
        : "Please provide the correct password. Username and password doesn't match.";

    res.status(errorStatus).json({
      success: false,
      message: err.message,
      errorMessage,
      errorDetails: null,
      stack: null,
    });
  }
});

const changeUserPassword = catchAsync(async (req, res) => {
  try {
    const token = req.headers.authorization as string;
    const result = await changeUserPasswordService(req.body, token);

    res.status(status.OK).json({
      success: true,
      statusCode: 200,
      message: "Password changed successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(status.BAD_REQUEST).json({
      success: false,
      statusCode: 400,
      message: err?.message,
      data: null,
    });
  }
});

export { registerUser, loginUser, changeUserPassword };
