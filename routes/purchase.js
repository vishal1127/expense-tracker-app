const purchaseControllers = require("../controllers/purchases");
const authMiddleware = require("../middlewares/auth");

const express = require("express");
const router = express.Router();

router.get(
  "/purchase/buyPremium",
  authMiddleware,
  purchaseControllers.purchasePremium
);

router.post(
  "/purchase/updatePaymentStatus",
  authMiddleware,
  purchaseControllers.updatePaymentStatus
);

module.exports = router;
