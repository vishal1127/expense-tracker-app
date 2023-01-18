const Expense = require("../models/expense");
const User = require("../models/user");

exports.getLeaderboard = async (req, res, next) => {
  try {
    const leaderboardList = [];
    const users = await User.findAll();
    for (const user of users) {
      let totalAmount = 0;
      const userExpenses = await user.getExpenses();
      for (const expense of userExpenses) {
        totalAmount += expense.amount;
      }
      leaderboardList.push({
        name: user.name,
        totalExpense: totalAmount,
      });
    }
    console.log("leaderboard--------->", leaderboardList);
    res.status(200).json({ leaderboardList: leaderboardList, success: true });
  } catch (error) {
    console.log("error getting leaderboard", error);
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};
