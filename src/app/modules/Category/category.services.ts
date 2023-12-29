import { User } from "../User/user.model";
import { checkToken } from "../User/user.utility";
import { TCategory } from "./category.interface";
import { Category } from "./category.model";

const createCategoryIntoDB = async (payload: TCategory, token: string) => {
  // Checking authorization
  const decoded = checkToken(token);

  if (!decoded) {
    throw new Error("Unauthorized Access");
  }
  if (decoded?.role !== "admin") {
    throw new Error("Unauthorized Access");
  }

  const isUserExist = await User.findById(decoded._id);
  if (!isUserExist) {
    throw new Error("Unauthorized Access");
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
