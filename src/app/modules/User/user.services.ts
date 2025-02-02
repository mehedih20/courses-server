import config from "../../config";
import { TPasswordChange, TUser, TUserLogin } from "./user.interface";
import { User } from "./user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { checkToken, getFormattedTime } from "./user.utility";

//Register user
const registerUserIntoDB = async (payload: TUser) => {
  const result = await User.create(payload);
  const filterdResult = await User.findById(result._id).select(
    "-password -passwordHistory -__v",
  );

  return filterdResult;
};

// Logging in user
const loginUserService = async (payload: TUserLogin) => {
  const user = await User.findOne({ username: payload.username });

  if (!user) {
    throw new Error("User not found");
  }

  //Checking if the provided password is matched
  const passwordCheck = await User.checkHashedPassword(
    payload?.password,
    user?.password as string,
  );

  if (!passwordCheck) {
    throw new Error("Incorrect password");
  }

  // Payload for jwt token
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

// Change user password
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

  const currentPasswordTime = getFormattedTime(
    user.passwordHistory.currentPasswordCreatedAt,
  );

  // verifying current password
  const currentPasswordCheck = await bcrypt.compare(
    payload.currentPassword,
    user.password,
  );

  if (!currentPasswordCheck) {
    throw new Error(
      `Password change failed. Ensure the new password is unique and not among the last 2 used (last used on ${currentPasswordTime}).`,
    );
  }

  //checking if new password matches the previous ones
  if (payload.currentPassword === payload.newPassword) {
    throw new Error(
      `Password change failed. Ensure the new password is unique and not among the last 2 used (last used on ${currentPasswordTime}).`,
    );
  }

  for (const item of user.passwordHistory.previousPasswords) {
    const checkResult = await bcrypt.compare(
      payload.newPassword,
      item.password,
    );

    if (checkResult) {
      throw new Error(
        `Password change failed. Ensure the new password is unique and not among the last 2 used (last used on ${currentPasswordTime}).`,
      );
    }
  }

  // hashing new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  //creating password history collection
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
