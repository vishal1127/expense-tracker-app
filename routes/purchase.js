const purchaseControllers = require("../controllers/purchases");

const express = require("express");
const router = express.Router();

router.get("/purchase/buyPremium", purchaseControllers.purchasePremium);

router.post(
  "/purchase/updatePaymentStatus",
  purchaseControllers.updatePaymentStatus
);

module.exports = router;
