const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authenticate = async (username, password) => {
  let response = { success: false, message: "", accessToken: "" };

  // check if user already exists
  let userRecord = await User.findOne({ username });

  // if already exists
  if (userRecord) {
    // validate password
    const validPassword = await bcryptjs.compare(password, userRecord.password);

    // if valid password
    if (validPassword) {
      // generate token with user id
      const token = jwt.sign(
        { _id: userRecord._id },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
        }
      );

      // set success response
      response.success = true;
      response.message = "authentication successful";
      response.accessToken = token;
    } else {
      // set failure response
      // as per security best practices, don't tell the user that exactly what is wrong
      response.message = "either username or password or both are wrong";
    }
  } else {
    // hash password
    const hashedPassword = await bcryptjs.hash(password, 12);

    // save user record and return inserted record
    userRecord = await User.create({ username, password: hashedPassword });

    // generate token with user id
    const token = jwt.sign(
      { _id: userRecord._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
      }
    );

    // set success response
    response.success = true;
    response.message = "authentication successful";
    response.accessToken = token;
  }

  return response;
};

module.exports = { authenticate };
