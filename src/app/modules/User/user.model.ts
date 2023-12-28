import { Schema, model } from "mongoose";
import {
  TPasswordChange,
  TPasswordHistory,
  TUser,
  TUserLogin,
  UserModel,
} from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";

export const userLoginSchema = new Schema<TUserLogin>({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const passwordChangeSchema = new Schema<TPasswordChange>({
  currentPassword: {
    type: String,
    required: true,
  },
  newPassword: {
    type: String,
    required: true,
  },
});

const passwordHistorySchema = new Schema<TPasswordHistory>(
  {
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
    },
  },
  {
    _id: false,
  },
);

const userSchema = new Schema<TUser, UserModel>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    passwordHistory: [passwordHistorySchema],
  },
  {
    timestamps: true,
  },
);

// Hashing the user password using pre hook and bcrypt
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );

  const password = this.password;
  const time = new Date();
  this.passwordHistory.unshift({ password, createdAt: time });

  next();
});

// Verifying the hashed password
userSchema.statics.checkHashedPassword = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>("User", userSchema);
