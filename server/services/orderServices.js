const Order = require("../models/order");

exports.findOrder = (options) => {
  return Order.findOne(options);
};
