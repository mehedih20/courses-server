import config from "../../config";
import ApplicationError from "../../config/ApplicationError";
import { TUser, TUserLogin } from "./user.interface";
import { User } from "./user.model";
import jwt from "jsonwebtoken";

const registerUserIntoDB = async (payload: TUser) => {
  const result = await User.create(payload);
  const filterdResult = await User.findById(result._id).select(
    "-password -__v",
  );

  return filterdResult;
};

const loginUserService = async (payload: TUserLogin) => {
  const user = await User.findOne({ username: payload.username });

  if (!user) {
    throw new ApplicationError("User not found");
  }

  //Checking if password
  const passwordCheck = await User.checkHashedPassword(
    payload?.password,
    user?.password as string,
  );

  if (!passwordCheck) {
    throw new ApplicationError("Password does not match");
  }

  const jwtPayload = {
    username: user?.username,
    role: user?.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "15d",
  });

  const userData = {
    _id: user?._id,
    username: user?.username,
    email: user?.email,
    role: user?.role,
  };

  return {
    userData,
    accessToken,
  };
};

export { registerUserIntoDB, loginUserService };
