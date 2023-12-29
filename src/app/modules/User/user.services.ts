import config from "../../config";
import { TPasswordChange, TUser, TUserLogin } from "./user.interface";
import { User } from "./user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { checkToken, getFormattedTime } from "./user.utility";

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
    throw new Error("User not found!");
  }

  //Checking if password
  const passwordCheck = await User.checkHashedPassword(
    payload?.password,
    user?.password as string,
  );

  if (!passwordCheck) {
    throw new Error("Incorrect password!");
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
  // Checking authorization
  const decoded = checkToken(token);

  if (!decoded) {
    throw new Error("Unauthorized Access");
  }

  const user = await User.findById(decoded._id);
  if (!user) {
    throw new Error("Unauthorized Access");
  }

  // checking current password
  const currentPasswordCheck = await bcrypt.compare(
    payload.currentPassword,
    user.password,
  );

  if (!currentPasswordCheck) {
    const time = getFormattedTime(
      user.passwordHistory.currentPasswordCreatedAt,
    );
    throw new Error(
      `Password change failed. Ensure the new password is unique and not among the last 2 used (last used on ${time}).`,
    );
  }

  //checking new password
  for (const item of user.passwordHistory.previousPasswords) {
    const checkResult = await bcrypt.compare(
      payload.newPassword,
      item.password,
    );

    if (checkResult) {
      const time = getFormattedTime(
        user.passwordHistory.currentPasswordCreatedAt,
      );
      throw new Error(
        `Password change failed. Ensure the new password is unique and not among the last 2 used (last used on ${time}).`,
      );
    }
  }

  // hashing new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const previousPasswordObj = {
    password: user.password,
    createdAt: user.passwordHistory.currentPasswordCreatedAt,
  };

  const previousPasswordArray = user.passwordHistory.previousPasswords;

  previousPasswordArray.unshift(previousPasswordObj);

  if (previousPasswordArray.length > 2) {
    previousPasswordArray.pop();
  }

  const newPasswordHistoryObj = {
    currentPasswordCreatedAt: new Date(),
    previousPasswords: previousPasswordArray,
  };

  const result = await User.findOneAndUpdate(
    {
      _id: user._id,
    },
    {
      $set: {
        password: newHashedPassword,
        passwordHistory: newPasswordHistoryObj,
      },
    },
    {
      new: true,
    },
  ).select("-password -passwordHistory -__v");

  return result;
};

export { registerUserIntoDB, loginUserService, changeUserPasswordService };
