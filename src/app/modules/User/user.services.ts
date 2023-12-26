import { TUser } from "./user.interface";
import { User } from "./user.model";

const registerUserIntoDB = async (payload: TUser) => {
  const result = await User.create(payload);
  const filterdResult = await User.findById(result._id).select(
    "-password -__v",
  );

  return filterdResult;
};

export { registerUserIntoDB };
