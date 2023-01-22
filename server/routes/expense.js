const express = require("express");
const router = express.Router();

const expenseControllers = require("../controllers/expenses");

router.post("/addExpense", expenseControllers.addExpense);

router.get("/getExpenseList", expenseControllers.getAllExpenses);

router.delete("/deleteExpense/:expenseId", expenseControllers.deleteExpense);

router.get("/expense/downloadAllExpenses", expenseControllers.downloadExpenses);

router.get(
  "/getExpenseDownloadsList",
  expenseControllers.getUserFileDownloadsList
);

module.exports = router;
