const crypto = require("crypto");

const User = require(`../models/User`);
const ErrorResponse = require(`../utils/errorResponse`);
const sendEmail = require(`../utils/sendEmail`);
// const sendMessage = require(`../utils/sendMessage`);
const asynchandler = require(`../middleware/async`);

//@desc Register user
//@route POST /api/v1/auth/register
// @access Public
exports.register = asynchandler(async (req, res) => {
  const { firstName, lastName, phoneNo, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    phoneNo,
    email,
    password,
    role,
  });

  // grab token and send to email
  const confirmEmailToken = user.generateEmailConfirmToken();

  // Create reset url
  const confirmEmailURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/confirmemail?token=${confirmEmailToken}`;

  const message = `You are receiving this email because you need to confirm your email address. Please make a GET request to: \n\n ${confirmEmailURL}`;

  user.save({ validateBeforeSave: false });
  try {
    await sendEmail({
      email: user.email,
      subject: "Email Confirmation Token",
      message,
    });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    await user.remove();

    return next(
      new ErrorResponse(
        `Email could not be sent. Try Signing up Again after some time.`,
        500
      )
    );
  }
});

/**
 * @desc    Confirm Email
 * @route   GET /api/v1/auth/confirmemail
 * @access  Public
 */
exports.confirmEmail = asynchandler(async (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    return next(new ErrorResponse("Invalid Token", 400));
  }

  const splitToken = token.split(".")[0];
  const confirmEmailToken = crypto
    .createHash("sha256")
    .update(splitToken)
    .digest("hex");

  // get user by token
  const user = await User.findOne({
    confirmEmailToken,
    isEmailConfirmed: false,
  });

  if (!user) {
    return next(new ErrorResponse("Invalid Token", 400));
  }

  // update confirmed to true
  user.confirmEmailToken = undefined;
  user.isEmailConfirmed = true;

  // save
  user.save({ validateBeforeSave: false });
  // const URL = "http://localhost:3000/";
  const URL = "http://venuebazar.com/";
  return res.redirect(URL);
  // return token
  // sendTokenResponse(user, 200, res);
});

// @desc Login user
//@route POST /api/v1/auth/login
// @access Public
exports.login = asynchandler(async (req, res, next) => {
  const { email, password } = req.body;

  // await sendMessage({
  //   message: "logged",
  //   phoneNo: "+923059674167",
  // });

  //Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  //Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  if (!user.isEmailConfirmed) {
    return next(
      new ErrorResponse("Please verify your account before logging in", 401)
    );
  } else if (!user.accountActive) {
    return next(
      new ErrorResponse(
        "Account is disabled. Please contact Administrator",
        401
      )
    );
  } else {
    sendTokenResponse(user, 200, res);
  }
});

// @desc Log user out/ clear cookie
//@route GET /api/v1/auth/logout
// @access Private
exports.logout = asynchandler(async (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc Get current logged in user
//@route POST /api/v1/auth/me
// @access Private
exports.getMe = asynchandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  sendTokenResponse(user, 200, res);
});

// @desc Update user details
//@route PUT /api/v1/auth/updatedetails
// @access Private
exports.updateDetails = asynchandler(async (req, res) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});
// @desc Update password
//@route PUT /api/v1/auth/updatepassword
// @access Private
exports.updatePassword = asynchandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  //Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc Forgot password
//@route POST /api/v1/auth/forgotpassword
// @access Public
exports.forgetPassword = asynchandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken} `;

  const message = `You are receiving this email because you
     (or someone else) has requested the rest of a password.
      Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });
    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse(`Email could not be sent`, 500));
  }
});

// @desc Reset password
//@route PUT /api/v1/auth/resetpassword/:resettoken
// @access Public
exports.resetPassword = asynchandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid Token", 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).json({ success: true, token, user });
};
