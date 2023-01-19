const { Sequelize } = require("sequelize");
const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../utils/database");

exports.getLeaderboard = async (req, res, next) => {
  try {
    const leaderboardList = await User.findAll({
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
    console.log("leaderboard--------->", leaderboardList);
    res.status(200).json({ leaderboardList: leaderboardList, success: true });
  } catch (error) {
    console.log("error getting leaderboard", error);
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};
