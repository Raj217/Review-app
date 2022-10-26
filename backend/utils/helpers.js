const crypto = require("crypto");

function sendError({ res, message, status = 401 }) {
  return res.status(status).json({ error: message });
}

function sendSuccess({ res, message, status = 201 }) {
  return res.status(status).json({ message: message });
}

function generateRandomBytes() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buff) => {
      if (err) reject(err);
      const buffString = buff.toString("hex");
      resolve(buffString);
    });
  });
}

module.exports = { sendError, sendSuccess, generateRandomBytes };
