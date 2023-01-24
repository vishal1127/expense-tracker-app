const ForgotPasswordRequest = require("../models/forgot-password-requests");

exports.findRequest = (options) => {
  return ForgotPasswordRequest.findOne(options);
};
