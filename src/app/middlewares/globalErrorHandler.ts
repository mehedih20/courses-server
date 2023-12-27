/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError, ZodIssue } from "zod";

const validationErrorMessageGenerator = (
  err: mongoose.Error.ValidationError,
): string => {
  let errorMessage = "";
  Object.values(err.errors).map((item) => {
    errorMessage += `${item.message} `;
  });

  return errorMessage;
};

const zodErrorMessageGenerator = (err: ZodError): string => {
  let errorMessage = "";

  err?.issues.map(
    (item: ZodIssue) =>
      (errorMessage += `${
        item.path[item.path.length - 1]
      } is ${item.message.toLowerCase()}. `),
  );

  return errorMessage;
};

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = 500;
  let message = "Something went wrong";
  let errorMessage;
  let errorDetails;

  if (err instanceof ZodError) {
    //zod error
    message = "Validation Error";
    errorMessage = zodErrorMessageGenerator(err);
  } else if (err?.name === "CastError") {
    //cast error
    message = "Invalid ID";
    errorMessage = `${JSON.parse(err?.stringValue)} is not a valid ID!`;
  } else if (err?.name === "ValidationError") {
    //mongoose validation error
    message = "Validation Error";
    errorMessage = validationErrorMessageGenerator(err);
  } else if (err?.code === 11000) {
    //duplicate error
    message = "Duplicate key not allowed!";
    const extractingField = Object.keys(err.keyValue)[0];
    errorMessage = `${err?.keyValue[extractingField]} is a duplicate value`;
  } else if (err instanceof Error) {
    message = err.message;
    errorMessage = "";
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    errorDetails: err || errorDetails,
    stack: err?.stack || null,
  });
};

export default globalErrorHandler;
