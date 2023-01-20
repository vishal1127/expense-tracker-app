const sequelize = require("../utils/database");

const Expense = require("../models/expense");
const User = require("../models/user");

exports.addExpense = async (req, res, next) => {
  const { amount, category, description } = req.body;
  try {
    const user = await User.findAll({
      where: {
        id: req.userId,
      },
    });
    const newExpense = await user[0].createExpense({
      amount: amount,
      category: category,
      description: description,
    });
    return res
      .status(201)
      .json({
        expense: newExpense,
        message: "Expense successfuly added",
        success: true,
      });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Somthing went wrong", success: false });
  }
};

exports.getAllExpenses = async (req, res, next) => {
  try {
    const user = await User.findAll({
      where: {
        id: req.userId,
      },
    });
    const allExpenses = await user[0].getExpenses();
    res.status(201).send(allExpenses);
    // res.send(201).json({ ExpenseList: allExpenses, success: true });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

exports.deleteExpense = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  try {
    const user = await User.findAll({
      where: {
        id: req.userId,
      },
    });
    const expenseToDelete = await user[0].getExpenses({
      where: {
        id: expenseId,
      },
    });
    const deletedExpense = expenseToDelete[0].destroy();
    if (deletedExpense) {
      res
        .status(200)
        .json({ message: "Expense deleted successfully", success: true });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Something went wrong");
  }
};
