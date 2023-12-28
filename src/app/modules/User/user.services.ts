import config from "../../config";
import ApplicationError from "../../config/ApplicationError";
import { TPasswordChange, TUser, TUserLogin } from "./user.interface";
import { User } from "./user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getFormattedTime } from "./user.utility";

const registerUserIntoDB = async (payload: TUser) => {
  const result = await User.create(payload);
  const filterdResult = await User.findById(result._id).select(
    "-password -passwordHistory -__v",
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
    _id: user?._id,
    role: user?.role,
    email: user?.email,
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

const changeUserPasswordService = async (
  payload: TPasswordChange,
  token: string,
) => {
  if (!token) {
    throw new Error("Token not found");
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  const user = await User.findById(decoded._id);
  if (!user) {
    throw new Error("User not found");
  }

  // checking current password
  const currentPasswordCheck = await bcrypt.compare(
    payload.currentPassword,
    user.password,
  );

  if (!currentPasswordCheck) {
    const date = user.passwordHistory[0].createdAt;

    throw new Error(
      `Password change failed. Ensure the new password is unique and not among the last 2 used (last used on ${getFormattedTime(
        date,
      )}).`,
    );
  }

  //checking new password
  for (const item of user.passwordHistory) {
    const checkResult = await bcrypt.compare(
      payload.newPassword,
      item.password,
    );

    if (!checkResult) {
      const date = item.createdAt;

      throw new Error(
        `Password change failed. Ensure the new password is unique and not among the last 2 used (last used on ${getFormattedTime(
          date,
        )}).`,
      );
    }
  }

  // hashing new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const time = new Date();
  const passwordLimit = 3;

  user.passwordHistory.unshift({
    password: newHashedPassword,
    createdAt: time,
  });

  if (user.passwordHistory.length > passwordLimit) {
    user.passwordHistory.pop();
  }

  const result = await User.findOneAndUpdate(
    {
      _id: user._id,
    },
    {
      $set: {
        password: newHashedPassword,
        passwordHistory: user.passwordHistory,
      },
    },
    {
      new: true,
    },
  );

  return result;
};

export { registerUserIntoDB, loginUserService, changeUserPasswordService };
