const User = require("../models/user");

exports.findUser = (options) => {
  return User.findOne(options);
};
exports.createUser = (data) => {
  return User.create(data);
};
exports.getExpenses = (req, options) => {
  return req.user.getExpenses(options);
};
exports.createExpense = (req, data) => {
  return req.user.createExpense(data);
};
exports.findAllUsers = (options) => {
  return User.findAll(options);
};
exports.createOrder = (req, data) => {
  return req.user.createOrder(data);
};

exports.addFileUrl = (req, data) => {
  return req.user.createDownloadedExpenseReport(data);
};

exports.getUserDownloadsList = (req) => {
  return req.user.getDownloadedExpenseReports();
};

exports.getSingleExpense = (req, options) => {
  return req.user.getExpenses(options);
};
