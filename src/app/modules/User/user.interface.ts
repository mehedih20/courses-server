/* eslint-disable no-unused-vars */

import { Model } from "mongoose";

export type TUserLogin = {
  username: string;
  password: string;
};

export type TUser = {
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
};

export interface UserModel extends Model<TUser> {
  checkHashedPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
