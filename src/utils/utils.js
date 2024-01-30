const newError = (code, message) => {
  return Object({ success: false, code, message });
};

module.exports = { newError };
