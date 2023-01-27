const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");

const expenseControllers = require("../controllers/expenses");

router.post("/addExpense", authMiddleware, expenseControllers.addExpense);

router.get(
  "/getExpenseList/:startDate/:endDate",
  authMiddleware,
  expenseControllers.getAllExpenses
);

router.delete(
  "/deleteExpense/:expenseId",
  authMiddleware,
  expenseControllers.deleteExpense
);

router.get(
  "/expense/downloadAllExpenses",
  authMiddleware,
  expenseControllers.downloadExpenses
);

router.get(
  "/getExpenseDownloadsList",
  authMiddleware,
  expenseControllers.getUserFileDownloadsList
);

router.get(
  "/getExpense/:expenseId",
  authMiddleware,
  expenseControllers.getExpense
);

router.post(
  "/updateExpense/:expenseId",
  authMiddleware,
  expenseControllers.updateExpense
);

module.exports = router;
