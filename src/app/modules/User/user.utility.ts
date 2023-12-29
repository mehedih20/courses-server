import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";

export const getFormattedTime = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hrs = date.getHours();
  const mins = date.getMinutes().toString().padStart(2, "0");
  const timeFormat = hrs < 12 ? "AM" : "PM";

  const requiredTime = `${year}-${month}-${day} at ${
    hrs % 12 || 12
  }:${mins} ${timeFormat}`;

  return requiredTime;
};

export const checkToken = (token: string) => {
  try {
    //Checking if token is undefined
    if (!token) {
      return false;
    }

    //Checking if the token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    //Checking if the token has expired
    if (decoded.exp) {
      const timeNow = Math.round(Date.now() / 1000);
      if (decoded.exp < timeNow) {
        return false;
      }
    }

    return decoded;
  } catch (error) {
    return false;
  }
};
