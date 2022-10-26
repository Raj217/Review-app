const EmailVerificationToken = require("../models/emailVerificationToken");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const { isValidObjectId } = require("mongoose");
const { sendError, sendSuccess } = require("./helpers");

function generateOTP(otpLength = 6) {
  let OTP = "";
  for (let i = 1; i <= otpLength; i++) {
    OTP += Math.round(Math.random() * 9);
  }
  return OTP;
}

function generateMailTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 2525,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASS,
    },
  });
}

async function saveOTP({ userID, OTP }) {
  const newEmailVerificationToken = EmailVerificationToken({
    owner: userID,
    token: OTP,
  });

  await newEmailVerificationToken.save();
  return;
}

async function sendMail({
  res,
  email,
  transport,
  subject,
  html,
  successMessage,
}) {
  await transport.sendMail({
    from: "reviewapp716@gmail.com",
    to: email,
    subject: subject,
    html: html,
  });

  return sendSuccess({
    res,
    message: successMessage,
  });
}

async function sendVerificationOTP({ res, userID }) {
  const user = await User.findById(userID);
  if (!user) {
    sendError({ res, message: "User not found", status: 404 });
    return false;
  }

  const token = await EmailVerificationToken.findOne({ owner: userID });
  if (token) {
    await EmailVerificationToken.findByIdAndDelete(token._id);
  }

  OTP = generateOTP();
  await saveOTP({ userID: userID, OTP: OTP });
  var transport = generateMailTransporter();
  return sendMail({
    res,
    email: user.email,
    transport,
    subject: "Email Verification",
    html: `
            <p>Welcome ${user.name}!!!</p>
            <p> Your Verification ID </p>
            <h1>${OTP}</h1>
        `,
    message: "Verification OTP has been sent. Please verify your mail id",
  });
}

async function mailVerificationCheck({ res, userID }) {
  if (!isValidObjectId(userID)) {
    sendError({ res, message: "Invalid User" });
    return false;
  }

  const user = await User.findById(userID);
  if (!user) {
    sendError({ res, message: "User not found!", status: 404 });
    return false;
  }

  if (user.isVerified) {
    sendError({ res, message: "User is already verified" });
    return false;
  }
  return true;
}

module.exports = {
  generateOTP,
  generateMailTransporter,
  saveOTP,
  sendMail,
  sendVerificationOTP,
  mailVerificationCheck,
};
