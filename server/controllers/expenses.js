const sequelize = require("../utils/database");
const UserServices = require("../services/userServices");
const S3Services = require("../services/S3Services");

exports.addExpense = async (req, res, next) => {
  const { amount, category, description } = req.body;
  try {
    const newExpense = await UserServices.createExpense(req, {
      amount: amount,
      category: category,
      description: description,
    });
    return res.status(201).json({
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
    const allExpenses = await UserServices.getExpenses(req);
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
    const expenseToDelete = await UserServices.getExpenses(req, {
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

exports.downloadExpenses = async (req, res, next) => {
  try {
    const allExpenses = await UserServices.getExpenses(req);
    const stringifiedExpenses = JSON.stringify(allExpenses);
    const userId = req.user.id;
    const fileName = `Expenses${userId}/${new Date()}.txt`;
    const fileUrl = await S3Services.uploadToS3(stringifiedExpenses, fileName);
    const fileUrladded = await UserServices.addFileUrl(req, {
      fileUrl: fileUrl,
    });
    res.status(200).json({ fileUrl, success: true });
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .json({ message: "Something went wrong", success: false, error: error });
  }
};

exports.getUserFileDownloadsList = async (req, res, next) => {
  try {
    const userFileDownloadsList = await UserServices.getUserDownloadsList(req);
    res
      .status(200)
      .json({ downloadList: userFileDownloadsList, success: true });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};
