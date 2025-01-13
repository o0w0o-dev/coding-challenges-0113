"use strict";

import jwt from "jsonwebtoken";
import { promisify } from "util";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { responseWithUser } from "../utils/responseWithUser.js";
import { User } from "./../models/userModel.js";

const signup = catchAsync(async (req, res, next) => {
  const email = req.body.email?.toLowerCase();
  const { password, passwordConfirm } = req.body;
  if (!email || !password || !passwordConfirm)
    return next(new AppError("Please provide email and password", 400));

  const isExist = !!(await User.findOne({ email }));
  if (isExist) return next(new AppError("The user already exists", 400));

  const newUser = await User.create({ email, password, passwordConfirm });

  responseWithUser(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
  const email = req.body.email?.toLowerCase();
  const { password } = req.body;
  if (!email || !password)
    return next(new AppError("Please provide email and password", 400));

  const user = await User.findOne({ email });
  const isCorrect = user
    ? await user.correctPassword(password, user.password)
    : false;

  if (!user || !isCorrect)
    return next(new AppError("Incorrect email or password", 401));

  responseWithUser(user, 200, res);
});

const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];

  if (!token)
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoded.id);

  if (!freshUser)
    return next(
      new AppError("The user belonging to this token does no longer exist", 401)
    );

  if (freshUser.checkExpires(decoded.iat)) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }

  req.user = freshUser;

  next();
});

const logout = catchAsync(async (req, res, next) => {});

export { signup, login, logout, protect };
