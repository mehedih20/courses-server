import { NextFunction, Request, RequestHandler, Response } from "express";
import status from "http-status";

const catchAsync = (func: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch((err) => {
      // Handling invalid categoryId error
      if (err.message === "Invalid categoryId") {
        res.status(status.BAD_REQUEST).json({
          success: false,
          message: err.message,
          errorMessage: "Please provide a valid and existing categoryId.",
          errorDetails: null,
          stack: null,
        });
      }

      // Handling unauthorized access
      if (err.message === "Unauthorized Access") {
        res.status(status.UNAUTHORIZED).json({
          success: false,
          message: err.message,
          errorMessage:
            "You do not have the necessary permissions to access this resource.",
          errorDetails: null,
          stack: null,
        });
      }

      //Handing user not found
      if (err.message === "User not found") {
        res.status(status.NOT_FOUND).json({
          success: false,
          message: err.message,
          errorMessage: "No user found for the credentials you provided",
          errorDetails: null,
          stack: null,
        });
      }

      //Handling password does not match

      if (err.message === "Incorrect password") {
        res.status(status.UNAUTHORIZED).json({
          success: false,
          message: err.message,
          errorMessage:
            "Please provide the correct password. Username and password doesn't match.",
          errorDetails: null,
          stack: null,
        });
      }

      // Handling changing password error
      if (err.message.includes("Password change failed")) {
        res.status(status.BAD_REQUEST).json({
          success: false,
          statusCode: 400,
          message: err?.message,
          data: null,
        });
      }

      next(err);
    });
  };
};

export default catchAsync;
