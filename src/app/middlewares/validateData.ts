import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validateData = (schemaObj: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      //Validates the schema object
      await schemaObj.parseAsync(req.body);

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default validateData;
