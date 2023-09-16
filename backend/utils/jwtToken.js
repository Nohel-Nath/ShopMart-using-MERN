const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();
  // options for cookie

  const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRE);
  if (isNaN(cookieExpireDays)) {
    return next(new ErrorHandler("Invalid cookie expiration value", 500));
  }

  const options = {
    expires: new Date(Date.now() + cookieExpireDays * 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.cookie("token", token, options);

  res.status(statusCode).json({
    success: true,
    user,
    token,
  });
  return token;
};

module.exports = sendToken;
