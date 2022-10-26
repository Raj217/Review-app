const { check, validationResult } = require("express-validator");

exports.useValidator = [
  check("name").trim().not().isEmpty().withMessage("Name is Missing!"),
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password cannot be empty!")
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 characters long!"),
];
exports.signInValidator = [
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password cannot be empty!"),
];

exports.validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (error.length) {
    return res.status(401).json({ error: error[0].msg });
  }

  next();
};

exports.validatePassword = [
  check("token").trim().not().isEmpty().withMessage("Name is Missing!"),
  check("userId").trim().not().isEmpty().withMessage("Email is invalid!"),
  check("newPassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password cannot be empty!")
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 characters long!"),
];
