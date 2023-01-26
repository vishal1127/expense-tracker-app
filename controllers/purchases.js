const Razorpay = require("razorpay");
const UserServices = require("../services/userServices");
const OrderServices = require("../services/orderServices");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "expense-app-secret-key";

exports.purchasePremium = async (req, res, next) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 2500;

    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        console.log("Error:", err);
        throw new Error(JSON.stringify(err));
      }
      const newOrder = await UserServices.createOrder(req, {
        orderId: order.id,
        status: "PENDING",
      });
      return res.status(201).json({ order, key_id: rzp.key_id });
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const paymentId = req.body.payment_id;
    const orderId = req.body.order_id;
    const order = await OrderServices.findOrder({
      where: {
        orderId: orderId,
      },
    });
    if (order) {
      order.paymentId = paymentId;
      order.status = "SUCCESSFUL";
      const updateStatus = await order.save();
      req.user.isPremium = true;
      const updateUserInfo = await req.user.save();
      const token = jwt.sign(
        {
          email: req.user.email,
          id: req.user.id,
          isPremium: req.user.isPremium,
        },
        SECRET_KEY
      );
      return res.status(202).json({
        token: token,
        message: "Transaction successful",
        success: true,
      });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};
