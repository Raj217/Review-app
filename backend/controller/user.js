const EmailVerificationToken = require("../models/emailVerificationToken");
const User = require("../models/user");
const { isValidObjectId } = require("mongoose");
const jwt = require("jsonwebtoken");

const {
  sendVerificationOTP,
  mailVerificationCheck,
  generateMailTransporter,
  sendMail,
} = require("../utils/mail");

const {
  sendError,
  sendSuccess,
  generateRandomBytes,
} = require("../utils/helpers");
const PasswordResetToken = require("../models/passwordResetToken");

/**
 * Create a new user if email is not already in use and send a verification otp on the email id
 */
async function create(req, res) {
  const { name, email, password } = req.body;

  const oldUser = await User.findOne({ email });
  if (oldUser)
    return sendError({ res, message: "This email is already in use!" });

  const newUser = User({ name, email, password });
  await newUser.save();

  return sendVerificationOTP({ res, userID: newUser._id });
}
/**
 * Verify OTP sent to the mail
 */
async function verifyEmail(req, res) {
  const { userID, OTP } = req.body;
  if (!(await mailVerificationCheck({ res, userID }))) return;

  const user = await User.findById(userID);

  const token = await EmailVerificationToken.findOne({ owner: user._id });
  if (!token) return sendVerificationOTP({ res, userID });

  const isMatched = await token.compareToken(OTP);
  if (!isMatched) return sendError({ res, message: "Please submit valid OTP" });

  user.isVerified = true;
  await user.save();

  await EmailVerificationToken.findByIdAndDelete(token._id);
  return sendSuccess({ res, message: "Your email has been verified" });
}

/**
 * Resend Verification mail
 */
async function resendVerificationEmail(req, res) {
  const { userID } = req.body;

  if (!(await mailVerificationCheck({ res, userID }))) return;
  sendVerificationOTP({ res, userID });
}

async function forgetPassword(req, res) {
  console.log(await generateRandomBytes());

  const { email } = req.body;
  if (!email) return sendError({ res, message: "Email is missing!" });

  const user = await User.findOne({ email });
  if (!user) return sendError({ res, message: "User not found", status: 404 });

  const tempToken = await PasswordResetToken.findOne({ owner: user._id });
  let token;
  if (tempToken) {
    await PasswordResetToken.findByIdAndDelete(tempToken._id);
  }
  token = await generateRandomBytes();
  const newPasswordResetToken = await PasswordResetToken({
    owner: user._id,
    token,
  });
  await newPasswordResetToken.save();
  const resetLink = `http:localhost:8000/api/user/reset-password?token=${token}&id=${user._id}`;
  var transport = generateMailTransporter();
  return sendMail({
    res,
    email: user.email,
    transport,
    subject: "Reset Password",
    html: `
      <h1>Reset Password Linke</h1>
      <a href="${resetLink}">Click here</a>
    `,
    sendMessage: "Password link has been sent",
  });
}

async function resetPassword(req, res) {
  const { token, userId, newPassword } = req.body;

  if (!token.trim() || !isValidObjectId(userId))
    return sendError(res, "Invalid response!");

  const resetToken = await PasswordResetToken.findOne({ owner: userId });
  if (!resetToken)
    return sendError({
      res,
      message:
        "Unautorized access, User did not ask for reseting the password!",
      status: 404,
    });

  const matched = await resetToken.compareToken(token);
  if (!matched)
    return sendError({ res, message: "Unauthorized access, invalid request!" });

  const user = await User.findById(userId);

  const oldPasswordMatched = await user.comparePassword(newPassword);
  if (oldPasswordMatched)
    return sendError({
      res,
      message: "The new password must be different then the previous one!",
    });

  user.password = newPassword;
  await user.save();

  const transport = generateMailTransporter();
  await sendMail({
    res,
    email: user.email,
    transport,
    subject: "Password Reset Successfully",
    html: `
      <h1>Password Reset Successfully</h1>
    `,
    sendMessage: "Password Reset Successfully",
  });

  await PasswordResetToken.findByIdAndDelete(resetToken._id);

  next();
}

async function signIn(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return sendError({ res, message: "User not found!", status: 404 });

  const matched = user.comparePassword(password);
  if (!matched) return sendError({ res, message: "Password Mismatch!" });

  const jwtToken = jwt.sign({ userID: user._id }, process.env.JWT_PRIVATE_KEY);

  sendSuccess({ res, message: `Sign in Token: ${jwtToken}` });
}

module.exports = {
  create,
  verifyEmail,
  resendVerificationEmail,
  forgetPassword,
  resetPassword,
  signIn,
};
