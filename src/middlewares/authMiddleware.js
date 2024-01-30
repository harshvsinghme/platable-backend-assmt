const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { newError } = require("../utils/utils");

const isAuthenticated = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.replace("Bearer ", "");
      const jwtSecret = process.env.ACCESS_TOKEN_SECRET;
      const payload = jwt.verify(token, jwtSecret);

      let userRecord = await User.findById(payload._id).lean();

      if (!userRecord)
        throw newError(0, "session expired, please log in again");
      req.user = userRecord;
      next();
    } else throw newError(0, "session expired, please log in again");
  } catch (error) {
    error.message = [
      "jwt expired",
      "invalid signature",
      "jwt malformed",
    ].includes(error.message)
      ? "session expired, please log in again"
      : error.message;
    res.status(401).json({ success: false, message: error.message });
  }
};

module.exports = { isAuthenticated };
