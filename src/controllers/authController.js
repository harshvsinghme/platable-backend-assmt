const authService = require("../services/authService");

const getController = (req, res) => {
  try {
    const result = authService.getService();

    if (!result.success) throw { success: false, message: result.message };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { getController };
