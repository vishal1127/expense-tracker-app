const sequelize = require("../utils/database");
const UserServices = require("../services/userServices");
const S3Services = require("../services/S3Services");
const { Op } = require("sequelize");
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
    // const allExpensesCount
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;
    const pageSize = parseInt(req.query.pageSize);
    const page = parseInt(req.query.page) || 1;
    const allExpenses = await UserServices.getExpenses(req, {
      where: {
        createdAt: {
          [Op.and]: [{ [Op.gte]: startDate }, { [Op.lte]: endDate }],
        },
      },
      offset: (page - 1) * pageSize ? (page - 1) * pageSize : 0,
      limit: pageSize ? pageSize : null,
    });
    const totalCount = await UserServices.countTotalExpenses(req, {
      where: {
        createdAt: {
          [Op.and]: [{ [Op.gte]: startDate }, { [Op.lte]: endDate }],
        },
      },
    });
    res.status(201).json({
      expenseList: allExpenses,
      currentPage: page,
      hasNextPage: pageSize * page < totalCount,
      hasPrevPage: page > 1,
      nextPage: page + 1,
      prevPage: page - 1,
      lastPage: Math.ceil(totalCount / pageSize),
      success: true,
    });
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

exports.getExpense = async (req, res, next) => {
  try {
    const expenseId = req.params.expenseId;
    const expenseData = await UserServices.getSingleExpense(req, {
      where: {
        id: expenseId,
      },
    });
    res.status(200).json({ expenseData: expenseData, success: true });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

exports.updateExpense = async (req, res, next) => {
  try {
    const { amount, category, description } = req.body;
    const expenseId = req.params.expenseId;
    const expenseData = await UserServices.getSingleExpense(req, {
      where: {
        id: expenseId,
      },
    });
    expenseData[0].amount = amount;
    expenseData[0].category = category;
    expenseData[0].description = description;
    expenseData[0].save();
    res
      .status(200)
      .json({ message: "Expense updated successfuly", success: true });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};
