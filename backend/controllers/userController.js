const express = require("express");
const userDb = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const bcrypt = require("bcryptjs");
const sendToken = require("../utils/jwtToken");
const ApiFeatures = require("../utils/apiFeatures");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

const registerAUser = catchAsyncErrors(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 200,
    crop: "scale",
  });
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone) {
    return next(new ErrorHandler("Please Enter All The Details", 401));
  }

  // Check if the user already exists
  const existingUser = await userDb.findOne({ email });
  if (existingUser) {
    if (existingUser.isBanned) {
      return res.status(400).json({
        error:
          "User with this email is banned and cannot register a new account",
      });
    }
    return res
      .status(400)
      .json({ error: "User already exists with this email" });
  }

  const user = await userDb.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    phone,
  });

  // Save the user to the database
  await user.save();

  sendToken(user, 200, res);
});

const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await userDb.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email", 401));
  }

  // Check if user is banned
  if (user.isBanned) {
    return next(new ErrorHandler("You are blocked and cannot log in", 403));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid password", 401));
  }

  sendToken(user, 200, res);
});

const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
//all-user-admin
const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const usersCount = await userDb.countDocuments({
    isBanned: false,
  });
  const apiFeatures = new ApiFeatures(
    userDb.find({ isBanned: false }),
    req.query
  ).search1(); // Apply the search1() filter
  const users = await apiFeatures.query;
  res.status(200).json({
    success: true,
    users,
    usersCount,
  });
});

// Find user by userId (excluding banned users)//admin
const findUserById = catchAsyncErrors(async (req, res, next) => {
  // Check if the requester is an admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only admins can perform this operation.",
    });
  }

  const { userId } = req.params;

  // Find the user by userId, excluding the cpassword field
  const user = await userDb
    .findOne({
      _id: userId,
      isBanned: false,
    })
    .select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found or user is banned.",
    });
  }

  res.status(200).json({
    success: true,
    user,
  });
});

const forgetPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await userDb.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/user/password-reset/${resetToken}`;
  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `E-commerce Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

const resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await userDb.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});

// Get Single User Detail
const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;

  const user = await userDb.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//update user password
const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;

  const user = await userDb.findById(userId).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }
  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

//update user profile
const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };
  if (req.body.avatar !== "") {
    const user = await userDb.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 200,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await userDb.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user,
  });
});

// Delete User -- User
const deleteMyAccount = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;

  // Find the user by their ID
  const user = await userDb.findById(userId);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${userId}`, 400)
    );
  }

  const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);
  // Delete the user and associated data
  await Promise.all([userDb.findByIdAndRemove(userId)]);

  res.status(200).json({
    success: true,
    message: "Your account has been deleted successfully",
  });
});

// update User Role -- Admin
const updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await userDb.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

//admin
const blockUser = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.id;

  // Find the user by ID
  const user = await userDb.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (user.role === "admin") {
    return next(new ErrorHandler("You cannot block an admin user", 400));
  }
  // Check if the user is already banned
  if (user.isBanned) {
    return next(new ErrorHandler("User is already blocked", 400));
  }
  // Block the user
  user.isBanned = true;
  await user.save();

  res.status(200).json({ message: "User has been blocked successfully" });
});
//admin
const getBlockedList = catchAsyncErrors(async (req, res, next) => {
  // Find all blocked users
  const blockedUsers = await userDb.find({ isBanned: true });

  res.status(200).json({ blockedUsers });
});
//admin
const unblockUser = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.id;

  // Find the user by ID
  const user = await userDb.findById(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Check if the user is already unblocked
  if (!user.isBanned) {
    return res.status(400).json({ error: "User is already unblocked" });
  }

  // Unblock the user
  user.isBanned = false;
  await user.save();

  res.status(200).json({ message: "User has been unblocked successfully" });
});

// Delete User --Admin
const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await userDb.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);

  // Check if the user to be deleted is an admin
  if (user.role === "admin") {
    return next(new ErrorHandler("You cannot delete an admin account", 403));
  }

  await userDb.findByIdAndRemove(req.params.id);

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

module.exports = {
  registerAUser,
  loginUser,
  logoutUser,
  getAllUsers,
  findUserById,
  forgetPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  deleteMyAccount,
  updateUserRole,
  blockUser,
  getBlockedList,
  unblockUser,
  deleteUser,
};
