const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
// const { promisify } = require('util');

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const {
    fullName,
    email,
    phone,
    school,
    password,
    passwordConfirm,
    pin,
  } = req.body;

  const user = await User.create({
    fullName,
    email,
    phone,
    school,
    password,
    passwordConfirm,
    pin,
  });

  res.status(201).json({
    status: "success",
    message: "Account created successfully",
    data: {
      user,
    },
  });
});

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exists
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // Check if User exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  // if everything is ok, send token to client
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});
