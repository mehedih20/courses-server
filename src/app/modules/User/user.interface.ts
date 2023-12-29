/* eslint-disable no-unused-vars */

import { Model } from "mongoose";

export type TUserLogin = {
  username: string;
  password: string;
};

export type TPasswordChange = {
  currentPassword: string;
  newPassword: string;
};

export type TPassword = {
  password: string;
  createdAt: Date;
};

export type TPasswordHistory = {
  currentPasswordCreatedAt: Date;
  previousPasswords: [TPassword];
};

export type TUser = {
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  passwordHistory: TPasswordHistory;
};

export interface UserModel extends Model<TUser> {
  checkHashedPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
