const Razorpay = require("razorpay");
const Order = require("../models/order");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "expense-app-secret-key";

exports.purchasePremium = async (req, res, next) => {
  try {
    const user = await User.findAll({
      where: {
        id: req.userId,
      },
    });
    var rzp = new Razorpay({
      key_id: "rzp_test_NAGryNdrcUVvpT",
      key_secret: "cHZfBEoityvyOTc25ORei66m",
    });
    const amount = 2500;

    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        console.log("error while creating payment", err);
        throw new Error(JSON.stringify(err));
      }
      user[0]
        .createOrder({ orderId: order.id, status: "PENDING" })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          console.log("error while sending payment", err);
          throw new Error(err);
        });
    });
  } catch (error) {
    console.log("error while purchase", error);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const user = await User.findAll({
      where: {
        id: req.userId,
      },
    });
    const paymentId = req.body.payment_id;
    const orderId = req.body.order_id;
    const order = await Order.findAll({
      where: {
        orderId: orderId,
      },
    });
    if (order) {
      order[0].paymentId = paymentId;
      order[0].status = "SUCCESSFUL";
      const updateStatus = await order[0].save();
      user[0].isPremium = true;
      const updateUserInfo = await user[0].save();
      const token = jwt.sign(
        {
          email: user[0].email,
          id: user[0].id,
          isPremium: user[0].isPremium,
        },
        SECRET_KEY
      );
      return res.status(202).json({
        token: token,
        message: "Transaction successful",
        success: true,
      });
      //   order
      //     .update({ paymentId: paymentId, status: "SUCCESSFUL" })
      //     .then(() => {
      //       user[0].update({ isPremium: true }).then(() => {
      //         return res
      //           .status(202)
      //           .json({ message: "Transaction successful", success: true });
      //       });
      //     })
      //     .catch((err) => {
      //       throw new Error(err);
      //     });
    }
  } catch (error) {
    console.log("on payment update", error);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};
