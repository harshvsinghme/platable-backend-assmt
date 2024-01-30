const authService = require("../services/authService");
const { newError } = require("../utils/utils");

const authenticate = async (req, res) => {
  try {
    //Extract values from request body
    const { name, phone, password } = req.body;

    //sanity checks(data validations)
    if (!name) {
      throw newError(400, "user's name can not be empty");
    }

    if (!phone) {
      throw newError(400, "user's phone can not be empty");
    }

    if (!password) {
      throw newError(400, "user's password can not be empty");
    }

    //capture the result of authentication attempt
    const result = await authService.authenticate(name, phone, password);

    //if authentication failed
    if (!result.success) throw newError(500, result.message);

    //authentication successful
    res.status(200).json(result);
  } catch (error) {
    //fallback aka error handling
    let defaultError = {};

    defaultError.code = error.code ?? 500;
    defaultError.message = error.message ?? "something went wrong";

    res
      .status(defaultError.code)
      .json({ success: false, message: defaultError.message });
  }
};

module.exports = { authenticate };
