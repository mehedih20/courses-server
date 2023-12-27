import config from "../../config";
import { User } from "../User/user.model";
import { TCategory } from "./category.interface";
import { Category } from "./category.model";
import jwt, { JwtPayload } from "jsonwebtoken";

const createCategoryIntoDB = async (payload: TCategory, token: string) => {
  if (!token) {
    return null;
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  if (decoded?.role !== "admin") {
    return null;
  }

  const isUserExist = await User.findById(decoded._id);
  if (!isUserExist) {
    return null;
  }

  const categoryData = { ...payload, createdBy: decoded._id };
  const result = await Category.create(categoryData);
  const responseData = await Category.findById(result._id).select("-__v");
  return responseData;
};

const getAllCategoriesFromDB = async () => {
  const result = await Category.find()
    .populate({ path: "createdBy", select: "_id username email role" })
    .select("-__v");
  return result;
};

export { createCategoryIntoDB, getAllCategoriesFromDB };
