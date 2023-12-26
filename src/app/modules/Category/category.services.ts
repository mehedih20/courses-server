import { TCategory } from "./category.interface";
import { Category } from "./category.model";

const createCategoryIntoDB = async (payload: TCategory) => {
  const result = Category.create(payload);
  return result;
};
const getAllCategoriesFromDB = async () => {
  const result = Category.find().select("-__v");
  return result;
};

export { createCategoryIntoDB, getAllCategoriesFromDB };
