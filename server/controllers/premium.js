const { Sequelize } = require("sequelize");
const Expense = require("../models/expense");
const sequelize = require("../utils/database");
const UserServices = require("../services/userServices");

exports.getLeaderboard = async (req, res, next) => {
  try {
    const leaderboardList = await UserServices.findAllUsers({
      attributes: [
        "id",
        "name",
        [Sequelize.fn("SUM", sequelize.col("expenses.amount")), "totalAmount"],
      ],
      include: [
        {
          model: Expense,
          attributes: [],
        },
      ],
      group: ["user.id"],
      order: [["totalAmount", "DESC"]],
    });
    res.status(200).json({ leaderboardList: leaderboardList, success: true });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};
