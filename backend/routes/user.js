const express = require("express");
const {
  create,
  verifyEmail,
  resendVerificationEmail,
  forgetPassword,
  resetPassword,
  signIn,
} = require("../controller/user");
const {
  useValidator,
  validate,
  validatePassword,
  signInValidator,
} = require("../middlewares/validator");

const router = express.Router();
router.post("/create", useValidator, validate, create);
router.post("/sign-in", signInValidator, validate, signIn);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification-email", resendVerificationEmail);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", validatePassword, validate, resetPassword);

module.exports = router;
