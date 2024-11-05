import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../constant/env";
import { Response, NextFunction } from "express";
import { CustomRequest } from "../controller/User";
import ApiError from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResonse";

const authUser = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"];
  try {
    if (!token) {
      throw new ApiError(401, "Access Denied !");
    }
    // @ts-ignore
    const { data } = jwt.verify(token, JWT_ACCESS_SECRET);
    req.id = data.id;
    next();
  } catch (error) {
    res.status(401).json(new ApiResponse((error as Error).message, null, 401));
  }
};

export default authUser;
