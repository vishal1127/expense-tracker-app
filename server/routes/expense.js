const express = require("express");
const router = express.Router();

const expenseControllers = require("../controllers/expenses");

router.post("/addExpense", expenseControllers.addExpense);

router.get(
  "/getExpenseList/:startDate/:endDate",
  expenseControllers.getAllExpenses
);

router.delete("/deleteExpense/:expenseId", expenseControllers.deleteExpense);

router.get("/expense/downloadAllExpenses", expenseControllers.downloadExpenses);

router.get(
  "/getExpenseDownloadsList",
  expenseControllers.getUserFileDownloadsList
);

router.get("/getExpense/:expenseId", expenseControllers.getExpense);

router.post("/updateExpense/:expenseId", expenseControllers.updateExpense);

module.exports = router;
